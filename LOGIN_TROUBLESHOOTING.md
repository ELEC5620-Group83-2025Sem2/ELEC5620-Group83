# 🔧 登录问题排查指南

## 错误信息
```
Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

## 问题原因

这个错误说明：
- ✅ 前端发送了请求
- ❌ 后端没有返回JSON，而是返回了HTML页面（可能是404或错误页面）

---

## ✅ 快速修复步骤

### 步骤 1: 确认后端正在运行

打开终端，运行：
```bash
cd backend
npm run dev
```

**预期输出**:
```
🚀 HSC Power Server is running on http://localhost:3000
📡 API Health: http://localhost:3000/api/health
```

**如果看到错误**: 参考上面的错误修复

### 步骤 2: 测试后端健康检查

在浏览器或新终端中访问：
```
http://localhost:3000/api/health
```

**预期响应**:
```json
{
  "status": "OK",
  "message": "HSC Power Server is running"
}
```

### 步骤 3: 测试登录API

使用curl测试登录：
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"student"}'
```

**预期**: 应该返回JSON（即使是错误也应该是JSON格式）

### 步骤 4: 检查前端API配置

创建 `frontend/.env.local` 文件（如果不存在）：
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 步骤 5: 重启前端服务

```bash
cd frontend
npm run dev
```

---

## 🔍 详细排查

### 检查清单

#### 1. 后端服务
- [ ] 后端正在运行（端口3000）
- [ ] 没有崩溃错误
- [ ] `/api/health` 可以访问
- [ ] `/api/auth/login` 路由存在

#### 2. 前端配置
- [ ] 前端运行在不同端口（通常5173）
- [ ] `.env.local` 配置正确
- [ ] 浏览器控制台没有CORS错误

#### 3. 网络
- [ ] localhost可以访问
- [ ] 防火墙没有阻止

---

## 🐛 常见问题

### 问题 1: 后端崩溃

**症状**: 后端无法启动或立即崩溃

**解决方案**: 
已经修复了导入错误，重新运行：
```bash
cd backend
npm run dev
```

### 问题 2: CORS错误

**症状**: 浏览器控制台显示CORS policy错误

**检查**: `backend/server.js` 的CORS配置
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```

**解决**: 确保前端运行的端口在允许列表中

### 问题 3: API URL错误

**症状**: Network请求到了错误的地址

**检查**: 
1. 浏览器开发者工具 → Network标签
2. 查看登录请求的URL
3. 应该是: `http://localhost:3000/api/auth/login`

**解决**: 
如果URL不对，创建 `frontend/.env.local`：
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

然后重启前端：
```bash
cd frontend
npm run dev
```

### 问题 4: 后端端口被占用

**症状**: 
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

---

## 📋 测试登录流程

### 1. 使用测试账号

如果数据库有测试数据：
```
Email: student@test.com
Password: password123
Role: student
```

### 2. 注册新账号

如果没有账号，先注册：
1. 访问 `http://localhost:5173/register/student`
2. 填写注册信息
3. 需要class code（从教师那里获取）

### 3. 检查浏览器控制台

打开开发者工具 (F12):
1. **Console标签**: 查看错误信息
2. **Network标签**: 查看API请求
   - 点击登录
   - 找到 `login` 请求
   - 查看 Request URL
   - 查看 Response（应该是JSON）

---

## 🔧 完整重启流程

如果所有方法都不行，完全重启：

```bash
# 1. 停止所有服务
# 在后端和前端终端按 Ctrl+C

# 2. 清理并重启后端
cd backend
npm run dev

# 3. 等待后端启动成功，看到：
# 🚀 HSC Power Server is running on http://localhost:3000

# 4. 新终端，启动前端
cd frontend
npm run dev

# 5. 访问前端
# http://localhost:5173
```

---

## 📞 还是不行？

### 提供这些信息：

1. **后端终端输出**（最后20行）
2. **前端浏览器Console错误**（完整错误信息）
3. **Network标签的登录请求详情**：
   - Request URL
   - Request Headers
   - Response（即使是错误）

### 检查这些：

```bash
# 1. 检查后端是否运行
curl http://localhost:3000/api/health

# 2. 检查登录端点
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test","password":"test","role":"student"}'

# 3. 检查前端能否访问
curl http://localhost:5173
```

---

## ✅ 成功标志

登录成功后，你应该看到：
1. ✅ 浏览器控制台没有错误
2. ✅ Network标签显示login请求成功（200状态码）
3. ✅ localStorage中有 `access_token`
4. ✅ 页面跳转到 dashboard

检查localStorage:
```javascript
// 在浏览器Console运行
console.log(localStorage.getItem('access_token'));
console.log(localStorage.getItem('user'));
```

应该看到token和用户信息。

---

**创建时间**: 2025-10-30  
**版本**: 1.0.0

