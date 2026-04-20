from llm_service_app.config import AppConfig
from llm_service_app.coze import CozeChat
from llm_service_app.prompts import build_system_prompt, build_user_prompt

import json


class LlmRuntimeError(RuntimeError):
    """LLM 调用异常。"""


def _bash_single_quote(raw_text: str) -> str:
    return "'" + raw_text.replace("'", "'\\''") + "'"


def _build_openai_compatible_curl(*, base_url: str, api_key: str, model: str, temperature: float, messages) -> str:
    payload_messages: list[dict] = []
    for message in messages:
        role = getattr(message, "type", None) or getattr(message, "role", None)
        content = getattr(message, "content", None)
        if not isinstance(content, str) or not content.strip():
            continue

        if role in {"system"}:
            api_role = "system"
        elif role in {"human", "user"}:
            api_role = "user"
        elif role in {"ai", "assistant"}:
            api_role = "assistant"
        else:
            api_role = "user"

        payload_messages.append({"role": api_role, "content": content})

    endpoint = base_url.rstrip("/") + "/chat/completions"
    request_body = {
        "model": model,
        "messages": payload_messages,
        "temperature": temperature,
        "stream": True,
    }
    payload_text = json.dumps(request_body, ensure_ascii=False)

    return " ".join(
        [
            "curl",
            "-X",
            "POST",
            _bash_single_quote(endpoint),
            "-H",
            _bash_single_quote("Authorization: Bearer ***"),
            "-H",
            _bash_single_quote("Content-Type: application/json"),
            "--data-raw",
            _bash_single_quote(payload_text),
        ]
    )


def build_llm_request_curl(chat, messages, payload: dict, app_config: AppConfig) -> tuple[str, str]:
    if isinstance(chat, CozeChat):
        _endpoint, _headers, _body, curl = chat.build_request(messages)
        return "coze", curl

    model = payload.get("model") or app_config.openai_model
    curl = _build_openai_compatible_curl(
        base_url=app_config.openai_base_url,
        api_key=app_config.openai_api_key or "",
        model=model,
        temperature=app_config.llm_temperature,
        messages=messages,
    )
    return "openai_compatible", curl


def create_chat_and_messages(payload: dict, app_config: AppConfig):
    try:
        from langchain_core.messages import HumanMessage, SystemMessage
    except Exception as e:
        raise LlmRuntimeError("LangChain dependencies not installed") from e

    if app_config.coze_api_key and app_config.coze_bot_id:
        chat = CozeChat(
            base_url=app_config.coze_base_url,
            api_key=app_config.coze_api_key,
            bot_id=app_config.coze_bot_id,
            user_id=app_config.coze_user_id,
            timeout_seconds=app_config.coze_timeout_seconds,
            response_log_max_chars=getattr(app_config, "llm_response_log_max_chars", 8000),
        )
        messages = [
            SystemMessage(content=build_system_prompt(payload)),
            HumanMessage(content=build_user_prompt(payload)),
        ]
        return chat, messages

    if not app_config.openai_api_key:
        raise LlmRuntimeError("OPENAI_API_KEY not configured")

    try:
        from langchain_openai import ChatOpenAI
    except Exception as e:
        raise LlmRuntimeError("LangChain dependencies not installed") from e

    chat = ChatOpenAI(
        base_url=app_config.openai_base_url,
        model=payload.get("model") or app_config.openai_model,
        openai_api_key=app_config.openai_api_key,
        temperature=app_config.llm_temperature,
    )
    messages = [
        SystemMessage(content=build_system_prompt(payload)),
        HumanMessage(content=build_user_prompt(payload)),
    ]
    return chat, messages
