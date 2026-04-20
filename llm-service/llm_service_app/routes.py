import logging
import time
import uuid

from flask import Blueprint, Response, current_app, request, stream_with_context

from llm_service_app.llm import build_llm_request_curl, create_chat_and_messages
from llm_service_app.sse import sse_data, sse_json

storyboard_blueprint = Blueprint("storyboard", __name__)
logger = logging.getLogger(__name__)


@storyboard_blueprint.get("/health")
def health():
    return {"ok": True}


@storyboard_blueprint.post("/api/generate")
def generate():
    payload = request.get_json(silent=True) or {}
    app_config = current_app.config["APP_CONFIG"]
    request_id = uuid.uuid4().hex[:12]
    started_at = time.perf_counter()

    logger.info(
        "request_start",
        extra={
            "event": "REQUEST_START",
            "request_id": request_id,
            "path": request.path,
            "method": request.method,
        },
    )

    def generate_stream():
        provider = "unknown"
        response_max_chars = getattr(app_config, "llm_response_log_max_chars", 8000)
        response_chars = 0
        response_parts: list[str] = []

        try:
            chat, messages = create_chat_and_messages(payload, app_config)
            provider, curl = build_llm_request_curl(chat, messages, payload, app_config)

            curl_max_chars = getattr(app_config, "llm_request_log_max_chars", 8000)
            curl_text = curl if len(curl) <= curl_max_chars else (curl[:curl_max_chars] + "...(truncated)")

            logger.info(
                "llm_request",
                extra={
                    "event": "LLM_REQUEST",
                    "request_id": request_id,
                    "provider": provider,
                    "curl": curl_text,
                },
            )

            for chunk in chat.stream(messages):
                content = getattr(chunk, "content", None)
                if content:
                    if response_chars < response_max_chars:
                        remaining = response_max_chars - response_chars
                        response_parts.append(content[:remaining])
                        response_chars += min(len(content), remaining)
                    yield sse_json({"content": content})
            yield sse_data("[DONE]")

            duration_ms = int((time.perf_counter() - started_at) * 1000)
            if response_parts:
                logger.info(
                    "llm_response",
                    extra={
                        "event": "LLM_RESPONSE",
                        "request_id": request_id,
                        "provider": provider,
                        "llm_response": "".join(response_parts),
                    },
                )
            logger.info(
                "request_done",
                extra={
                    "event": "REQUEST_DONE",
                    "request_id": request_id,
                    "provider": provider,
                    "duration_ms": duration_ms,
                    "status": "ok",
                },
            )
        except Exception as e:
            error_type = type(e).__name__
            error_message = str(e).strip()
            duration_ms = int((time.perf_counter() - started_at) * 1000)

            if response_parts:
                logger.info(
                    "llm_response",
                    extra={
                        "event": "LLM_RESPONSE_PARTIAL",
                        "request_id": request_id,
                        "provider": provider,
                        "llm_response": "".join(response_parts),
                    },
                )

            logger.exception(
                "request_error",
                extra={
                    "event": "REQUEST_ERROR",
                    "request_id": request_id,
                    "duration_ms": duration_ms,
                    "status": "error",
                    "error_type": error_type,
                    "error_message": error_message,
                },
            )

            if error_message:
                yield sse_json({"error": f"{error_type}: {error_message}"})
            else:
                yield sse_json({"error": error_type})
            yield sse_data("[DONE]")

    return Response(
        stream_with_context(generate_stream()),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Request-Id": request_id,
        },
    )
