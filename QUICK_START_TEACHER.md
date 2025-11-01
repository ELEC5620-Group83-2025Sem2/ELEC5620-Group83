# Teacher端快速开始指南

## 🎯 概述

本指南帮助您快速设置和运行Teacher端的后端API。

## ⚡ 快速设置（5分钟）

### 步骤1: 数据库设置

在Supabase SQL Editor中按顺序运行：

```sql
-- 1. 初始化核心表
-- 文件: db_scripts/init.sql

-- 2. 设置安全策略
-- 文件: db_scripts/policies.sql

-- 3. AI Study Planner表（可选）
-- 文件: db_scripts/study_planner_tables.sql
```

### 步骤2: 配置环境

创建 `backend/.env` 文件：

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT
JWT_SECRET=your-jwt-secret-key-here

# OpenAI (用于AI功能)
OPENAI_API_KEY=sk-your-openai-key

# 服务器
PORT=3000
```

### 步骤3: 安装依赖并启动

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 启动服务器
npm start
```

服务器将在 `http://localhost:3000` 启动。

## 🧪 快速测试

### 测试1: 健康检查

```bash
curl http://localhost:3000/api/health
```

**预期响应**:
```json
{
  "status": "OK",
  "message": "HSC Power Server is running"
}
```

### 测试2: 创建教师账户

使用Supabase Dashboard或SQL创建测试教师：

```sql
-- 在Supabase Auth中创建用户
-- 然后在public.profiles表中创建对应记录
-- 在public.profile_roles表中添加'teacher'角色
```

### 测试3: 登录获取Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "password"
  }'
```

**预期响应**:
```json
{
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "teacher@example.com",
    "role": "teacher"
  }
}
```

### 测试4: 获取教师课程

```bash
curl http://localhost:3000/api/teacher/classes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📋 核心功能清单

### ✅ 已实现的功能

- [x] 课程管理
  - [x] 查看所有课程
  - [x] 查看课程详情
  - [x] 查看学生名单
  - [x] 查看课程分析

- [x] 作业管理
  - [x] 创建作业
  - [x] 更新作业
  - [x] 删除作业
  - [x] 发布作业
  - [x] 查看作业详情

- [x] 学生管理
  - [x] 查看所有学生
  - [x] 查看学生详情
  - [x] 保存学生备注

- [x] 提交评分
  - [x] 查看提交列表
  - [x] 查看提交详情
  - [x] 评分解题
  - [x] 添加反馈
  - [x] 查看评分摘要

- [x] 公告管理
  - [x] 创建公告
  - [x] 更新公告
  - [x] 删除公告
  - [x] 查看公告列表

- [x] AI功能
  - [x] AI自动评分
  - [x] 生成评分标准
  - [x] 班级表现分析
  - [x] 内容摘要

## 🔑 关键API端点

### 认证
```
POST   /api/auth/login
POST   /api/auth/signup
POST   /api/auth/logout
```

### 课程
```
GET    /api/teacher/classes
GET    /api/teacher/classes/:id
GET    /api/teacher/classes/:id/students
GET    /api/teacher/classes/:id/analytics
```

### 作业
```
GET    /api/teacher/assignments
POST   /api/teacher/assignments
GET    /api/teacher/assignments/:id
PUT    /api/teacher/assignments/:id
DELETE /api/teacher/assignments/:id
POST   /api/teacher/assignments/:id/publish
```

### 学生
```
GET    /api/teacher/students
GET    /api/teacher/students/:id
PUT    /api/teacher/students/:id/notes
```

### 提交
```
GET    /api/teacher/assignments/:assignmentId/submissions
GET    /api/teacher/submissions/:submissionId
PUT    /api/teacher/assignments/:assignmentId/submissions/:submissionId/grade
PUT    /api/teacher/submissions/:submissionId/feedback
GET    /api/teacher/assignments/:assignmentId/grading-summary
```

### 公告
```
GET    /api/teacher/announcements
POST   /api/teacher/announcements
PUT    /api/teacher/announcements/:id
DELETE /api/teacher/announcements/:id
```

### AI功能
```
POST   /api/teacher/ai/auto-grade
POST   /api/teacher/ai/generate-rubric
POST   /api/teacher/ai/analyze-class
POST   /api/teacher/ai/summarize
```

## 🐛 常见问题

### Q1: 权限错误 (403 Forbidden)

**解决方案**:
1. 确保用户有正确的角色
2. 检查profile_roles表是否有'teacher'角色
3. 确认教师有权限访问该课程

### Q2: 数据库连接错误

**解决方案**:
1. 检查SUPABASE_URL和SUPABASE_SERVICE_ROLE_KEY
2. 确认Supabase项目处于活跃状态
3. 检查网络连接

### Q3: JWT验证失败

**解决方案**:
1. 确认JWT_SECRET配置正确
2. 检查token是否过期
3. 确保Authorization头格式正确: `Bearer <token>`

### Q4: 表不存在错误

**解决方案**:
1. 重新运行数据库脚本
2. 检查SQL执行顺序
3. 确认表名和列名正确

## 📚 文档资源

- **完整API文档**: `backend/TEACHER_API.md`
- **后端总结**: `backend/TEACHER_BACKEND_SUMMARY.md`
- **数据库指南**: `db_scripts/README_COMPLETE.md`
- **AI Study Planner**: `db_scripts/STUDY_PLANNER_README.md`

## 🚀 下一步

1. **集成前端**: 连接React前端与后端API
2. **添加功能**: 根据需要扩展功能
3. **测试**: 编写自动化测试
4. **部署**: 部署到生产环境

## 📞 需要帮助？

- 查看详细文档
- 检查示例代码
- 查看错误日志
- 联系开发团队

---

**版本**: 1.0.0  
**最后更新**: 2025年1月  
**状态**: ✅ 生产就绪

