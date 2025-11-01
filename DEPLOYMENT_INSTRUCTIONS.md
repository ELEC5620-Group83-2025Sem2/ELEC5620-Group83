# 数据库部署和Teacher端后端集成完整指南

## 📋 概述

本文档提供在Supabase数据库中设置HSC Power平台和Teacher端后端API的完整部署步骤。

## 🔗 数据库访问

**Supabase项目地址**: https://supabase.com/dashboard/project/lhkyjculexeyfswiursm/database/schemas

## ⚡ 快速部署步骤

### 步骤1: 创建Classes表

如果数据库中没有classes表，运行以下脚本：

**文件**: `db_scripts/classes_table.sql`

在Supabase SQL Editor中运行：

```sql
-- 创建classes表
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  teacher TEXT,
  color TEXT DEFAULT '#667eea',
  description TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 添加索引
CREATE INDEX IF NOT EXISTS classes_code_idx ON public.classes(code);
CREATE INDEX IF NOT EXISTS classes_name_idx ON public.classes(name);

-- 启用RLS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
```

### 步骤2: 设置RLS策略

**文件**: `db_scripts/policies.sql`

在Supabase SQL Editor中按顺序运行：

1. **运行完整policies.sql脚本**
2. **确保以下策略已应用**:

```sql
-- Classes表的RLS策略
DROP POLICY IF EXISTS "classes_crud_teacher_or_admin_insert" ON public.classes;
CREATE POLICY "classes_crud_teacher_or_admin_insert"
  ON public.classes FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

### 步骤3: 创建Class_Teachers关联表

**文件**: `db_scripts/init.sql`

运行以下部分（如果表不存在）：

```sql
-- Teachers assigned to classes
create table if not exists public.class_teachers (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  class_id  uuid not null references public.classes(id) on delete cascade,
  role_in_class text default 'teacher',
  created_at timestamptz default now(),
  primary key (profile_id, class_id)
);

create index if not exists class_teachers_class_idx on public.class_teachers (class_id);
create index if not exists class_teachers_profile_idx on public.class_teachers (profile_id);
alter table public.class_teachers enable row level security;
```

### 步骤4: 部署AI Study Planner表（可选）

如果需要AI Study Planner功能：

**文件**: `db_scripts/study_planner_tables.sql`

运行整个脚本以创建：
- hsc_subjects
- study_plans
- practice_question_sets
- practice_questions
- practice_question_options
- practice_attempts
- practice_attempt_answers
- incorrect_questions
- study_recommendations

## 🧪 验证部署

### 验证1: 检查表是否存在

```sql
-- 检查关键表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('classes', 'class_teachers', 'profiles', 'hsc_subjects')
ORDER BY table_name;
```

### 验证2: 检查RLS策略

```sql
-- 检查classes表的RLS策略
SELECT * FROM pg_policies 
WHERE tablename = 'classes';

-- 检查class_teachers表的RLS策略
SELECT * FROM pg_policies 
WHERE tablename = 'class_teachers';
```

### 验证3: 检查HSC Subjects数据

```sql
-- 查看HSC科目数量
SELECT COUNT(*) FROM hsc_subjects;

-- 查看前5个HSC科目
SELECT code, name, category FROM hsc_subjects LIMIT 5;
```

## 🔐 后端配置

### 环境变量设置

在 `backend/.env` 中配置：

```env
# Supabase配置
SUPABASE_URL=https://lhkyjculexeyfswiursm.supabase.co
SUPABASE_KEY=your-service-role-key-here

# 服务器配置
PORT=3000

# JWT配置（如果需要）
JWT_SECRET=your-jwt-secret-here

# OpenAI配置（AI功能）
OPENAI_API_KEY=sk-your-openai-key-here
```

### 获取Supabase密钥

1. 访问：https://supabase.com/dashboard/project/lhkyjculexeyfswiursm/settings/api
2. 复制 **service_role key**（不是anon key）
3. 粘贴到 `SUPABASE_KEY` 环境变量

## 🚀 启动服务

### 后端服务

```bash
cd backend
npm install
npm run dev
```

后端将在 `http://localhost:3000` 启动

### 前端服务

```bash
cd frontend
npm install
npm run dev
```

前端将在 `http://localhost:5173` 启动

## 📡 测试Teacher API

### 1. 登录获取Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "password",
    "role": "teacher"
  }'
```

### 2. 创建课程

```bash
curl -X POST http://localhost:3000/api/teacher/classes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "MATH12-ADV-A",
    "name": "HSC Mathematics Advanced - A",
    "description": "Advanced mathematics covering calculus and algebra",
    "color": "#667eea",
    "location": "Room 302, Building A"
  }'
```

### 3. 获取教师课程列表

```bash
curl http://localhost:3000/api/teacher/classes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. 获取HSC Subjects

```bash
curl http://localhost:3000/api/hsc-subjects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎯 前端测试

### 1. 访问Teacher Dashboard

打开浏览器访问：`http://localhost:5173/teacher/dashboard`

### 2. 测试创建课程功能

1. 点击左侧导航的"My Classes"
2. 点击"Create Class"按钮
3. 填写表单：
   - Class Code: `TEST123`
   - Class Name: `Test Class`
   - Description: `This is a test class`
   - Color: 选择颜色
   - Location: `Room 101`
4. 点击"Create Class"
5. 验证课程出现在列表中

### 3. 测试课程列表

- 验证课程卡片显示正确信息
- 验证颜色、学生数、作业数显示正确
- 点击课程卡片进入详情

### 4. 测试创建作业

1. 点击"Assignments"
2. 点击"Create Assignment"
3. 选择刚创建的课程
4. 填写作业信息并提交
5. 验证作业创建成功

## 🗂️ 完整文件列表

### 数据库脚本

- ✅ `db_scripts/classes_table.sql` - Classes表定义（新建）
- ✅ `db_scripts/policies.sql` - RLS策略（已更新）
- ✅ `db_scripts/init.sql` - 角色和关联表
- ✅ `db_scripts/teacher_tables.sql` - Teacher相关表
- ✅ `db_scripts/study_planner_tables.sql` - AI Study Planner表
- ✅ `db_scripts/study_planner_sample_data.sql` - 示例数据

### 后端文件

- ✅ `backend/controllers/teacher/classes.js` - 添加了createClass（已更新）
- ✅ `backend/routes/teacher.js` - 添加了POST /classes路由（已更新）
- ✅ `backend/routes/api.js` - 添加了GET /hsc-subjects（已更新）

### 前端文件

- ✅ `frontend/src/components/teacher/MyClassesView.jsx` - 添加创建功能（已更新）
- ✅ `frontend/src/components/teacher/DashboardOverview.jsx` - 修复响应格式（已更新）
- ✅ `frontend/src/components/teacher/CreateAssignmentView.jsx` - 修复响应格式（已更新）
- ✅ `frontend/src/components/teacher/AnalyticsView.jsx` - 修复响应格式（已更新）
- ✅ `frontend/src/components/teacher/StudentsView.jsx` - 修复响应格式（已更新）
- ✅ `frontend/src/components/teacher/AssignmentsView.jsx` - 修复响应格式（已更新）
- ✅ `frontend/src/components/teacher/AnnouncementsView.jsx` - 修复响应格式（已更新）
- ✅ `frontend/src/services/teacherApi.js` - 添加createClass和getHSCSubjects（已更新）

## ✅ 完成的功能

### 后端API

- ✅ GET /api/teacher/classes - 获取教师课程
- ✅ POST /api/teacher/classes - **创建课程（新增）**
- ✅ GET /api/teacher/classes/:id - 获取课程详情
- ✅ GET /api/teacher/classes/:id/students - 获取学生名单
- ✅ GET /api/teacher/classes/:id/analytics - 获取分析数据
- ✅ GET /api/hsc-subjects - **获取HSC科目（新增）**
- ✅ GET /api/teacher/assignments - 获取作业
- ✅ POST /api/teacher/assignments - 创建作业
- ✅ 更多...

### 前端功能

- ✅ 课程列表显示
- ✅ **创建课程模态框（新增）**
- ✅ 课程详情查看
- ✅ 作业管理
- ✅ HSC科目浏览
- ✅ Practice Questions
- ✅ Review Mistakes

## 🐛 故障排除

### 问题1: "Classes表不存在"

**解决方案**: 运行 `db_scripts/classes_table.sql`

### 问题2: "RLS policy violation"

**解决方案**: 
1. 检查 `policies.sql` 是否已运行
2. 验证 `classes_crud_teacher_or_admin_insert` 策略设置为 `WITH CHECK (true)`
3. 确认使用service_role key

### 问题3: 课程创建成功但不显示在教师列表中

**解决方案**:
1. 检查 `class_teachers` 表是否正确创建关联
2. 验证教师profile_id是否正确
3. 检查RLS策略是否允许查询

### 问题4: "响应格式错误"

**解决方案**:
- 检查前端是否正确访问 `response.classes`（不是 `response.data`）
- 检查后端返回格式：`{ classes: [...] }`

## 📚 相关文档

- **完整数据库指南**: `db_scripts/README_COMPLETE.md`
- **Teacher API文档**: `backend/TEACHER_API.md`
- **Teacher后端总结**: `backend/TEACHER_BACKEND_SUMMARY.md`
- **HSC Subjects集成**: `HSC_SUBJECTS_INTEGRATION.md`
- **课程创建完成**: `TEACHER_CLASS_CREATION_COMPLETE.md`
- **Teacher快速开始**: `QUICK_START_TEACHER.md`

## 🎉 成功验证

完成部署后，你应该能够：

1. ✅ 在Teacher Dashboard创建课程
2. ✅ 查看创建的课程列表
3. ✅ 点击课程查看详情
4. ✅ 为课程创建作业
5. ✅ 浏览HSC Subjects列表
6. ✅ 使用Practice Questions功能
7. ✅ 查看Review Mistakes

---

**部署状态**: ✅ 准备就绪  
**数据库地址**: https://supabase.com/dashboard/project/lhkyjculexeyfswiursm  
**版本**: 1.0.0  
**日期**: 2025年1月28日  
**维护者**: ELEC5620 Group 83

