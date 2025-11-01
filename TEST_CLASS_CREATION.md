# 测试课程创建 - 逐步指南

## 🎯 现在测试创建课程功能

根据你看到的结果 "Policy count for class_teachers: 3"，数据库设置**可能已经完成**。现在让我们测试前端的创建功能：

### 步骤1: 确认后端正在运行

打开一个新的终端，运行：

```bash
cd backend
npm run dev
```

你应该看到：
```
🚀 HSC Power Server is running on http://localhost:3000
✅ Supabase client initialized
```

### 步骤2: 刷新前端页面

在浏览器中：
1. 按 F5 刷新 Teacher Dashboard
2. 确保已经登录

### 步骤3: 再次尝试创建课程

1. 点击 "My Classes"
2. 点击 "Create Class" 按钮
3. 填写表单：
   - Class Code: `MATH12-ADV-B` （换一个不同的code）
   - Class Name: `HSC Mathematics Advanced - B`
   - Description: `Test class creation`
   - Color: 选择一个颜色
   - Location: `Room 302`
4. 点击 "Create Class"

### 步骤4: 检查结果

**如果成功**：
- ✅ 看到 "Class created successfully!" alert
- ✅ 课程出现在列表中
- ✅ 可以点击查看详情

**如果失败**：
- ❌ 看到错误消息
- 打开浏览器开发者工具 (F12)
- 查看 "Console" 标签的红色错误
- 查看 "Network" 标签的最新请求
- 查看后端终端的错误日志

## 🔍 如果仍然失败

### 查看详细错误

**方法1: 浏览器控制台**
1. 按 F12 打开开发者工具
2. 点击 "Console" 标签
3. 查看错误信息
4. 截图发给我

**方法2: 后端日志**
1. 查看运行 `npm run dev` 的终端
2. 应该看到类似这样的错误：
   ```
   Error creating class: { code: '...', message: '...', details: '...' }
   ```
3. 复制完整的错误信息

**方法3: 检查数据库策略**

在Supabase SQL Editor运行：
```sql
-- 查看classes表的所有策略
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'classes';
```

这应该显示4个策略。告诉我每个策略的 `with_check` 列的内容。

### 可能的问题和解决方案

**问题1: 策略的 with_check 不是 `true`**

如果看到策略的 `with_check` 列显示 `(public.is_class_teacher(id) or public.is_admin())` 而不是 `true`，这是导致插入失败的原因。

**解决方案**: 在Supabase SQL Editor运行：
```sql
-- 删除旧的INSERT策略
DROP POLICY IF EXISTS "classes_crud_teacher_or_admin_insert" ON public.classes;

-- 创建允许所有authenticated用户的INSERT策略
CREATE POLICY "classes_crud_teacher_or_admin_insert"
  ON public.classes FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

**问题2: 后端使用了错误的Supabase key**

检查 `backend/.env` 文件，确保：
- `SUPABASE_KEY` 是 service_role key（不是anon key）
- URL格式正确

**问题3: teacher表字段不匹配**

检查Supabase中classes表的实际结构。运行：
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'classes'
ORDER BY ordinal_position;
```

告诉我显示的列名和类型。

## 📸 快速诊断

**运行这个测试**：在Supabase SQL Editor中直接测试插入：

```sql
-- 直接测试插入一个课程
INSERT INTO public.classes (code, name, description, color, location, teacher)
VALUES ('MANUAL-TEST', 'Manual Test Class', 'Testing manual insert', '#667eea', 'Room 999', 'System')
RETURNING *;
```

如果这个手动插入成功了，说明数据库没问题，问题在于后端API或前端连接。

---

**告诉我你现在看到了什么结果！** 🎯

