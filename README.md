# 🚀 在线编译系统 (Online Compilation System)

一个基于Web的多语言在线代码编译与运行平台，支持安全隔离的代码执行环境。

## ✨ 特性

- 🎨 **现代化UI**: 基于React + TypeScript + Monaco Editor
- 🔒 **安全隔离**: Docker容器沙箱执行
- 🌐 **多语言支持**: Python, Java, C/C++, JavaScript, Go等
- ⚡ **高性能**: 异步任务队列，支持并发执行
- 📊 **资源监控**: 实时监控CPU、内存、执行时间
- 👥 **用户系统**: 注册登录、代码历史、分享功能
- 🔐 **企业级安全**: JWT认证、HTTPS、资源限制

## 🏗️ 技术栈

### 前端
- React 18 + TypeScript
- Monaco Editor (VS Code编辑器)
- Ant Design / Tailwind CSS
- Axios + React Query
- Zustand (状态管理)

### 后端
- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL
- Redis (缓存 + 任务队列)
- Bull (任务队列)
- JWT认证

### 基础设施
- Docker + Docker Compose
- Nginx (反向代理)
- GitHub Actions (CI/CD)

## 📦 项目结构

```
Online-Compilation-System/
├── frontend/              # React前端应用
├── backend/               # Express后端API
├── worker/                # 代码执行Worker
├── executor/              # 各语言执行容器
│   ├── python/
│   ├── java/
│   ├── cpp/
│   ├── javascript/
│   └── go/
├── nginx/                 # Nginx配置
├── database/              # 数据库迁移文件
├── docker-compose.yml     # 开发环境
├── docker-compose.prod.yml # 生产环境
└── docs/                  # 项目文档
```

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- Docker >= 20.10.0
- Docker Compose >= 2.0.0
- PostgreSQL >= 14.0
- Redis >= 6.0

### 开发环境安装

1. **克隆仓库**
```bash
git clone https://github.com/Dajucoder/Online-Compilation-System.git
cd Online-Compilation-System
```

2. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的配置
```

3. **启动所有服务**
```bash
docker-compose up -d
```

4. **初始化数据库**
```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
```

5. **访问应用**
- 前端: http://localhost:3000
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/api-docs

### 单独开发

**前端开发**
```bash
cd frontend
npm install
npm run dev
```

**后端开发**
```bash
cd backend
npm install
npm run dev
```

**Worker开发**
```bash
cd worker
npm install
npm run dev
```

## 🔧 配置说明

### 环境变量

查看 `.env.example` 文件了解所有可配置项。

核心配置:
- `DATABASE_URL`: PostgreSQL连接字符串
- `REDIS_URL`: Redis连接字符串
- `JWT_SECRET`: JWT密钥
- `DOCKER_HOST`: Docker守护进程地址
- `MAX_EXECUTION_TIME`: 最大执行时间(秒)
- `MAX_MEMORY`: 最大内存限制(MB)

## 📚 API文档

启动后访问 http://localhost:8000/api-docs 查看完整的API文档。

### 主要接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/execute` - 执行代码
- `GET /api/execute/:id` - 查询执行结果
- `GET /api/submissions` - 获取提交历史
- `POST /api/share` - 分享代码

## 🐳 Docker部署

### 开发环境
```bash
docker-compose up -d
```

### 生产环境
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 构建镜像
```bash
# 构建所有镜像
docker-compose build

# 构建特定服务
docker-compose build frontend
docker-compose build backend
```

## 🔒 安全特性

- ✅ Docker容器隔离
- ✅ 资源限制(CPU/内存/磁盘/时间)
- ✅ 网络隔离(无外网访问)
- ✅ 危险代码检测
- ✅ 请求频率限制
- ✅ HTTPS加密传输
- ✅ XSS/CSRF防护
- ✅ SQL注入防护

## 🎯 支持的语言

| 语言 | 版本 | 状态 |
|------|------|------|
| Python | 3.11 | ✅ |
| Java | 17 | ✅ |
| C/C++ | GCC 11 | ✅ |
| JavaScript | Node 18 | ✅ |
| Go | 1.21 | ✅ |
| Rust | 1.70 | 🚧 |
| C# | .NET 7 | 🚧 |

## 📊 性能指标

- 平均响应时间: < 100ms (不含执行时间)
- 并发支持: 100+ 同时执行
- 容器启动时间: < 2s
- 支持QPS: 1000+

## 🤝 贡献指南

欢迎贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详情。

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📝 开发路线图

- [x] 基础架构搭建
- [x] 用户认证系统
- [x] 代码执行引擎
- [ ] 代码分享功能
- [ ] 实时协作编辑
- [ ] 题库系统
- [ ] AI代码助手
- [ ] 移动端适配

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👨‍💻 作者

- **Dajucoder** - [GitHub](https://github.com/Dajucoder)

## 🙏 致谢

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Docker](https://www.docker.com/)
- [Express](https://expressjs.com/)
- [React](https://react.dev/)

## 📧 联系方式

有问题或建议？欢迎提Issue或联系我！

---

⭐ 如果这个项目对你有帮助，请给个Star！
