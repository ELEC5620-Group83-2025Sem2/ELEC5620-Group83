# 练习题功能设置指南 - 使用独立表结构

## 📋 概述

这个功能使用**独立的数据表**来存储AI生成的练习题，不依赖 `assignments` 表。

### 数据表结构

```
practice_question_sets (题集)
  ├─ id, student_id, title, description
  └─ total_questions, total_points

practice_questions (题目)
  ├─ id, set_id, student_id
  ├─ question, type, points
  ├─ subject, subject_code (科目标注) ⭐
  ├─ correct_answer, explanation
  └─ attempted, correct, attempt_count

practice_question_options (选项)
  ├─ id, question_id
  ├─ option_text
  └─ is_correct
```

## 🚀 快速设置（3步完成）

### 步骤 1: 创建数据表

在 **Supabase SQL Editor** 中运行：

```sql
-- 复制文件 db_scripts/create_practice_questions_table.sql 的全部内容
-- 或者直接运行下面的 SQL

-- 1. 题集表
CREATE TABLE IF NOT EXISTS practice_question_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  total_questions INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 题目表（带科目标注）
CREATE TABLE IF NOT EXISTS practice_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id UUID NOT NULL REFERENCES practice_question_sets(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('multiple_choice', 'short_answer', 'text', 'true_false')),
  question TEXT NOT NULL,
  points INTEGER DEFAULT 10,
  subject TEXT NOT NULL,  -- 科目名称
  subject_code VARCHAR(50),  -- 科目代码
  correct_answer TEXT,
  explanation TEXT,
  attempted BOOLEAN DEFAULT FALSE,
  correct BOOLEAN DEFAULT NULL,
  attempt_count INTEGER DEFAULT 0,
  last_attempted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 选项表
CREATE TABLE IF NOT EXISTS practice_question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES practice_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  position INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 索引
CREATE INDEX IF NOT EXISTS idx_practice_sets_student ON practice_question_sets(student_id);
CREATE INDEX IF NOT EXISTS idx_practice_questions_set ON practice_questions(set_id);
CREATE INDEX IF NOT EXISTS idx_practice_questions_student ON practice_questions(student_id);
CREATE INDEX IF NOT EXISTS idx_practice_questions_subject ON practice_questions(subject);
CREATE INDEX IF NOT EXISTS idx_practice_questions_subject_code ON practice_questions(subject_code);
CREATE INDEX IF NOT EXISTS idx_practice_options_question ON practice_question_options(question_id);

-- 5. RLS 策略
ALTER TABLE practice_question_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_question_options ENABLE ROW LEVEL SECURITY;

-- 学生只能访问自己的数据
CREATE POLICY "students_own_practice_sets"
  ON practice_question_sets FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "students_own_practice_questions"
  ON practice_questions FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "students_own_practice_options"
  ON practice_question_options FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM practice_questions pq
      WHERE pq.id = question_id AND pq.student_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM practice_questions pq
      WHERE pq.id = question_id AND pq.student_id = auth.uid()
    )
  );

-- 6. 授予权限
GRANT ALL ON practice_question_sets TO authenticated;
GRANT ALL ON practice_questions TO authenticated;
GRANT ALL ON practice_question_options TO authenticated;

SELECT '✅ Practice questions tables created!' as status;
```

### 步骤 2: 检查后端密钥

检查 `backend/.env` 文件，**必须使用 SERVICE_ROLE key**：

```env
SUPABASE_URL=https://你的项目.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (service_role key)
OPENAI_API_KEY=sk-你的OpenAI密钥
```

⚠️ **重要**：不要用 anon key！

### 步骤 3: 重启后端服务器

```bash
cd backend
npm run dev
```

应该看到：
```
✅ Supabase client initialized
✅ Database connection successful!
```

## ✅ 完整测试流程

### 1. 选择HSC科目

1. 登录学生账号
2. 前往 **HSC Subjects** 页面
3. 获取AI推荐或手动选择科目
4. 保存选择

### 2. 生成练习题

1. 前往 **Grades** 页面
2. 点击 **"🎯 Generate Practice Questions"** 标签
3. 应该看到你选择的科目
4. 点击 **"✨ Start Practice Questions"** 按钮
5. 等待10-30秒（AI生成中）
6. 看到成功消息：
   ```
   ✅ Successfully generated X practice questions based on your selected subjects!
   ```

### 3. 复习练习题

1. 切换到 **"📚 Review Practice Questions"** 标签
2. 查看生成的题目（按科目分类）
3. 点击 **"🎯 Start Review Session"** 开始练习

## 🔍 数据验证

### 检查数据表是否创建成功

```sql
-- 查看表列表
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns 
        WHERE table_name = t.table_name) as columns
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name LIKE 'practice_%'
ORDER BY table_name;

-- 应该看到3个表：
-- practice_question_sets
-- practice_questions
-- practice_question_options
```

### 检查生成的数据

```sql
-- 查看题集
SELECT * FROM practice_question_sets 
ORDER BY created_at DESC 
LIMIT 5;

-- 查看题目（带科目标注）
SELECT 
  id,
  question,
  subject,  -- 科目名称
  subject_code,  -- 科目代码
  type,
  points
FROM practice_questions 
ORDER BY created_at DESC 
LIMIT 10;

-- 查看选项
SELECT 
  pqo.*,
  pq.question
FROM practice_question_options pqo
JOIN practice_questions pq ON pq.id = pqo.question_id
ORDER BY pqo.created_at DESC
LIMIT 20;
```

## 🎯 功能特点

### ✅ 已实现

1. **独立数据结构**
   - 不依赖 assignments 表
   - 不需要 class_id
   - 专门的练习题表

2. **科目标注**
   - 每道题都标注了科目名称和代码
   - 例如：Mathematics Advanced (MATH-ADV)

3. **AI生成**
   - 基于学生选择的科目
   - 每个科目生成3道题
   - 使用 OpenAI GPT-4

4. **学习追踪**
   - 记录尝试次数
   - 记录正确/错误
   - 计算掌握率

5. **数据安全**
   - RLS 策略保护
   - 学生只能看自己的题目

## 📝 数据流程

```
用户点击 "Start Practice Questions"
    ↓
后端从 selected_subjects 获取选择的科目
    ↓
为每个科目调用 OpenAI API
    ↓
创建 practice_question_set (题集)
    ↓
保存题目到 practice_questions (带科目标注)
    ↓
保存选项到 practice_question_options
    ↓
返回成功消息
    ↓
前端显示在 "Review Practice Questions" 标签
```

## 🐛 常见问题

### Q: 按钮显示为灰色，无法点击？

**A**: 检查以下几点：
1. 是否已选择HSC科目？
2. 浏览器Console是否有错误？
3. 后端是否使用了 service_role key？

### Q: 点击后显示错误？

**A**: 打开浏览器Console，查看具体错误：
- 如果是 "table does not exist"：运行步骤1的SQL
- 如果是 "permission denied"：检查RLS策略
- 如果是 "OpenAI error"：检查API密钥

### Q: 生成成功但看不到题目？

**A**: 
1. 切换到 "Review Practice Questions" 标签
2. 检查数据库是否有数据
3. 查看后端日志是否有错误

### Q: 如何查看后端日志？

**A**: 在运行 `npm run dev` 的终端窗口中查看

## 📦 相关文件

- `db_scripts/create_practice_questions_table.sql` - 数据表创建脚本
- `backend/controllers/student/practiceQuestions.js` - 生成题目逻辑
- `backend/controllers/student/reviewQuestions.js` - 复习题目逻辑
- `frontend/src/components/dashboard/GeneratePracticeQuestions.jsx` - 生成界面
- `frontend/src/components/dashboard/ReviewIncorrectQuestions.jsx` - 复习界面

## 🎉 优势

与使用 `assignments` 表相比的优势：

1. ✅ 不需要修改 assignments 表结构
2. ✅ 不需要处理 class_id 约束
3. ✅ 数据结构更清晰
4. ✅ 权限管理更简单
5. ✅ 练习题和作业完全分离
6. ✅ 可以添加更多练习相关字段（如学习追踪）

---

**创建日期**: 2025-11-02  
**版本**: 2.0.0 (独立表结构)

