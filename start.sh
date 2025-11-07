#!/bin/bash

# 在线编译系统 - 智能一键部署脚本
# 版本: v2.0
# 作者: Online Compiler System

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 打印彩色输出
print_color() {
    printf "${1}${2}${NC}\n"
}

# 显示欢迎信息
show_welcome() {
    print_color $CYAN "🚀 在线编译系统 - 智能一键部署"
    echo "========================================"
    print_color $BLUE "🔧 支持功能:"
    echo "  ✓ 多语言代码执行 (Python, Java, C/C++, JavaScript, Go)"
    echo "  ✓ Docker容器化部署"
    echo "  ✓ 自动数据库初始化"
    echo "  ✓ 自动管理员账号创建"
    echo "  ✓ 健康检查和监控"
    echo "  ✓ 自动故障恢复"
    echo "========================================"
    echo ""
}

# 检查系统依赖
check_dependencies() {
    print_color $YELLOW "🔍 检查系统依赖..."
    
    # 检查Docker
    if ! command -v docker &> /dev/null; then
        print_color $RED "❌ Docker未安装"
        echo "请安装Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    print_color $GREEN "✓ Docker已安装: $(docker --version)"
    
    # 检查Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_color $RED "❌ Docker Compose未安装"
        echo "请安装Docker Compose: https://docs.docker.com/compose/install/"
        exit 1
    fi
    print_color $GREEN "✓ Docker Compose已安装: $(docker-compose --version)"
    
    # 检查Docker服务状态
    if ! docker info &> /dev/null; then
        print_color $RED "❌ Docker服务未运行，请启动Docker服务"
        exit 1
    fi
    print_color $GREEN "✓ Docker服务运行正常"
    
    # 检查端口占用
    check_ports
    
    echo ""
}

# 检查端口占用
check_ports() {
    print_color $YELLOW "🔍 检查端口占用..."
    PORTS=(3000 5432 6379 8000)
    for port in "${PORTS[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 || netstat -ln | grep ":$port " >/dev/null 2>&1; then
            print_color $YELLOW "⚠️  端口 $port 已被占用"
            echo "建议停止占用该端口的服务或修改配置文件"
        else
            print_color $GREEN "✓ 端口 $port 可用"
        fi
    done
    echo ""
}

# 清理旧容器和数据
cleanup() {
    print_color $YELLOW "🧹 清理旧容器和数据..."
    
    # 停止并删除旧容器
    if docker-compose ps | grep -q "Up"; then
        docker-compose down --remove-orphans
        print_color $GREEN "✓ 旧容器已清理"
    fi
    
    # 可选：清理旧数据
    if [[ "$1" == "--reset" ]]; then
        read -p "⚠️  确认删除所有数据？(y/N): " confirm
        if [[ $confirm =~ ^[Yy]$ ]]; then
            docker-compose down -v
            print_color $GREEN "✓ 所有数据已清理"
        fi
    fi
}

# 初始化环境配置
init_environment() {
    print_color $YELLOW "⚙️  初始化环境配置..."
    
    if [ ! -f .env ]; then
        print_color $YELLOW "📝 创建环境配置文件..."
        cp .env.example .env
        print_color $GREEN "✓ .env文件已创建"
        print_color $BLUE "📝 建议修改JWT_SECRET和其他敏感配置"
    else
        print_color $GREEN "✓ .env文件已存在"
    fi
}

# 优化Docker镜像构建
build_images() {
    print_color $YELLOW "🏗️  构建Docker镜像..."
    
    # 构建后端镜像
    print_color $BLUE "  📦 构建后端镜像..."
    docker-compose build backend --parallel
    if [ $? -eq 0 ]; then
        print_color $GREEN "✓ 后端镜像构建成功"
    else
        print_color $RED "❌ 后端镜像构建失败"
        exit 1
    fi
    
    # 构建前端镜像
    print_color $BLUE "  📦 构建前端镜像..."
    docker-compose build frontend --parallel
    if [ $? -eq 0 ]; then
        print_color $GREEN "✓ 前端镜像构建成功"
    else
        print_color $RED "❌ 前端镜像构建失败"
        exit 1
    fi
}

# 启动服务
start_services() {
    print_color $YELLOW "🚀 启动服务..."
    docker-compose up -d
    
    print_color $BLUE "⏳ 等待服务启动..."
    sleep 15
}

# 等待服务就绪
wait_for_services() {
    print_color $YELLOW "🔄 检查服务状态..."
    
    # 检查数据库
    print_color $BLUE "  🔍 检查PostgreSQL..."
    local retries=30
    for i in $(seq 1 $retries); do
        if docker-compose exec -T postgres pg_isready -U postgres &>/dev/null; then
            print_color $GREEN "✓ PostgreSQL就绪"
            break
        fi
        if [ $i -eq $retries ]; then
            print_color $RED "❌ PostgreSQL启动超时"
            return 1
        fi
        sleep 2
    done
    
    # 检查Redis
    print_color $BLUE "  🔍 检查Redis..."
    for i in $(seq 1 $retries); do
        if docker-compose exec -T redis redis-cli ping &>/dev/null; then
            print_color $GREEN "✓ Redis就绪"
            break
        fi
        if [ $i -eq $retries ]; then
            print_color $RED "❌ Redis启动超时"
            return 1
        fi
        sleep 2
    done
    
    # 检查后端API
    print_color $BLUE "  🔍 检查后端API..."
    for i in $(seq 1 $retries); do
        if curl -f http://localhost:8000/health &>/dev/null; then
            print_color $GREEN "✓ 后端API就绪"
            break
        fi
        if [ $i -eq $retries ]; then
            print_color $RED "❌ 后端API启动超时"
            return 1
        fi
        sleep 2
    done
    
    # 检查前端
    print_color $BLUE "  🔍 检查前端..."
    for i in $(seq 1 $retries); do
        if curl -f http://localhost:3000 &>/dev/null; then
            print_color $GREEN "✓ 前端就绪"
            break
        fi
        if [ $i -eq $retries ]; then
            print_color $RED "❌ 前端启动超时"
            return 1
        fi
        sleep 2
    done
}

# 初始化数据库
init_database() {
    print_color $YELLOW "🗄️  初始化数据库..."
    
    # 运行数据库迁移
    print_color $BLUE "  📊 执行数据库迁移..."
    if docker-compose exec -T backend npx prisma migrate deploy; then
        print_color $GREEN "✓ 数据库迁移完成"
    else
        print_color $YELLOW "⚠️  数据库迁移失败，尝试其他方式..."
        docker-compose exec -T backend npx prisma db push --skip-generate || true
    fi
    
    # 生成Prisma客户端
    print_color $BLUE "  🔧 生成Prisma客户端..."
    docker-compose exec -T backend npx prisma generate || true
    
    # 创建管理员账号
    print_color $BLUE "  👤 创建管理员账号..."
    sleep 5  # 等待后端完全启动
    docker-compose exec -T backend node create-admin.js || print_color $YELLOW "⚠️  管理员账号可能已存在"
}

# 显示服务信息
show_service_info() {
    echo ""
    print_color $GREEN "🎉 部署完成！"
    echo "========================================"
    print_color $CYAN "📱 访问地址:"
    echo "  🌐 前端界面: http://localhost:3000"
    echo "  🔌 后端API:  http://localhost:8000"
    echo "  ❤️  健康检查: http://localhost:8000/health"
    echo "  📊 API文档: http://localhost:8000/api-docs"
    echo ""
    print_color $CYAN "👤 默认管理员账号:"
    echo "  📧 邮箱: admin@example.com"
    echo "  🔑 密码: admin123456"
    echo "  ⚠️  请立即登录并修改密码！"
    echo ""
    print_color $CYAN "🔧 管理命令:"
    echo "  📋 查看服务状态: docker-compose ps"
    echo "  📜 查看实时日志: docker-compose logs -f"
    echo "  🔄 重启服务: docker-compose restart"
    echo "  🛑 停止服务: docker-compose down"
    echo "  🗑️  清理数据: ./start.sh --reset"
    echo ""
}

# 显示服务状态
show_status() {
    echo ""
    print_color $BLUE "📊 当前服务状态:"
    docker-compose ps
    echo ""
    
    # 显示资源使用情况
    print_color $BLUE "💻 资源使用情况:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" 2>/dev/null || echo "无法获取资源使用信息"
}

# 主函数
main() {
    # 解析命令行参数
    RESET_DATA=false
    SKIP_BUILD=false
    
    for arg in "$@"; do
        case $arg in
            --reset)
                RESET_DATA=true
                ;;
            --skip-build)
                SKIP_BUILD=true
                ;;
            --help|-h)
                echo "在线编译系统 - 智能一键部署脚本"
                echo ""
                echo "用法: ./start.sh [选项]"
                echo ""
                echo "选项:"
                echo "  --reset     清理所有数据并重新部署"
                echo "  --skip-build 跳过镜像构建（用于快速启动）"
                echo "  --help, -h 显示此帮助信息"
                echo ""
                exit 0
                ;;
        esac
    done
    
    show_welcome
    
    # 记录开始时间
    start_time=$(date +%s)
    
    # 执行部署步骤
    check_dependencies
    init_environment
    cleanup $RESET_DATA
    
    if [ "$SKIP_BUILD" != true ]; then
        build_images
    else
        print_color $YELLOW "⏭️  跳过镜像构建"
    fi
    
    start_services
    wait_for_services
    init_database
    
    # 记录结束时间
    end_time=$(date +%s)
    duration=$((end_time - start_time))
    
    show_service_info
    show_status
    
    print_color $GREEN "⏱️  总用时: ${duration}秒"
    print_color $CYAN "🎯 部署完成，享受您的在线编译系统吧！"
}

# 错误处理
trap 'print_color $RED "❌ 脚本执行出错，请检查日志"' ERR

# 执行主函数
main "$@"
