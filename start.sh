#!/bin/bash

# 在线编译系统 - 快速启动脚本

set -e

echo "🚀 在线编译系统 - 启动中..."
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker未安装，请先安装Docker${NC}"
    echo "安装指南: https://docs.docker.com/get-docker/"
    exit 1
fi

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose未安装，请先安装Docker Compose${NC}"
    echo "安装指南: https://docs.docker.com/compose/install/"
    exit 1
fi

# 检查.env文件
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  未找到.env文件，正在从.env.example创建...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env文件已创建，请根据需要修改配置${NC}"
fi

# 停止旧容器
echo "🛑 停止旧容器..."
docker-compose down

# 启动服务
echo "📦 启动Docker容器..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo ""
echo "📊 服务状态检查:"
docker-compose ps

# 初始化数据库
echo ""
echo "🗄️  初始化数据库..."
docker-compose exec -T backend npx prisma migrate deploy || true
docker-compose exec -T backend npx prisma generate || true

echo ""
echo -e "${GREEN}✅ 启动完成！${NC}"
echo ""
echo "📱 访问地址:"
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:8000"
echo "   健康检查: http://localhost:8000/health"
echo ""
echo "📝 查看日志:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 停止服务:"
echo "   docker-compose down"
echo ""
