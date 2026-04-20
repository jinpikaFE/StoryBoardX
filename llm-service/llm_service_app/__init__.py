from flask import Flask

from dotenv import load_dotenv
from pathlib import Path

import json
import logging
import sys
from datetime import datetime, timezone

from llm_service_app.config import AppConfig
from llm_service_app.routes import storyboard_blueprint


class _JsonLogFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "ts": datetime.fromtimestamp(record.created, tz=timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        for key in (
            "event",
            "request_id",
            "provider",
            "curl",
            "coze_response",
            "llm_response",
            "event_name",
            "duration_ms",
            "path",
            "method",
            "status",
            "error_type",
            "error_message",
        ):
            value = getattr(record, key, None)
            if value is not None:
                payload[key] = value

        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)

        return json.dumps(payload, ensure_ascii=False)


def _configure_logging(app_config: AppConfig) -> None:
    root_logger = logging.getLogger()
    formatter: logging.Formatter
    if app_config.log_format == "text":
        formatter = logging.Formatter("%(asctime)s %(levelname)s %(name)s - %(message)s")
    else:
        formatter = _JsonLogFormatter()

    if root_logger.handlers:
        for handler in root_logger.handlers:
            try:
                handler.setFormatter(formatter)
            except Exception:
                pass
        root_logger.setLevel(app_config.log_level)
        return

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)
    root_logger.addHandler(handler)
    root_logger.setLevel(app_config.log_level)


def create_app() -> Flask:
    project_root = Path(__file__).resolve().parents[1]
    load_dotenv(dotenv_path=project_root / ".env")
    app_config = AppConfig()
    _configure_logging(app_config)
    app = Flask(__name__)
    app.config["APP_CONFIG"] = app_config
    app.register_blueprint(storyboard_blueprint)
    return app

