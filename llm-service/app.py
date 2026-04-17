from llm_service_app import create_app

app = create_app()


if __name__ == "__main__":
    app_config = app.config["APP_CONFIG"]
    app.run(host=app_config.llm_host, port=app_config.llm_port, threaded=True)
