# 🐛 Study Plan API 调试指南

## 错误信息
```
Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

## 问题原因
前端期望收到JSON响应，但实际收到了HTML页面。这通常意味着：
1. 后端路由不存在（404错误页面）
2. 认证失败（重定向到登录页）
3. 后端服务未运行

---

## ✅ 快速诊断步骤

### 步骤 1: 确认后端运行
```bash
# 在backend文件夹
cd backend
npm run dev
```

**预期输出**:
```
🚀 HSC Power Server is running on http://localhost:3000
📡 API Health: http://localhost:3000/api/health
```

**如果看到错误**: 检查端口是否被占用，修复后重启。

---

### 步骤 2: 测试健康检查
在浏览器访问：
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

**如果看到HTML**: 后端没有正确运行。

---

### 步骤 3: 检查认证Token
在浏览器Console (F12) 运行：
```javascript
console.log('Token:', localStorage.getItem('access_token'))
console.log('User:', localStorage.getItem('user'))
```

**预期**: 应该看到token和用户信息

**如果是null**: 需要重新登录

---

### 步骤 4: 手动测试API (使用浏览器Console)

```javascript
// 在浏览器Console运行
const token = localStorage.getItem('access_token')
fetch('http://localhost:3000/api/student/study-plan/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    subjects: ['Mathematics'],
    available_hours_per_week: 20,
    preferences: { learning_style: 'visual' }
  })
})
.then(r => r.text())
.then(t => console.log('Response:', t))
.catch(e => console.error('Error:', e))
```

**分析响应**:
- 如果看到JSON → API工作正常
- 如果看到HTML → 路由或认证有问题
- 如果看到401 → 认证失败
- 如果看到404 → 路由不存在

---

### 步骤 5: 检查后端日志

在后端终端查看请求日志：
```
POST /api/student/study-plan/generate
```

**如果没有日志**: 请求没有到达后端
**如果有错误**: 查看具体错误信息

---

## 🔧 常见问题和解决方案

### 问题 1: 401 Unauthorized

**原因**: JWT token无效或过期

**解决**:
```javascript
// 在浏览器Console
localStorage.clear()
// 然后重新登录
```

---

### 问题 2: 404 Not Found

**原因**: 路由配置错误

**检查**:
1. `backend/routes/student.js` 是否存在
2. `backend/server.js` 是否注册了student routes:
   ```javascript
   app.use('/api/student', studentRoutes);
   ```

**修复**: 确保上面两个文件都正确配置

---

### 问题 3: CORS错误

**症状**: 浏览器Console显示CORS policy错误

**检查**: `backend/server.js` 的CORS配置
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```

**解决**: 确保前端URL在允许列表中

---

### 问题 4: 后端崩溃

**症状**: 后端终端显示错误并停止

**常见错误**:
- 导入错误 (import/export不匹配)
- 数据库连接失败
- 环境变量缺失

**解决**: 
1. 检查后端错误信息
2. 修复导入问题
3. 确保`.env`配置正确

---

## 📋 完整诊断清单

运行以下检查：

```bash
# 1. 后端健康检查
curl http://localhost:3000/api/health

# 2. 测试认证端点
curl http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test","role":"student"}'

# 3. 测试学习计划API (需要真实token)
curl -X POST http://localhost:3000/api/student/study-plan/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"subjects":["Math"],"available_hours_per_week":20}'
```

---

## 🎯 预期的完整流程

### 正常工作流程：

```
1. 用户登录
   POST /api/auth/login
   → 返回: { session: { access_token: "..." }, user: {...} }
   
2. Token存储
   localStorage.setItem('access_token', token)
   
3. 生成学习计划
   POST /api/student/study-plan/generate
   Headers: { Authorization: "Bearer <token>" }
   Body: { subjects, hours, preferences }
   → 返回: { study_plan: [...], ai_generated: true }
   
4. 显示结果
   前端显示学习建议
```

---

## 🐛 现在的调试

### 立即执行：

1. **检查后端是否运行**
   ```bash
   # 看是否有输出
   curl http://localhost:3000/api/health
   ```

2. **检查浏览器Console**
   - 打开F12
   - 查看Network标签
   - 点击"Generate Study Plan"
   - 查看请求详情：
     - Request URL
     - Request Headers (Authorization?)
     - Response (HTML还是JSON?)
     - Status Code

3. **查看改进的错误信息**
   现在错误会显示：
   ```
   Server error: Expected JSON but got text/html. Status: 404
   ```
   这会告诉你具体是什么问题。

---

## ✅ 解决步骤

### 如果是404错误：
```bash
# 1. 确保后端文件存在
ls backend/routes/student.js
ls backend/controllers/student/studyPlanner.js

# 2. 重启后端
cd backend
npm run dev
```

### 如果是401错误：
```javascript
// 在浏览器Console
localStorage.clear()
// 重新登录
```

### 如果是500错误：
- 查看后端终端的错误日志
- 检查数据库连接
- 检查环境变量

---

**创建时间**: 2025-10-30  
**用于问题**: Study Plan API返回HTML而不是JSON

