import logging
import json
from collections.abc import Iterator
from dataclasses import dataclass
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

logger = logging.getLogger(__name__)


class CozeRuntimeError(RuntimeError):
    """Coze 调用异常。"""


@dataclass(frozen=True)
class CozeTextChunk:
    content: str


def _iter_sse_events(response) -> Iterator[tuple[str | None, str]]:
    event_name: str | None = None
    data_lines: list[str] = []

    while True:
        raw_line = response.readline()
        if not raw_line:
            return

        line = raw_line.decode("utf-8", errors="ignore").rstrip("\n")

        if line == "":
            if data_lines:
                yield event_name, "\n".join(data_lines)
            event_name = None
            data_lines = []
            continue

        if line.startswith(":"):
            continue

        if line.startswith("event:"):
            event_name = line[len("event:") :].strip()
            continue

        if line.startswith("data:"):
            data_lines.append(line[len("data:") :].lstrip())
            continue


def _extract_delta_text(sse_data: str) -> str | None:
    if sse_data.strip() == "[DONE]":
        return None

    try:
        payload = json.loads(sse_data)
    except Exception:
        return None

    if not isinstance(payload, dict):
        return None

    message = payload.get("message")
    if isinstance(message, dict):
        content = message.get("content")
        if isinstance(content, str) and content:
            return content

    data = payload.get("data")
    if isinstance(data, dict):
        message = data.get("message")
        if isinstance(message, dict):
            content = message.get("content")
            if isinstance(content, str) and content:
                return content

    content = payload.get("content")
    if isinstance(content, str) and content:
        return content

    return None


def _extract_error_payload(payload: dict) -> tuple[int | None, str | None, str | None]:
    code = payload.get("code")
    msg = payload.get("msg") or payload.get("message")
    detail = payload.get("detail")
    logid: str | None = None
    if isinstance(detail, dict):
        raw_logid = detail.get("logid")
        if isinstance(raw_logid, str) and raw_logid:
            logid = raw_logid

    if isinstance(code, str) and code.isdigit():
        code = int(code)

    if isinstance(code, int):
        return code, msg if isinstance(msg, str) else None, logid

    data = payload.get("data")
    if isinstance(data, dict):
        code = data.get("code")
        msg = data.get("msg") or data.get("message")
        detail = data.get("detail")
        logid = None
        if isinstance(detail, dict):
            raw_logid = detail.get("logid")
            if isinstance(raw_logid, str) and raw_logid:
                logid = raw_logid
        if isinstance(code, str) and code.isdigit():
            code = int(code)

        if isinstance(code, int):
            return code, msg if isinstance(msg, str) else None, logid

    return None, None, None


def _raise_if_error_payload(payload: dict) -> None:
    code, msg, logid = _extract_error_payload(payload)
    if code is None or code == 0:
        return

    msg_text = msg or "Unknown error"
    if logid:
        raise CozeRuntimeError(f"Coze API error: code={code} msg={msg_text} logid={logid}")
    raise CozeRuntimeError(f"Coze API error: code={code} msg={msg_text}")


class CozeChat:
    def __init__(
        self,
        *,
        base_url: str,
        api_key: str,
        bot_id: str,
        user_id: str,
        timeout_seconds: float,
        response_log_max_chars: int = 8000,
    ):
        self._base_url = base_url.rstrip("/")
        self._api_key = api_key
        self._bot_id = bot_id
        self._user_id = user_id
        self._timeout_seconds = timeout_seconds
        self._response_log_max_chars = response_log_max_chars if response_log_max_chars > 0 else 8000

    @staticmethod
    def _bash_single_quote(raw_text: str) -> str:
        return "'" + raw_text.replace("'", "'\\''") + "'"

    def _truncate(self, raw_text: str) -> str:
        if len(raw_text) <= self._response_log_max_chars:
            return raw_text
        return raw_text[: self._response_log_max_chars] + "...(truncated)"

    @staticmethod
    def _normalize_bot_id(raw_bot_id: str) -> int | str:
        raw_value = (raw_bot_id or "").strip()
        if raw_value.isdigit():
            try:
                return int(raw_value)
            except Exception:
                return raw_value
        return raw_value

    def build_request(self, messages) -> tuple[str, dict, dict, str]:
        system_parts: list[str] = []
        user_parts: list[str] = []
        for message in messages:
            role = getattr(message, "type", None) or getattr(message, "role", None)
            content = getattr(message, "content", None)
            if not isinstance(content, str) or not content.strip():
                continue

            if role in {"system"}:
                system_parts.append(content)
            elif role in {"human", "user"}:
                user_parts.append(content)
            else:
                user_parts.append(content)

        combined_text = "\n\n".join([part for part in ["\n\n".join(system_parts), "\n\n".join(user_parts)] if part])
        if not combined_text.strip():
            raise CozeRuntimeError("Coze chat request has empty messages")

        additional_messages: list[dict] = [
            {
                "role": "user",
                "type": "question",
                "content": combined_text,
                "content_type": "text",
            }
        ]

        bot_id = (self._bot_id or "").strip()
        if not bot_id:
            raise CozeRuntimeError("COZE_BOT_ID not configured")

        request_body = {
            "bot_id": bot_id,
            "user_id": self._user_id,
            "stream": True,
            "auto_save_history": True,
            "additional_messages": additional_messages,
            "parameters": {},
        }

        endpoint = f"{self._base_url}/v3/chat"
        request_headers = {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json",
            "Accept": "text/event-stream",
        }

        redacted_headers = {
            "Authorization": "Bearer ***",
            "Content-Type": request_headers["Content-Type"],
            "Accept": request_headers["Accept"],
        }

        payload_text = json.dumps(request_body, ensure_ascii=False)
        curl = " ".join(
            [
                "curl",
                "-X",
                "POST",
                self._bash_single_quote(endpoint),
                "-H",
                self._bash_single_quote(f"Authorization: {redacted_headers['Authorization']}"),
                "-H",
                self._bash_single_quote(f"Content-Type: {redacted_headers['Content-Type']}"),
                "-H",
                self._bash_single_quote(f"Accept: {redacted_headers['Accept']}"),
                "--data-raw",
                self._bash_single_quote(payload_text),
            ]
        )

        return endpoint, request_headers, request_body, curl

    def stream(self, messages):
        endpoint, request_headers, request_body, _curl = self.build_request(messages)
        request_data = json.dumps(request_body, ensure_ascii=False).encode("utf-8")
        req = Request(endpoint, data=request_data, headers=request_headers, method="POST")

        try:
            with urlopen(req, timeout=self._timeout_seconds) as response:
                content_type = ""
                status = None
                try:
                    content_type = (response.headers.get("Content-Type") or "").lower()
                except Exception:
                    content_type = ""
                try:
                    status = getattr(response, "status", None)
                except Exception:
                    status = None

                logger.info(
                    "coze_response",
                    extra={
                        "event": "COZE_RESPONSE_HEADERS",
                        "status": status,
                        "coze_response": self._truncate(f"content_type={content_type}"),
                    },
                )

                if "application/json" in content_type:
                    raw_body = response.read().decode("utf-8", errors="ignore")
                    logger.info(
                        "coze_response",
                        extra={
                            "event": "COZE_RESPONSE_JSON",
                            "coze_response": self._truncate(raw_body.strip()),
                        },
                    )
                    try:
                        payload = json.loads(raw_body)
                    except Exception:
                        payload = None
                    if isinstance(payload, dict):
                        _raise_if_error_payload(payload)
                    raise CozeRuntimeError(f"Coze API error: invalid json response: {raw_body.strip()}")

                if "text/event-stream" not in content_type:
                    raw_body = response.read().decode("utf-8", errors="ignore")
                    logger.info(
                        "coze_response",
                        extra={
                            "event": "COZE_RESPONSE_STREAM",
                            "coze_response": self._truncate(raw_body.strip()),
                        },
                    )
                    try:
                        payload = json.loads(raw_body)
                    except Exception:
                        payload = None
                    if isinstance(payload, dict):
                        _raise_if_error_payload(payload)
                    raise CozeRuntimeError(f"Coze API error: unexpected response content-type: {content_type}")

                logged_first_event = False
                for event_name, sse_data in _iter_sse_events(response):
                    if sse_data.strip() == "[DONE]":
                        logger.info(
                            "coze_response",
                            extra={
                                "event": "COZE_RESPONSE_DONE",
                                "event_name": event_name,
                                "coze_response": "[DONE]",
                            },
                        )
                        return
                    if not logged_first_event:
                        logger.info(
                            "coze_response",
                            extra={
                                "event": "COZE_RESPONSE",
                                "event_name": event_name,
                                "coze_response": self._truncate(sse_data.strip()),
                            },
                        )
                        logged_first_event = True
                    try:
                        payload = json.loads(sse_data)
                    except Exception:
                        payload = None
                    if isinstance(payload, dict):
                        code, _msg, _logid = _extract_error_payload(payload)
                        if code is not None and code != 0:
                            logger.info(
                                "coze_response",
                                extra={
                                    "event": "COZE_RESPONSE",
                                    "event_name": event_name,
                                    "coze_response": self._truncate(sse_data.strip()),
                                },
                            )
                        _raise_if_error_payload(payload)
                        if event_name and ("completed" in event_name or "error" in event_name):
                            logger.info(
                                "coze_response",
                                extra={
                                    "event": "COZE_RESPONSE",
                                    "event_name": event_name,
                                    "coze_response": self._truncate(sse_data.strip()),
                                },
                            )
                    delta = _extract_delta_text(sse_data)
                    if delta:
                        yield CozeTextChunk(delta)
        except HTTPError as e:
            try:
                body = e.read().decode("utf-8", errors="ignore")
            except Exception:
                body = ""
            details = f"{e.code} {e.reason}".strip()
            if body.strip():
                logger.info(
                    "coze_response",
                    extra={
                        "event": "COZE_RESPONSE",
                        "coze_response": self._truncate(body.strip()),
                    },
                )
                raise CozeRuntimeError(f"Coze API error: {details} - {body.strip()}") from e
            raise CozeRuntimeError(f"Coze API error: {details}") from e
        except URLError as e:
            raise CozeRuntimeError(f"Coze API connection error: {e.reason}") from e
