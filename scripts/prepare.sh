#!/bin/bash

# 准备脚本 - 安装所有依赖

echo "Preparing all services..."

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# 1. 安装前端依赖
echo "Installing frontend dependencies..."
cd "$PROJECT_ROOT"
pnpm install

# 2. 安装 Server 服务依赖
echo "Installing server dependencies..."
cd "$PROJECT_ROOT/server"
pnpm install

echo "All dependencies installed!"
