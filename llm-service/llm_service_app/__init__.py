from flask import Flask

from dotenv import load_dotenv
from pathlib import Path

from llm_service_app.config import AppConfig
from llm_service_app.routes import storyboard_blueprint


def create_app() -> Flask:
    project_root = Path(__file__).resolve().parents[1]
    load_dotenv(dotenv_path=project_root / ".env")
    app = Flask(__name__)
    app.config["APP_CONFIG"] = AppConfig()
    app.register_blueprint(storyboard_blueprint)
    return app

