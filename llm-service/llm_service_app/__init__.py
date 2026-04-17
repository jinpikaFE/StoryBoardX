from flask import Flask

from llm_service_app.config import AppConfig
from llm_service_app.routes import storyboard_blueprint


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["APP_CONFIG"] = AppConfig()
    app.register_blueprint(storyboard_blueprint)
    return app

