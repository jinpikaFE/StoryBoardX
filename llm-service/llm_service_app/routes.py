from flask import Blueprint, Response, current_app, request, stream_with_context

from llm_service_app.llm import create_chat_and_messages
from llm_service_app.sse import sse_data, sse_json

storyboard_blueprint = Blueprint("storyboard", __name__)


@storyboard_blueprint.get("/health")
def health():
    return {"ok": True}


@storyboard_blueprint.post("/api/generate")
def generate():
    payload = request.get_json(silent=True) or {}
    app_config = current_app.config["APP_CONFIG"]

    def generate_stream():
        try:
            chat, messages = create_chat_and_messages(payload, app_config)
            for chunk in chat.stream(messages):
                content = getattr(chunk, "content", None)
                if content:
                    yield sse_json({"content": content})
            yield sse_data("[DONE]")
        except Exception:
            yield sse_json({"error": "生成失败"})
            yield sse_data("[DONE]")

    return Response(
        stream_with_context(generate_stream()),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
        },
    )

