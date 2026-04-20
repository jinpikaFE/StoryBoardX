import os


class AppConfig:
    """运行配置。"""

    def __init__(self) -> None:
        self.llm_host = os.getenv("LLM_HOST") or "0.0.0.0"
        self.llm_port = self._to_int(os.getenv("LLM_PORT"), 7001)

        self.log_level = (os.getenv("LOG_LEVEL") or "INFO").upper()
        self.log_format = (os.getenv("LOG_FORMAT") or "json").lower()
        self.llm_request_log_max_chars = self._to_int(os.getenv("LLM_REQUEST_LOG_MAX_CHARS"), 8000)
        self.llm_response_log_max_chars = self._to_int(os.getenv("LLM_RESPONSE_LOG_MAX_CHARS"), 8000)

        self.coze_base_url = os.getenv("COZE_BASE_URL") or "https://api.coze.cn"
        self.coze_api_key = os.getenv("COZE_API_KEY")
        self.coze_bot_id = os.getenv("COZE_BOT_ID")
        self.coze_user_id = os.getenv("COZE_USER_ID") or "storyboardx"
        self.coze_timeout_seconds = self._to_float(os.getenv("COZE_TIMEOUT_SECONDS"), 120.0)

        # 默认保持你当前可用配置：火山方舟 + doubao。
        self.openai_base_url = os.getenv("OPENAI_BASE_URL") or "https://ark.cn-beijing.volces.com/api/v3"
        self.openai_model = os.getenv("OPENAI_MODEL") or "doubao-seed-2-0-lite-260215"
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.llm_temperature = self._to_float(os.getenv("LLM_TEMPERATURE"), 0.8)

    @staticmethod
    def _to_int(raw_value: str | None, default_value: int) -> int:
        if raw_value is None or raw_value.strip() == "":
            return default_value
        try:
            return int(raw_value)
        except Exception:
            return default_value

    @staticmethod
    def _to_float(raw_value: str | None, default_value: float) -> float:
        if raw_value is None or raw_value.strip() == "":
            return default_value
        try:
            return float(raw_value)
        except Exception:
            return default_value
