#!/bin/sh
set -e

echo "🚀 开始初始化应用..."

# 等待数据库就绪
echo "⏳ 等待数据库连接..."
MAX_RETRIES=30
RETRY_COUNT=0

until npx prisma db push --skip-generate 2>/dev/null || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo "⏳ 数据库未就绪，等待中... ($RETRY_COUNT/$MAX_RETRIES)"
  sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "❌ 数据库连接超时"
  exit 1
fi

echo "✅ 数据库连接成功"

# 执行数据库迁移
echo "📊 执行数据库迁移..."
npx prisma db push --skip-generate

# 创建管理员账号（如果不存在）
echo "👤 检查并创建管理员账号..."
node create-admin.js

echo "✅ 初始化完成！"
echo "🌟 启动应用服务..."

# 启动应用
exec npm start
