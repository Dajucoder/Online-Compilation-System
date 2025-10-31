# 📖 API 文档

## 基础信息

- **Base URL**: `http://localhost:8000/api`
- **认证方式**: Bearer Token (JWT)
- **请求格式**: `application/json`
- **响应格式**: `application/json`

## 通用响应格式

### 成功响应
```json
{
  "status": "success",
  "data": {
    // 响应数据
  }
}
```

### 错误响应
```json
{
  "status": "error",
  "message": "错误描述信息"
}
```

---

## 1. 认证接口

### 1.1 用户注册

**POST** `/auth/register`

**请求体**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**响应示例**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "username": "testuser",
      "email": "test@example.com",
      "createdAt": "2025-10-31T10:00:00.000Z"
    }
  }
}
```

### 1.2 用户登录

**POST** `/auth/login`

**请求体**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**响应示例**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "username": "testuser",
      "email": "test@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 2. 代码执行接口

### 2.1 执行代码

**POST** `/execute`

**请求头**
```
Authorization: Bearer <token>
```

**请求体**
```json
{
  "language": "python",
  "code": "print('Hello, World!')",
  "input": ""
}
```

**支持的语言**
- `python` - Python 3.11
- `java` - Java 17
- `cpp` - C++ (GCC 11)
- `c` - C (GCC 11)
- `javascript` - JavaScript (Node 18)
- `go` - Go 1.21

**响应示例**
```json
{
  "status": "success",
  "data": {
    "submissionId": "uuid",
    "jobId": "123",
    "message": "Code execution queued"
  }
}
```

### 2.2 获取执行结果

**GET** `/execute/:id`

**请求头**
```
Authorization: Bearer <token>
```

**响应示例**
```json
{
  "status": "success",
  "data": {
    "submission": {
      "id": "uuid",
      "language": "python",
      "code": "print('Hello, World!')",
      "input": "",
      "status": "completed",
      "createdAt": "2025-10-31T10:00:00.000Z",
      "result": {
        "stdout": "Hello, World!\n",
        "stderr": "",
        "executionTime": 45,
        "memoryUsed": 8192,
        "exitCode": 0
      }
    }
  }
}
```

**状态说明**
- `pending` - 等待执行
- `running` - 执行中
- `completed` - 执行完成
- `failed` - 执行失败

---

## 3. 提交历史接口

### 3.1 获取提交历史

**GET** `/submissions?page=1&limit=20`

**请求头**
```
Authorization: Bearer <token>
```

**查询参数**
- `page` (可选): 页码，默认1
- `limit` (可选): 每页数量，默认20

**响应示例**
```json
{
  "status": "success",
  "data": {
    "submissions": [
      {
        "id": "uuid",
        "language": "python",
        "code": "print('Hello')",
        "status": "completed",
        "createdAt": "2025-10-31T10:00:00.000Z",
        "result": {
          "executionTime": 45,
          "memoryUsed": 8192
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

### 3.2 获取单个提交

**GET** `/submissions/:id`

**请求头**
```
Authorization: Bearer <token>
```

**响应示例**
```json
{
  "status": "success",
  "data": {
    "submission": {
      "id": "uuid",
      "language": "python",
      "code": "print('Hello, World!')",
      "input": "",
      "status": "completed",
      "createdAt": "2025-10-31T10:00:00.000Z",
      "result": {
        "stdout": "Hello, World!\n",
        "stderr": "",
        "executionTime": 45,
        "memoryUsed": 8192,
        "exitCode": 0
      }
    }
  }
}
```

### 3.3 删除提交

**DELETE** `/submissions/:id`

**请求头**
```
Authorization: Bearer <token>
```

**响应示例**
```json
{
  "status": "success",
  "message": "Submission deleted"
}
```

---

## 4. 健康检查

### 4.1 服务健康检查

**GET** `/health`

**响应示例**
```json
{
  "status": "ok",
  "timestamp": "2025-10-31T10:00:00.000Z"
}
```

---

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 202 | 已接受（异步处理） |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

---

## 速率限制

- 普通API：每分钟100次请求
- 代码执行：每分钟2次请求（burst 5）
- 超过限制将返回 429 状态码

---

## 示例代码

### JavaScript (Axios)
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})

// 执行代码
const response = await api.post('/execute', {
  language: 'python',
  code: 'print("Hello")',
  input: ''
})
```

### Python (Requests)
```python
import requests

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}'
}

response = requests.post(
    'http://localhost:8000/api/execute',
    json={
        'language': 'python',
        'code': 'print("Hello")',
        'input': ''
    },
    headers=headers
)
```

### cURL
```bash
curl -X POST http://localhost:8000/api/execute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "language": "python",
    "code": "print(\"Hello\")",
    "input": ""
  }'
```

---

## WebSocket支持（未来功能）

计划支持WebSocket实时推送执行结果：

```javascript
const ws = new WebSocket('ws://localhost:8000/ws')

ws.on('execution-complete', (data) => {
  console.log('执行完成:', data)
})
```

---

## 变更日志

### v1.0.0 (2025-10-31)
- 初始版本发布
- 基础认证功能
- 代码执行功能
- 提交历史管理

---

有问题？查看[完整文档](https://docs.example.com)或[提交Issue](https://github.com/Dajucoder/Online-Compilation-System/issues)
