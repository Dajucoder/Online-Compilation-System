# 贡献指南

感谢您考虑为在线编译系统做出贡献！

## 🤝 如何贡献

### 报告Bug

如果您发现了Bug，请创建Issue并提供：
- Bug的详细描述
- 复现步骤
- 预期行为
- 实际行为
- 环境信息（操作系统、浏览器等）
- 截图（如果适用）

### 提出新功能

如果您有新功能的想法，请：
1. 先查看Issue列表，确保没有重复
2. 创建新Issue描述您的想法
3. 等待维护者的反馈
4. 获得批准后再开始开发

### 提交代码

1. **Fork仓库**
   ```bash
   # 点击GitHub页面的Fork按钮
   ```

2. **克隆您的Fork**
   ```bash
   git clone https://github.com/your-username/Online-Compilation-System.git
   cd Online-Compilation-System
   ```

3. **创建特性分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **进行更改**
   - 遵循代码规范
   - 编写清晰的提交信息
   - 添加必要的测试
   - 更新文档

5. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

6. **推送到GitHub**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **创建Pull Request**
   - 提供清晰的PR描述
   - 关联相关Issue
   - 等待代码审查

## 📝 代码规范

### 提交信息格式

遵循[Conventional Commits](https://www.conventionalcommits.org/)规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type类型：**
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具链更新

**示例：**
```
feat(editor): add syntax highlighting for Rust

- Add Rust language support
- Update Monaco Editor configuration
- Add syntax highlighting rules

Closes #123
```

### TypeScript/JavaScript规范

- 使用TypeScript严格模式
- 使用ESLint和Prettier
- 遵循Airbnb代码规范
- 变量和函数使用有意义的命名
- 添加必要的注释

### React组件规范

- 使用函数组件和Hooks
- Props使用TypeScript interface定义
- 组件文件使用PascalCase命名
- 一个文件一个组件

### 后端代码规范

- 使用async/await而不是回调
- 错误处理要完善
- 添加输入验证
- 写清晰的API文档

## 🧪 测试

- 为新功能编写测试
- 确保所有测试通过
- 维护测试覆盖率

```bash
# 前端测试
cd frontend
npm test

# 后端测试
cd backend
npm test
```

## 📚 文档

- 更新README.md
- 更新API文档
- 添加代码注释
- 编写使用示例

## 🔍 代码审查

Pull Request将经过以下审查：

- [ ] 代码质量
- [ ] 测试覆盖
- [ ] 文档完整性
- [ ] 性能影响
- [ ] 安全性
- [ ] 向后兼容性

## 💬 交流

- GitHub Issues：技术问题和Bug报告
- GitHub Discussions：讨论新功能和想法

## 📋 开发环境设置

参考[开发文档](./docs/DEVELOPMENT.md)

## 🎯 寻找贡献点

查看Issues中标记为以下标签的：
- `good first issue`：适合新手
- `help wanted`：需要帮助
- `enhancement`：功能增强

## ⚖️ 行为准则

- 尊重所有贡献者
- 提供建设性的反馈
- 专注于问题本身，而不是人
- 接受不同的观点

## 📜 许可证

通过贡献代码，您同意您的贡献将在MIT许可证下授权。

---

再次感谢您的贡献！🎉
