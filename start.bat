@echo off
REM 在线编译系统 - Windows 快速启动脚本

echo ======================================
echo  在线编译系统 - 启动中...
echo ======================================
echo.

REM 检查Docker是否安装
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] Docker未安装，请先安装Docker Desktop
    echo 下载地址: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM 检查Docker Compose是否安装
where docker-compose >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] Docker Compose未安装
    pause
    exit /b 1
)

REM 检查.env文件
if not exist .env (
    echo [警告] 未找到.env文件，正在从.env.example创建...
    copy .env.example .env
    echo [完成] .env文件已创建，请根据需要修改配置
)

REM 停止旧容器
echo.
echo [步骤1] 停止旧容器...
docker-compose down

REM 启动服务
echo.
echo [步骤2] 启动Docker容器...
docker-compose up -d

REM 等待服务启动
echo.
echo [步骤3] 等待服务启动...
timeout /t 10 /nobreak >nul

REM 检查服务状态
echo.
echo [步骤4] 服务状态检查:
docker-compose ps

REM 初始化数据库
echo.
echo [步骤5] 初始化数据库...
docker-compose exec -T backend npx prisma migrate deploy
docker-compose exec -T backend npx prisma generate

echo.
echo ======================================
echo  启动完成！
echo ======================================
echo.
echo 访问地址:
echo   前端: http://localhost:3000
echo   后端: http://localhost:8000
echo   健康检查: http://localhost:8000/health
echo.
echo 查看日志:
echo   docker-compose logs -f
echo.
echo 停止服务:
echo   docker-compose down
echo.
pause
