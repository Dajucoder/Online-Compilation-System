#!/bin/bash

echo "==================================="
echo "在线编译系统 - 认证问题修复脚本"
echo "==================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 重启服务
echo -e "${YELLOW}步骤 1: 重启 Docker 服务...${NC}"
docker-compose restart nginx backend frontend

echo ""
echo -e "${YELLOW}等待服务启动（10秒）...${NC}"
sleep 10

# 2. 检查服务状态
echo ""
echo -e "${YELLOW}步骤 2: 检查服务状态...${NC}"
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✓ 服务运行中${NC}"
else
    echo -e "${RED}✗ 服务未正常运行${NC}"
    echo "请运行: docker-compose up -d"
    exit 1
fi

# 3. 检查后端日志
echo ""
echo -e "${YELLOW}步骤 3: 检查后端最近的日志...${NC}"
docker logs --tail 20 online-compiler-backend

# 4. 测试后端健康检查
echo ""
echo -e "${YELLOW}步骤 4: 测试后端连接...${NC}"
if docker exec online-compiler-nginx curl -s http://backend:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 后端连接正常${NC}"
else
    echo -e "${RED}✗ 后端连接失败${NC}"
    exit 1
fi

# 5. 检查 JWT_SECRET
echo ""
echo -e "${YELLOW}步骤 5: 检查 JWT 配置...${NC}"
JWT_SECRET=$(docker exec online-compiler-backend env | grep JWT_SECRET | cut -d'=' -f2)
if [ -z "$JWT_SECRET" ]; then
    echo -e "${RED}✗ JWT_SECRET 未设置${NC}"
    exit 1
else
    echo -e "${GREEN}✓ JWT_SECRET 已配置${NC}"
fi

# 6. 提示用户操作
echo ""
echo -e "${GREEN}==================================="
echo "修复脚本执行完成！"
echo "===================================${NC}"
echo ""
echo "接下来请按以下步骤操作："
echo ""
echo "1. 打开浏览器，访问您的应用"
echo "2. 打开浏览器开发者工具（F12）"
echo "3. 切换到 Console 标签"
echo "4. 清除缓存和 localStorage:"
echo "   执行: localStorage.clear()"
echo "   然后按 F5 刷新页面"
echo ""
echo "5. 重新登录"
echo "6. 在 Console 中查看以下日志："
echo "   - Auth Store - Login: ..."
echo "   - API Request: ..."
echo "   - API Response: ..."
echo ""
echo "7. 尝试在编辑器页面执行代码"
echo ""
echo "如果仍有问题，请查看详细的调试指南："
echo "cat DEBUGGING_AUTH.md"
echo ""
echo "或查看实时日志："
echo "docker-compose logs -f backend"
echo ""

exit 0
