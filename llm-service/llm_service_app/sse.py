import json


def sse_data(data: str) -> str:
    return f"data: {data}\n\n"


def sse_json(data: dict) -> str:
    return sse_data(json.dumps(data, ensure_ascii=False))

