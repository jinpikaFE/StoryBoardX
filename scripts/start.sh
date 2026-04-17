#!/bin/bash

# 生产环境启动脚本

echo "Starting JinPikaStoryboards Server..."

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# 设置生产环境变量
export NODE_ENV=production

# 启动 Server 服务（同时提供 API 和静态文件服务）
cd "$PROJECT_ROOT/server"
node dist/main.js
