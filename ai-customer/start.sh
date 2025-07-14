#!/bin/bash

echo "🚀 启动电商客服智能体系统..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装，请先安装Docker Compose"
    exit 1
fi

# 检查.env文件
if [ ! -f ".env" ]; then
    echo "📝 创建.env文件..."
    cp nestjs-api/env.example .env
    echo "✅ .env文件已创建，请根据需要修改配置"
fi

# 启动服务
echo "🐳 启动Docker服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 30

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose ps

echo ""
echo "✅ 系统启动完成！"
echo ""
echo "📱 访问地址："
echo "   - 后台管理：http://localhost:3002"
echo "   - API文档：http://localhost:3001/api-docs"
echo "   - 默认管理员：admin / password"
echo ""
echo "📋 常用命令："
echo "   - 查看日志：docker-compose logs -f"
echo "   - 停止服务：docker-compose down"
echo "   - 重启服务：docker-compose restart"
echo "" 