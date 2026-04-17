import os


class AppConfig:
    """运行配置。"""

    def __init__(self) -> None:
        self.llm_host = os.getenv("LLM_HOST") or "0.0.0.0"
        self.llm_port = self._to_int(os.getenv("LLM_PORT"), 7001)

        # 默认保持你当前可用配置：火山方舟 + doubao。
        self.openai_base_url = os.getenv("OPENAI_BASE_URL") or "https://ark.cn-beijing.volces.com/api/v3"
        self.openai_model = os.getenv("OPENAI_MODEL") or "doubao-seed-1-8-251228"
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

