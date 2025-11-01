# Backend环境配置指南

## 🎯 问题

如果没有 `.env` 文件，后端无法连接到Supabase数据库，导致所有API请求失败。

## ✅ 解决方案

### 步骤1: 创建 `.env` 文件

在 `backend/` 目录下创建 `.env` 文件（没有扩展名）：

**文件路径**: `backend/.env`

**文件内容**:
```env
# Supabase配置
SUPABASE_URL=https://lhkyjculexeyfswiursm.supabase.co
SUPABASE_KEY=你的service_role密钥

# 服务器配置
PORT=3000

# JWT配置
JWT_SECRET=your-jwt-secret-key-here-change-this

# OpenAI配置（AI功能，可选）
OPENAI_API_KEY=sk-your-openai-key
```

### 步骤2: 获取Supabase密钥

1. 打开: https://supabase.com/dashboard/project/lhkyjculexeyfswiursm/settings/api
2. 找到 **Project API keys** 部分
3. 复制 **service_role** 密钥（**不是** anon/public key！）
   - 通常以 `eyJhbGc...` 开头
   - 标记为 "secret"
4. 粘贴到 `.env` 文件的 `SUPABASE_KEY=`

### 步骤3: 生成JWT密钥

```bash
# 在终端中运行（PowerShell）
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

复制生成的字符串到 `JWT_SECRET=`

### 步骤4: 完整的 `.env` 示例

创建 `backend/.env` 文件，内容如下：

```env
# Supabase配置
SUPABASE_URL=https://lhkyjculexeyfswiursm.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxoa3lqY3V%0%0vbGV4ZXlmd3NpdXJzbSIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE3MzU0MDk3NDAsImV4cCI6MjA1MDk4NTc0MH0.%0%0你的密钥

# 服务器配置
PORT=3000

# JWT密钥（用于签名token）
JWT_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz

# OpenAI配置（可选，用于AI功能）
# OPENAI_API_KEY=sk-proj-...
```

**重要**: 
- 🔴 不要提交 `.env` 文件到git
- 🔴 不要分享service_role密钥
- 🔴 使用 `gitignore` 排除 `.env` 文件

### 步骤5: 重启后端

```bash
# 停止当前运行的后端（Ctrl+C）
# 然后重新启动
cd backend
npm run dev
```

你应该看到：
```
✅ Supabase client initialized
📍 URL: https://lhkyjculexeyfswiursm.supabase.co
🔑 Key type: eyJhbGc...确认
🚀 HSC Power Server is running on http://localhost:3000
```

### 步骤6: 测试连接

打开浏览器访问：
```
http://localhost:3000/api/health
```

应该看到：
```json
{
  "status": "OK",
  "message": "HSC Power Server is running"
}
```

## 🔍 验证配置

### 快速测试

在浏览器或Postman中测试：

1. **健康检查**:
```
GET http://localhost:3000/api/health
```

2. **登录测试**:
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "teacher@example.com",
  "password": "password",
  "role": "teacher"
}
```

### 查看后端日志

后端运行时应显示：
```
✅ Supabase client initialized
📍 URL: https://...
🔑 Key type: eyJhbGc...
```

如果没有看到这些信息，说明环境变量未正确加载。

## 🐛 常见问题

### 问题1: "SUPABASE_URL and SUPABASE_KEY must be set"

**原因**: `.env` 文件不存在或环境变量未加载  
**解决**: 
1. 确认 `backend/.env` 文件存在
2. 确认文件内容正确
3. 重启后端服务器

### 问题2: "Network error" 或 "Failed to fetch"

**原因**: 后端未运行或端口错误  
**解决**: 
1. 检查后端是否在 localhost:3000 运行
2. 查看后端日志是否有错误
3. 确认没有端口冲突

### 问题3: "Unauthorized" 或 "Invalid token"

**原因**: JWT密钥不匹配  
**解决**: 
1. 生成新的JWT密钥
2. 更新 `.env` 文件
3. 重启后端
4. 重新登录

### 问题4: Database connection errors

**原因**: Supabase密钥错误或RLS策略问题  
**解决**: 
1. 确认使用service_role密钥（不是anon key）
2. 检查Supabase项目状态
3. 验证数据库连接

## ✅ 完成检查清单

- [ ] `backend/.env` 文件已创建
- [ ] 包含正确的 `SUPABASE_URL`
- [ ] 包含正确的 `SUPABASE_KEY` (service_role)
- [ ] 包含 `JWT_SECRET`
- [ ] 后端服务器重启
- [ ] 看到 "Supabase client initialized" 消息
- [ ] `/api/health` 返回成功
- [ ] 可以登录
- [ ] 可以创建课程

---

**配置完成后，再次尝试创建课程！** 🎯

