@echo off
echo ===================================
echo 在线编译系统 - 认证问题修复脚本
echo ===================================
echo.

REM 1. 重启服务
echo 步骤 1: 重启 Docker 服务...
docker-compose restart nginx backend frontend

echo.
echo 等待服务启动（10秒）...
timeout /t 10 /nobreak >nul

REM 2. 检查服务状态
echo.
echo 步骤 2: 检查服务状态...
docker-compose ps

REM 3. 检查后端日志
echo.
echo 步骤 3: 检查后端最近的日志...
docker logs --tail 20 online-compiler-backend

REM 4. 测试后端健康检查
echo.
echo 步骤 4: 测试后端连接...
docker exec online-compiler-nginx curl -s http://backend:8000/health

REM 5. 检查 JWT_SECRET
echo.
echo 步骤 5: 检查 JWT 配置...
docker exec online-compiler-backend env | findstr JWT_SECRET

REM 6. 提示用户操作
echo.
echo ===================================
echo 修复脚本执行完成！
echo ===================================
echo.
echo 接下来请按以下步骤操作：
echo.
echo 1. 打开浏览器，访问您的应用
echo 2. 打开浏览器开发者工具（F12）
echo 3. 切换到 Console 标签
echo 4. 清除缓存和 localStorage:
echo    执行: localStorage.clear()
echo    然后按 F5 刷新页面
echo.
echo 5. 重新登录
echo 6. 在 Console 中查看以下日志：
echo    - Auth Store - Login: ...
echo    - API Request: ...
echo    - API Response: ...
echo.
echo 7. 尝试在编辑器页面执行代码
echo.
echo 如果仍有问题，请查看详细的调试指南：
echo type DEBUGGING_AUTH.md
echo.
echo 或查看实时日志：
echo docker-compose logs -f backend
echo.

pause
