# 自动创建管理员账号说明

## 概述

系统在Docker首次构建和启动时会自动创建超级管理员账号。这是通过容器启动脚本 `docker-entrypoint.sh` 实现的。

## 默认管理员账号信息

**⚠️ 重要：首次部署后请立即登录并修改密码！**

- **用户名**: `admin`
- **邮箱**: `admin@example.com`
- **初始密码**: `admin123456`

## 自定义管理员信息

如果需要自定义默认管理员账号信息，可以通过环境变量配置：

### 方式一：修改 docker-compose.yml

在 `docker-compose.yml` 的 backend 服务中修改以下环境变量：

```yaml
environment:
  DEFAULT_ADMIN_USERNAME: your_admin_username
  DEFAULT_ADMIN_EMAIL: your_admin@example.com
  DEFAULT_ADMIN_PASSWORD: your_secure_password
```

### 方式二：使用 .env 文件

1. 复制 `backend/.env.example` 为 `backend/.env`
2. 修改以下变量：

```env
DEFAULT_ADMIN_USERNAME=your_admin_username
DEFAULT_ADMIN_EMAIL=your_admin@example.com
DEFAULT_ADMIN_PASSWORD=your_secure_password
```

3. 在 docker-compose.yml 中引用：

```yaml
backend:
  env_file:
    - ./backend/.env
```

## 工作原理

1. **容器启动**: Docker容器启动时执行 `docker-entrypoint.sh` 脚本
2. **数据库连接**: 脚本等待数据库服务就绪
3. **数据库迁移**: 执行 Prisma 数据库迁移，创建必要的表结构
4. **创建管理员**: 运行 `create-admin.js` 脚本
   - 检查是否已存在管理员账号
   - 如果不存在，创建新的管理员账号
   - 如果已存在，跳过创建步骤
5. **启动应用**: 启动后端API服务

## 重新创建管理员账号

如果需要重新创建管理员账号：

### 方法一：删除现有管理员后重启

1. 连接到数据库
2. 删除现有的管理员用户记录
3. 重启backend容器

```bash
# 重启backend容器
docker-compose restart backend
```

### 方法二：手动运行创建脚本

```bash
# 进入backend容器
docker-compose exec backend sh

# 运行创建脚本
node create-admin.js
```

### 方法三：使用密码重置脚本

如果只是忘记密码，使用密码重置脚本：

```bash
# 进入backend容器
docker-compose exec backend sh

# 运行密码重置脚本
node reset-admin-password.js
```

## 安全建议

1. **立即修改密码**: 首次登录后立即修改默认密码
2. **使用强密码**: 密码应包含大小写字母、数字和特殊字符，长度至少12位
3. **定期更换**: 定期更换管理员密码
4. **限制访问**: 不要将管理员账号信息泄露给未授权人员
5. **生产环境**: 在生产环境中务必使用自定义的强密码，不要使用默认密码

## 故障排查

### 管理员账号创建失败

检查以下几点：

1. **数据库连接**: 确认数据库服务正常运行
   ```bash
   docker-compose ps postgres
   ```

2. **查看日志**: 检查backend容器日志
   ```bash
   docker-compose logs backend
   ```

3. **数据库状态**: 确认数据库表已正确创建
   ```bash
   docker-compose exec backend npx prisma studio
   ```

### 管理员账号已存在

如果看到 "管理员账号已存在" 的提示，说明：
- 管理员账号已经创建成功
- 可以直接使用现有账号登录
- 如需重置密码，使用 `reset-admin-password.js` 脚本

## 相关文件

- `backend/docker-entrypoint.sh` - Docker容器启动脚本
- `backend/create-admin.js` - 创建管理员账号脚本
- `backend/reset-admin-password.js` - 重置管理员密码脚本
- `backend/Dockerfile` - Docker镜像构建文件
- `docker-compose.yml` - Docker Compose配置文件
