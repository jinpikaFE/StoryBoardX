#!/bin/bash

# 启动脚本 - 同时启动前端和后端服务

echo "Starting all services..."

# 获取项目根目录
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# 创建日志目录
mkdir -p /app/work/logs/bypass

# 1. 启动 Server 服务（后端 + LLM）
echo "Starting Server Service on port 8000..."
cd "$PROJECT_ROOT/server"
if [ ! -d "node_modules" ]; then
  echo "Installing server dependencies..."
  pnpm install
fi
pnpm start:dev > /app/work/logs/bypass/server.log 2>&1 &
SERVER_PID=$!
echo "Server Service started (PID: $SERVER_PID)"

# 等待 Server 服务启动
sleep 3

# 2. 启动前端开发服务器
echo "Starting Frontend on port 5000..."
cd "$PROJECT_ROOT"
pnpm dev

# 当前端服务退出时，清理后台进程
trap "kill $SERVER_PID 2>/dev/null" EXIT
