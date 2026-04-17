# LLM Service（Flask + LangChain）

## 环境要求

- Python 3.10+

## 0. 创建虚拟环境

### PowerShell（Windows）

```bash
cd c:\Users\84716\Desktop\personal\StoryBoardX\llm-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

## 1. 使用国内镜像安装依赖

### PowerShell（Windows）

```bash
cd c:\Users\84716\Desktop\personal\StoryBoardX\llm-service
python -m pip install -U pip -i https://pypi.tuna.tsinghua.edu.cn/simple
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

## 2. 启动 LLM 服务

### 设置关键环境变量（PowerShell）

```bash
$env:OPENAI_API_KEY="你的API_KEY"
$env:OPENAI_BASE_URL="https://ark.cn-beijing.volces.com/api/v3"
$env:OPENAI_MODEL="doubao-seed-1-8-251228"
$env:LLM_PORT="7001"
```

### 启动命令

```bash
cd c:\Users\84716\Desktop\personal\StoryBoardX
pnpm dev:llm
```

或者直接：

```bash
cd c:\Users\84716\Desktop\personal\StoryBoardX\llm-service
python app.py
```
