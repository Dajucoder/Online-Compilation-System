# 🚀 Docker一键部署指南

本指南帮助您快速部署在线编译系统，支持Linux、macOS和Windows平台。

## 📋 系统要求

### 最低要求
- **操作系统**: Windows 10/11, macOS 10.14+, Linux (Ubuntu 18.04+)
- **内存**: 4GB RAM (推荐 8GB+)
- **存储**: 10GB 可用空间
- **网络**: 稳定的互联网连接

### 软件依赖
- **Docker**: 20.10.0 或更高版本
- **Docker Compose**: 2.0.0 或更高版本
- **curl**: 用于健康检查 (Windows: PowerShell内置)

## 🛠️ 快速安装

### Linux/macOS
```bash
# 1. 下载项目
git clone <your-repository-url>
cd online-compilation-system

# 2. 添加执行权限
chmod +x start.sh

# 3. 一键启动
./start.sh
```

### Windows
```cmd
# 1. 下载项目并解压
# 2. 打开PowerShell或命令提示符
cd online-compilation-system

# 3. 一键启动
start.bat
```

## 🎯 启动选项

### 基本启动
```bash
# Linux/macOS
./start.sh

# Windows
start.bat
```

### 高级选项
```bash
# 清理所有数据重新部署
./start.sh --reset

# 跳过镜像构建（用于快速重启）
./start.sh --skip-build

# 查看帮助
./start.sh --help
```

## 🔍 启动过程详解

启动脚本会自动执行以下步骤：

1. **依赖检查** 🔍
   - 验证Docker和Docker Compose安装
   - 检查端口占用情况
   - 验证Docker服务运行状态

2. **环境配置** ⚙️
   - 自动创建`.env`配置文件
   - 生成安全的JWT密钥
   - 配置数据库和Redis连接

3. **镜像构建** 🏗️
   - 构建后端镜像 (Node.js + TypeScript)
   - 构建前端镜像 (Nginx + 静态文件)
   - 并行构建以提高速度

4. **服务启动** 🚀
   - 启动PostgreSQL数据库
   - 启动Redis缓存服务
   - 启动后端API服务
   - 启动前端Web服务

5. **健康检查** 🔄
   - 等待所有服务就绪
   - 验证API端点响应
   - 检查数据库连接

6. **初始化** 📊
   - 执行数据库迁移
   - 生成Prisma客户端
   - 创建默认管理员账号

## 🌐 访问应用

启动完成后，您可以访问以下地址：

### 主要服务
- **🌐 前端界面**: http://localhost:3000
- **🔌 后端API**: http://localhost:8000
- **❤️ 健康检查**: http://localhost:8000/health
- **📊 API文档**: http://localhost:8000/api-docs

### 默认管理员账号
- **📧 邮箱**: admin@example.com
- **🔑 密码**: admin123456
- **⚠️ 重要**: 请立即登录并修改密码！

## 🔧 日常管理命令

### 查看服务状态
```bash
# 查看容器状态
docker-compose ps

# 查看资源使用
docker stats

# 查看实时日志
docker-compose logs -f
```

### 重启服务
```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart backend

# 重新构建并启动
docker-compose up -d --build
```

### 停止服务
```bash
# 优雅停止
docker-compose down

# 强制停止并删除容器
docker-compose down -f

# 清理所有数据
docker-compose down -v
```

### 数据库操作
```bash
# 进入数据库
docker-compose exec postgres psql -U postgres -d online_compiler

# 重置管理员密码
docker-compose exec backend npm run admin:reset

# 查看数据库迁移状态
docker-compose exec backend npx prisma migrate status
```

## 🛠️ 故障排除

### 常见问题

#### 端口占用
```bash
# 检查端口占用
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# 修改端口（编辑docker-compose.yml）
ports:
  - "3001:80"  # 前端端口
  - "8001:8000"  # 后端端口
```

#### Docker权限问题 (Linux)
```bash
# 添加用户到docker组
sudo usermod -aG docker $USER

# 重新登录或运行
newgrp docker
```

#### 内存不足
```bash
# 检查系统资源
docker system df
docker system prune  # 清理未使用资源

# 限制Docker内存使用
# 编辑 /etc/docker/daemon.json
{
  "default-memory": "2g"
}
```

### 日志分析
```bash
# 查看特定服务日志
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
docker-compose logs redis

# 跟随日志输出
docker-compose logs -f backend

# 查看最近100行日志
docker-compose logs --tail=100 backend
```

## 🔒 生产部署建议

### 安全配置
1. **修改默认密码**
   - 修改`.env`中的`JWT_SECRET`
   - 更新管理员账号密码
   - 设置强数据库密码

2. **环境变量配置**
   ```bash
   # 生产环境环境变量示例
   NODE_ENV=production
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   CORS_ORIGIN=https://yourdomain.com
   ```

3. **Nginx反向代理**
   - 配置SSL证书
   - 设置域名和HTTPS
   - 添加负载均衡

### 性能优化
1. **资源限制**
   - 根据服务器配置调整Docker资源限制
   - 监控CPU和内存使用情况

2. **数据库优化**
   - 配置PostgreSQL参数
   - 设置Redis持久化

3. **缓存策略**
   - 启用Redis缓存
   - 配置静态资源CDN

## 📞 技术支持

如果遇到问题，请检查：

1. **系统要求**: 确保满足最低系统要求
2. **网络连接**: 确保网络连接稳定
3. **端口冲突**: 检查端口是否被其他服务占用
4. **Docker状态**: 确认Docker服务正常运行
5. **日志信息**: 查看详细日志了解具体错误

### 获取帮助
- 📧 邮件支持: support@example.com
- 💬 GitHub Issues: [提交问题](https://github.com/your-repo/issues)
- 📖 文档: [项目文档](./docs/)

---

## 🎉 部署成功验证

部署成功后，您应该能够：

1. ✅ 访问前端界面 (http://localhost:3000)
2. ✅ 登录管理员账号
3. ✅ 运行Python代码示例
4. ✅ 查看API健康状态 (http://localhost:8000/health)

如果所有功能正常，说明部署成功！🎊