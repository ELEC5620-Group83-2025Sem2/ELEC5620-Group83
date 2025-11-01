# 创建课程失败故障排除指南

## 🔍 问题诊断

如果看到 "Failed to create class. Please try again." 错误，请按以下步骤检查：

### 步骤1: 检查后端是否运行

```bash
# 在终端检查端口3000是否在运行
netstat -ano | findstr :3000
# 或者
powershell -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object LocalAddress,LocalPort,State"
```

**如果后端没有运行**:
```bash
cd backend
npm run dev
```

### 步骤2: 检查数据库表是否存在

在Supabase SQL Editor中运行以下查询：

```sql
-- 检查classes表是否存在
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'classes'
);

-- 如果返回false，运行以下脚本创建表
```

### 步骤3: 创建Classes表

在Supabase SQL Editor中运行：

```sql
-- 创建classes表（如果不存在）
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

### 步骤4: 设置RLS策略

```sql
-- 删除旧策略
DROP POLICY IF EXISTS "classes_select_all_auth" ON public.classes;
DROP POLICY IF EXISTS "classes_crud_teacher_or_admin_insert" ON public.classes;
DROP POLICY IF EXISTS "classes_crud_teacher_or_admin_update" ON public.classes;
DROP POLICY IF EXISTS "classes_crud_teacher_or_admin_delete" ON public.classes;

-- 创建新策略
CREATE POLICY "classes_select_all_auth"
  ON public.classes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "classes_crud_teacher_or_admin_insert"
  ON public.classes FOR INSERT
  TO authenticated
  WITH CHECK (true);  -- 允许所有authenticated用户插入

CREATE POLICY "classes_crud_teacher_or_admin_update"
  ON public.classes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "classes_crud_teacher_or_admin_delete"
  ON public.classes FOR DELETE
  TO authenticated
  USING (true);

-- 授予权限
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classes TO authenticated;
```

### 步骤5: 检查class_teachers表

```sql
-- 检查class_teachers表是否存在
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'class_teachers'
);

-- 如果不存在，创建表
CREATE TABLE IF NOT EXISTS public.class_teachers (
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id  UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  role_in_class TEXT DEFAULT 'teacher',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (profile_id, class_id)
);

-- 添加索引
CREATE INDEX IF NOT EXISTS class_teachers_class_idx ON public.class_teachers(class_id);
CREATE INDEX IF NOT EXISTS class_teachers_profile_idx ON public.class_teachers(profile_id);

-- 启用RLS
ALTER TABLE public.class_teachers ENABLE ROW LEVEL SECURITY;

-- 设置RLS策略
DROP POLICY IF EXISTS "class_teachers_select_self_or_admin" ON public.class_teachers;
CREATE POLICY "class_teachers_select_self_or_admin"
  ON public.class_teachers FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid() OR auth.jwt()->>'role' = 'service_role');

DROP POLICY IF EXISTS "class_teachers_insert_self" ON public.class_teachers;
CREATE POLICY "class_teachers_insert_self"
  ON public.class_teachers FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid() OR auth.jwt()->>'role' = 'service_role');
```

### 步骤6: 检查后端环境变量

确保 `backend/.env` 文件存在且配置正确：

```env
# Supabase配置
SUPABASE_URL=https://lhkyjculexeyfswiursm.supabase.co
SUPABASE_KEY=your-service-role-key-here

# 服务器配置
PORT=3000

# JWT配置
JWT_SECRET=your-jwt-secret-here
```

**重要**: `SUPABASE_KEY` 必须是 **service_role key**，不是 anon key！

### 步骤7: 测试API端点

使用curl或Postman测试：

```bash
# 1. 先登录获取token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "password",
    "role": "teacher"
  }'

# 2. 使用返回的token创建课程
curl -X POST http://localhost:3000/api/teacher/classes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TEST123",
    "name": "Test Class",
    "description": "This is a test",
    "color": "#667eea",
    "location": "Room 101"
  }'
```

### 步骤8: 查看后端日志

在后端终端中查看详细错误信息：

```bash
# 后端正在运行时，查看终端输出
# 应该会显示类似以下的错误信息：
Error creating class: { code: 'PGRST204', details: '...', message: '...' }
```

## 🐛 常见错误及解决方案

### 错误1: "relation public.classes does not exist"

**原因**: classes表不存在  
**解决方案**: 运行步骤3中的SQL创建表

### 错误2: "new row violates row-level security policy"

**原因**: RLS策略不允许插入  
**解决方案**: 
1. 检查service_role key是否正确
2. 确保RLS策略已设置为 `WITH CHECK (true)`
3. 运行步骤4中的SQL更新策略

### 错误3: "Could not find a relationship between 'profiles' and 'classes'"

**原因**: class_teachers表或外键关系缺失  
**解决方案**: 运行步骤5中的SQL创建class_teachers表

### 错误4: "JWT expired" 或 "Not authenticated"

**原因**: 认证token过期或无效  
**解决方案**: 
1. 重新登录
2. 检查浏览器的localStorage中的access_token
3. 检查后端JWT配置

### 错误5: "Network error" 或连接超时

**原因**: 后端未运行或端口错误  
**解决方案**: 
1. 确认后端在 `http://localhost:3000` 运行
2. 检查防火墙设置
3. 确认前端配置的API地址正确

## 🔧 快速修复脚本

将所有必需的SQL合并到一个脚本中，在Supabase SQL Editor中一次性运行：

```sql
-- ==============================================
-- Complete Classes Setup Script
-- ==============================================
-- Run this in Supabase SQL Editor if you're starting fresh

-- 1. Create classes table
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

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS classes_code_idx ON public.classes(code);
CREATE INDEX IF NOT EXISTS classes_name_idx ON public.classes(name);

-- 3. Enable RLS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- 4. Create/Recreate RLS policies
DROP POLICY IF EXISTS "classes_select_all_auth" ON public.classes;
CREATE POLICY "classes_select_all_auth"
  ON public.classes FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "classes_crud_teacher_or_admin_insert" ON public.classes;
CREATE POLICY "classes_crud_teacher_or_admin_insert"
  ON public.classes FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "classes_crud_teacher_or_admin_update" ON public.classes;
CREATE POLICY "classes_crud_teacher_or_admin_update"
  ON public.classes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "classes_crud_teacher_or_admin_delete" ON public.classes;
CREATE POLICY "classes_crud_teacher_or_admin_delete"
  ON public.classes FOR DELETE
  TO authenticated
  USING (true);

-- 5. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classes TO authenticated;

-- 6. Create class_teachers table
CREATE TABLE IF NOT EXISTS public.class_teachers (
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id  UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  role_in_class TEXT DEFAULT 'teacher',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (profile_id, class_id)
);

CREATE INDEX IF NOT EXISTS class_teachers_class_idx ON public.class_teachers(class_id);
CREATE INDEX IF NOT EXISTS class_teachers_profile_idx ON public.class_teachers(profile_id);
ALTER TABLE public.class_teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "class_teachers_select_self_or_admin" ON public.class_teachers;
CREATE POLICY "class_teachers_select_self_or_admin"
  ON public.class_teachers FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid() OR auth.jwt()->>'role' = 'service_role');

DROP POLICY IF EXISTS "class_teachers_insert_self" ON public.class_teachers;
CREATE POLICY "class_teachers_insert_self"
  ON public.class_teachers FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid() OR auth.jwt()->>'role' = 'service_role');

GRANT SELECT, INSERT, UPDATE, DELETE ON public.class_teachers TO authenticated;

-- 7. Verification
SELECT 'Tables created successfully!' as status;
SELECT COUNT(*) as class_count FROM public.classes;
SELECT COUNT(*) as class_teachers_count FROM public.class_teachers;
```

## ✅ 验证清单

完成后，检查以下各项：

- [ ] 后端服务器正在运行
- [ ] 前端服务器正在运行
- [ ] classes表已创建
- [ ] class_teachers表已创建
- [ ] RLS策略已正确设置
- [ ] 使用service_role key（不是anon key）
- [ ] 用户已登录且token有效
- [ ] 浏览器控制台无JavaScript错误
- [ ] 后端日志无错误信息

## 📞 需要帮助？

如果以上步骤都无法解决问题：

1. **查看后端日志**: 在后端运行终端查看详细错误
2. **查看浏览器控制台**: F12打开开发者工具，查看Network和Console标签
3. **检查Supabase日志**: 在Supabase Dashboard的Logs部分查看数据库错误
4. **验证SQL执行**: 确认所有SQL脚本都成功执行，无错误信息

---

**最后更新**: 2025年1月28日  
**维护者**: ELEC5620 Group 83

