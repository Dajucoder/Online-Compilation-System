@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 在线编译系统 - Windows快速启动
echo ========================================

:: 颜色定义（有限支持）
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "BLUE=[94m"
set "CYAN=[96m"
set "NC=[0m"

:: 显示欢迎信息
echo %CYAN%🚀 在线编译系统 - Windows快速启动%NC%
echo ========================================
echo.
echo 🔧 支持功能:
echo   ✓ 多语言代码执行
echo   ✓ Docker容器化部署
echo   ✓ 自动数据库初始化
echo   ✓ 自动管理员账号创建
echo.

:: 检查Docker
echo 🔍 检查Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ Docker未安装，请先安装Docker%NC%
    echo 安装指南: https://docs.docker.com/get-docker/
    pause
    exit /b 1
) else (
    echo %GREEN%✓ Docker已安装%NC%
)

:: 检查Docker Compose
echo 🔍 检查Docker Compose...
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ Docker Compose未安装%NC%
    echo 安装指南: https://docs.docker.com/compose/install/
    pause
    exit /b 1
) else (
    echo %GREEN%✓ Docker Compose已安装%NC%
)

:: 检查.env文件
echo.
echo ⚙️  检查环境配置...
if not exist ".env" (
    echo %YELLOW%📝 创建环境配置文件...%NC%
    copy ".env.example" ".env"
    echo %GREEN%✓ .env文件已创建%NC%
    echo %BLUE%📝 建议修改JWT_SECRET和其他敏感配置%NC%
) else (
    echo %GREEN%✓ .env文件已存在%NC%
)

:: 停止旧容器
echo.
echo 🛑 清理旧容器...
docker-compose down --remove-orphans

:: 检查命令行参数
if "%1"=="--reset" (
    echo.
    set /p confirm="⚠️  确认删除所有数据？(y/N): "
    if /i "!confirm!"=="y" (
        docker-compose down -v
        echo %GREEN%✓ 所有数据已清理%NC%
    )
)

if "%1"=="--skip-build" (
    echo %YELLOW%⏭️  跳过镜像构建%NC%
    goto start_services
)

:: 构建镜像
echo.
echo 🏗️  构建Docker镜像...
docker-compose build --parallel
if errorlevel 1 (
    echo %RED%❌ 镜像构建失败%NC%
    pause
    exit /b 1
) else (
    echo %GREEN%✓ 镜像构建成功%NC%
)

:start_services
:: 启动服务
echo.
echo 🚀 启动服务...
docker-compose up -d

echo %BLUE%⏳ 等待服务启动...%NC%
timeout /t 15 /nobreak >nul

:: 等待数据库就绪
echo.
echo 🔄 检查服务状态...
echo   🔍 检查PostgreSQL...
set /a retries=0
:check_postgres
set /a retries+=1
docker-compose exec -T postgres pg_isready -U postgres >nul 2>&1
if errorlevel 1 (
    if !retries! lss 30 (
        echo 等待PostgreSQL启动... (!retries!/30)
        timeout /t 2 /nobreak >nul
        goto check_postgres
    ) else (
        echo %RED%❌ PostgreSQL启动超时%NC%
    )
) else (
    echo %GREEN%✓ PostgreSQL就绪%NC%
)

:: 等待Redis就绪
echo   🔍 检查Redis...
set /a retries=0
:check_redis
set /a retries+=1
docker-compose exec -T redis redis-cli ping >nul 2>&1
if errorlevel 1 (
    if !retries! lss 30 (
        echo 等待Redis启动... (!retries!/30)
        timeout /t 2 /nobreak >nul
        goto check_redis
    ) else (
        echo %RED%❌ Redis启动超时%NC%
    )
) else (
    echo %GREEN%✓ Redis就绪%NC%
)

:: 等待后端API就绪
echo   🔍 检查后端API...
set /a retries=0
:check_backend
set /a retries+=1
curl -f http://localhost:8000/health >nul 2>&1
if errorlevel 1 (
    if !retries! lss 30 (
        echo 等待后端API启动... (!retries!/30)
        timeout /t 2 /nobreak >nul
        goto check_backend
    ) else (
        echo %RED%❌ 后端API启动超时%NC%
    )
) else (
    echo %GREEN%✓ 后端API就绪%NC%
)

:: 初始化数据库
echo.
echo 🗄️  初始化数据库...
echo   📊 执行数据库迁移...
docker-compose exec -T backend npx prisma migrate deploy
if errorlevel 1 (
    docker-compose exec -T backend npx prisma db push --skip-generate
)

echo   🔧 生成Prisma客户端...
docker-compose exec -T backend npx prisma generate

echo   👤 创建管理员账号...
timeout /t 5 /nobreak >nul
docker-compose exec -T backend node create-admin.js

:: 显示服务信息
echo.
echo %GREEN%🎉 部署完成！%NC%
echo ========================================
echo %CYAN%📱 访问地址:%NC%
echo   🌐 前端界面: http://localhost:3000
echo   🔌 后端API:  http://localhost:8000
echo   ❤️  健康检查: http://localhost:8000/health
echo.
echo %CYAN%👤 默认管理员账号:%NC%
echo   📧 邮箱: admin@example.com
echo   🔑 密码: admin123456
echo   ⚠️  请立即登录并修改密码！
echo.
echo %CYAN%🔧 管理命令:%NC%
echo   📋 查看服务状态: docker-compose ps
echo   📜 查看实时日志: docker-compose logs -f
echo   🔄 重启服务: docker-compose restart
echo   🛑 停止服务: docker-compose down
echo   🗑️  清理数据: start.bat --reset
echo.

:: 显示服务状态
echo %BLUE%📊 当前服务状态:%NC%
docker-compose ps
echo.

echo %GREEN%🎯 部署完成，享受您的在线编译系统吧！%NC%
pause
