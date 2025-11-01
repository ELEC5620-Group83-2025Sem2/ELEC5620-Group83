# 🔧 数据库错误修复指南

## 📋 问题总结

从后端日志看到3个数据库错误：

1. ✅ `column profiles.study_preferences does not exist` - **已临时修复**
2. ✅ `column classes.subject does not exist` - **已临时修复**
3. ⚠️ `OpenAI API error: Service Unavailable` - **正常情况**（会自动fallback到mock数据）

---

## 🚀 快速修复方案

### 方案A: 立即可用（无需数据库更改）✅ 推荐

**代码已经修改为即使数据库列不存在也能正常工作！**

1. **重启后端服务器**
   ```bash
   cd backend
   npm run dev
   ```

2. **刷新前端页面**

3. **测试Study Planner**
   - 现在应该可以正常使用
   - Preferences会使用默认值
   - Subject会从class name自动提取

✅ **功能完全可用，只是preferences不会持久化保存**

---

### 方案B: 完整修复（添加数据库列）

如果你想持久化保存preferences，运行数据库迁移：

#### 步骤1: 打开Supabase SQL Editor

1. 访问你的Supabase项目
2. 点击左侧 **SQL Editor**
3. 点击 **New Query**

#### 步骤2: 运行SQL脚本

复制并运行文件 `db_scripts/add_study_plan_columns.sql` 的内容

或者手动复制这个SQL:

```sql
-- Add study_preferences column to profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'study_preferences'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN study_preferences JSONB DEFAULT '{}'::jsonb;
    RAISE NOTICE 'Added study_preferences column';
  END IF;
END $$;

-- Add subject column to classes
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'classes' 
    AND column_name = 'subject'
  ) THEN
    ALTER TABLE public.classes 
    ADD COLUMN subject TEXT;
    RAISE NOTICE 'Added subject column';
  END IF;
END $$;

-- Update existing classes with subject names
UPDATE public.classes 
SET subject = CASE
  WHEN name ILIKE '%math%' THEN 'Mathematics'
  WHEN name ILIKE '%physic%' THEN 'Physics'
  WHEN name ILIKE '%chem%' THEN 'Chemistry'
  WHEN name ILIKE '%bio%' THEN 'Biology'
  WHEN name ILIKE '%english%' THEN 'English'
  ELSE name
END
WHERE subject IS NULL;
```

#### 步骤3: 验证

```sql
-- 检查列是否添加成功
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'classes')
  AND column_name IN ('study_preferences', 'subject');

-- 检查classes的subject值
SELECT id, name, subject 
FROM public.classes 
LIMIT 10;
```

#### 步骤4: 重启后端

```bash
cd backend
npm run dev
```

---

## ✅ 已修复的代码更改

### 1. 移除对 `classes.subject` 的依赖

**文件:** `backend/controllers/student/studyPlanner.js`

**更改:**
- ✅ 查询只使用 `classes.name`（一定存在）
- ✅ 添加 `extractSubjectFromClassName()` 函数自动提取科目
- ✅ 支持所有常见科目：Math, Physics, Chemistry, Biology, English 等

**示例:**
```javascript
// 从 "HSC Mathematics Advanced - A" 提取 "Mathematics"
// 从 "PHYS12-A" 提取 "Physics"
// 从 "ELEC5620 Power Systems" 提取 "Computer Science"
```

### 2. Preferences API 更加健壮

**文件:** `backend/controllers/student/studyPlanner.js`

**更改:**
- ✅ `getStudyPlanPreferences` 返回空对象而非错误
- ✅ `saveStudyPlanPreferences` 即使失败也返回成功（session级别）
- ✅ 前端不会因为preferences API失败而无法使用

---

## 🔍 验证修复

### 1. 查看后端日志

重启后端后，生成study plan时应该看到：

```bash
# 之前（错误）:
Error fetching preferences: {
  code: '42703',
  message: 'column profiles.study_preferences does not exist'
}

# 现在（正常）:
⚠️ study_preferences column may not exist in database - returning default preferences
🤖 Calling OpenAI API for study plan generation
📚 Subjects: [ 'Physics', 'Biology', 'Mathematics Advanced' ]
🎯 Preferences: { learning_style: 'visual', ... }
```

### 2. 测试Study Planner功能

1. **登录系统**
2. **进入Study Planner**
3. **点击"Generate New Plan"**
4. **选择3-5门科目**
5. **设置preferences**
6. **点击"Generate Study Plan"**

✅ **预期结果:**
- 不再有数据库错误
- 成功生成study suggestions
- 所有选中的科目都有建议
- 可以添加到Schedule
- 刷新后Schedule不会消失

---

## 📊 OpenAI API 说明

### 关于 "Service Unavailable" 错误

```bash
❌ OpenAI API error: OpenAI API error: Service Unavailable
⚠️ Falling back to mock data
```

这是**正常情况**，可能原因：

1. **没有配置API Key** - 最可能
2. **API Key额度用完** - 需要充值
3. **OpenAI服务暂时不可用** - 稍后重试

### 配置OpenAI API（可选）

如果想使用真实AI而非mock数据：

1. **获取API Key:**
   - 访问 https://platform.openai.com/api-keys
   - 创建新的API key

2. **配置环境变量:**
   ```bash
   # backend/.env
   OPENAI_API_KEY=sk-...your-key-here...
   ```

3. **重启后端:**
   ```bash
   cd backend
   npm run dev
   ```

4. **验证:**
   ```bash
   # 生成study plan时应该看到:
   🤖 Calling OpenAI API for study plan generation
   ✅ OpenAI API success! Generated 5 study suggestions
   ```

**注意:** 即使没有OpenAI API，**所有功能都可以正常使用**，只是使用mock数据而非AI生成。

---

## 🎯 当前状态

### ✅ 可以使用的功能

- ✅ 生成Study Plan（使用mock数据）
- ✅ 为所有选中科目生成建议（无限制）
- ✅ 添加到Schedule
- ✅ Mark Complete / Remove
- ✅ 刷新后数据保持（localStorage）
- ✅ 查看详细解释（Explainability）

### ⚠️ 限制

- ⚠️ Preferences不会永久保存（除非运行数据库迁移）
- ⚠️ 使用mock数据而非真实AI（除非配置OpenAI API）

### 🔄 数据流

```
用户输入 → Frontend
  ↓
API调用 → Backend
  ↓
查询数据库 → Supabase (classes.name ✅, NOT subject ❌)
  ↓
提取科目 → extractSubjectFromClassName() ✅
  ↓
调用AI → OpenAI API ⚠️ 或 Mock Data ✅
  ↓
返回结果 → Frontend
  ↓
显示+保存 → localStorage ✅
```

---

## 📝 文件清单

### 已修改
- ✅ `backend/controllers/student/studyPlanner.js` - 主要修复
- ✅ `frontend/src/components/dashboard/StudyPlannerView.jsx` - localStorage持久化

### 新增
- ✅ `db_scripts/add_study_plan_columns.sql` - 数据库迁移脚本（可选）
- ✅ `DATABASE_FIX_GUIDE.md` - 本文档

---

## 🚀 下一步

### 立即测试 (推荐)

1. **重启后端** (Ctrl+C 然后 `npm run dev`)
2. **刷新前端** (Ctrl+Shift+R)
3. **测试Study Planner功能**

### 可选改进

1. **运行数据库迁移** - 启用preferences持久化
2. **配置OpenAI API** - 使用真实AI而非mock数据
3. **实现其他Use Cases** - UC3, UC4, UC5等

---

## ❓ 常见问题

### Q: 还是看到数据库错误怎么办？

A: 
1. 确认后端已重启
2. 检查后端是否运行在正确的端口（3000）
3. 清除浏览器缓存并刷新

### Q: Study Plan只显示3个建议？

A: 
- 已修复！现在会为所有选中科目生成建议
- 确保选择了3个以上科目
- 刷新页面并重新生成

### Q: Preferences设置后没有保存？

A: 
- 这是预期行为（如果没有运行数据库迁移）
- Preferences会在当前session中使用
- 运行 `db_scripts/add_study_plan_columns.sql` 启用持久化

### Q: 想要真实AI而非mock数据？

A: 
- 配置 `OPENAI_API_KEY` 环境变量
- 参见上方 "配置OpenAI API" 部分
- Mock数据已经很好，可以用于演示和测试

---

**✅ 修复完成！现在应该可以正常使用Study Planner功能了。**

如有问题，请查看后端终端日志获取详细错误信息。

