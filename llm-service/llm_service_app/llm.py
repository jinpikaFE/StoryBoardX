from llm_service_app.config import AppConfig
from llm_service_app.prompts import build_system_prompt, build_user_prompt


class LlmRuntimeError(RuntimeError):
    """LLM 调用异常。"""


def create_chat_and_messages(payload: dict, app_config: AppConfig):
    try:
        from langchain_openai import ChatOpenAI
        from langchain_core.messages import HumanMessage, SystemMessage
    except Exception as e:
        raise LlmRuntimeError("LangChain dependencies not installed") from e

    chat = ChatOpenAI(
        base_url=app_config.openai_base_url,
        model=payload.get("model") or app_config.openai_model,
        api_key=app_config.openai_api_key,
        temperature=app_config.llm_temperature,
    )
    messages = [
        SystemMessage(content=build_system_prompt(payload)),
        HumanMessage(content=build_user_prompt(payload)),
    ]
    return chat, messages

