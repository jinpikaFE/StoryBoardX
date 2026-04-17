#!/bin/bash

# 构建脚本 - 构建所有服务

echo "Building all services..."

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# 1. 构建 Server 服务
echo "Building Server Service..."
cd "$PROJECT_ROOT/server"
pnpm install
pnpm build

# 2. 构建前端
echo "Building Frontend..."
cd "$PROJECT_ROOT"
pnpm install
pnpm build

echo "All services built successfully!"
