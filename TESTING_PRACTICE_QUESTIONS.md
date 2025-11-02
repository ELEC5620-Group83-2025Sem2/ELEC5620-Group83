# 测试练习题功能指南

## 问题：按钮无法点击

如果按钮无法点击，请按以下步骤排查：

## 步骤1: 检查浏览器控制台

打开浏览器开发者工具（F12），查看Console标签：

### 查找这些日志：
```
Selected subjects response: { success: true, subjects: [...] }
```

如果看到 `subjects: []`（空数组），说明你还没有选择HSC科目。

## 步骤2: 选择HSC科目

### 方式1: 使用AI推荐（推荐）

1. 前往 **HSC Subjects** 页面（或 **HSC Subject Recommendation**）
2. 点击 "Get AI Recommendations" 按钮
3. 等待AI生成推荐
4. 选择你想要的科目，点击 "Add to Study Plan"
5. 确认科目已被添加（应该看到成功提示）

### 方式2: 手动选择（如果方式1不行）

如果你的数据库中有 `selected_subjects` 表，可以手动插入数据测试：

```sql
-- 在Supabase SQL Editor中运行
INSERT INTO selected_subjects (student_id, subject_code, subject_name, category, reasoning)
VALUES 
  ('你的学生ID', 'MATH-ADV', 'Mathematics Advanced', 'Mathematics', 'AI推荐：适合你的数学水平'),
  ('你的学生ID', 'ENG-ST', 'English Standard', 'English', 'AI推荐：核心科目'),
  ('你的学生ID', 'PHYS', 'Physics', 'Science', 'AI推荐：理科强项');
```

**获取学生ID的方法：**
```sql
-- 查看所有学生
SELECT id, email, first_name, last_name 
FROM profiles 
WHERE id IN (
  SELECT profile_id FROM profile_roles WHERE role = 'student'
);
```

## 步骤3: 验证科目已保存

运行这个SQL查询：

```sql
-- 检查某个学生的选择科目
SELECT * FROM selected_subjects 
WHERE student_id = '你的学生ID';
```

应该看到至少一条记录。

## 步骤4: 测试生成按钮

1. 刷新页面（Ctrl+R 或 F5）
2. 前往 **Grades** 页面
3. 点击 **"🎯 Generate Practice Questions"** 标签
4. 检查页面显示：
   - ✅ 应该显示你选择的科目
   - ✅ "Selected Subjects" 数字应该 > 0
   - ✅ 按钮应该是绿色的，可以点击

### 如果按钮仍然禁用：

打开浏览器Console，输入：
```javascript
// 检查selectedSubjects状态
console.log('Current selected subjects:', window.selectedSubjects)
```

## 步骤5: 测试生成功能

1. 点击 **"✨ Start Practice Questions"** 按钮
2. 应该看到按钮文字变成 "⏳ Generating..."
3. 等待10-30秒（取决于科目数量）
4. 应该看到成功消息：
   ```
   ✅ Successfully generated X practice questions based on your selected subjects!
   ```

### 如果出现错误：

查看浏览器Console和后端日志，常见错误：

#### 错误1: OpenAI API错误
```
Error: OpenAI API error
```
**解决方案**：检查 `backend/.env` 文件中的 `OPENAI_API_KEY`

#### 错误2: 数据库错误
```
Error: Failed to create practice assignment
```
**解决方案**：检查数据库连接和表结构

## 步骤6: 测试复习功能

1. 生成题目成功后
2. 切换到 **"📚 Review Practice Questions"** 标签
3. 应该看到刚才生成的题目
4. 点击 **"🎯 Start Review Session"** 按钮

## 完整测试流程

```
1. 登录学生账号
   ↓
2. 前往 HSC Subjects 页面
   ↓
3. 获取AI推荐或选择科目
   ↓
4. 确认科目已保存
   ↓
5. 前往 Grades 页面
   ↓
6. 点击 "Generate Practice Questions" 标签
   ↓
7. 验证科目显示正确
   ↓
8. 点击 "Start Practice Questions" 按钮
   ↓
9. 等待生成完成
   ↓
10. 切换到 "Review Practice Questions" 标签
    ↓
11. 查看生成的题目
    ↓
12. 点击 "Start Review Session" 开始练习
```

## 调试SQL查询

```sql
-- 1. 检查学生账号
SELECT p.id, p.email, p.first_name, p.last_name, pr.role
FROM profiles p
JOIN profile_roles pr ON pr.profile_id = p.id
WHERE pr.role = 'student';

-- 2. 检查选择的科目
SELECT * FROM selected_subjects 
WHERE student_id = '你的学生ID';

-- 3. 检查生成的练习作业
SELECT * FROM assignments 
WHERE assignment_type = 'practice' 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. 检查生成的题目
SELECT 
  aq.id,
  aq.assignment_id,
  aq.question,
  aq.type,
  aq.subject,
  aq.subject_code,
  aq.points,
  a.title as assignment_title
FROM assignment_questions aq
JOIN assignments a ON a.id = aq.assignment_id
WHERE a.assignment_type = 'practice'
ORDER BY aq.created_at DESC
LIMIT 10;

-- 5. 检查题目选项（多选题）
SELECT 
  aqo.*,
  aq.question
FROM assignment_question_options aqo
JOIN assignment_questions aq ON aq.id = aqo.question_id
WHERE aq.assignment_id IN (
  SELECT id FROM assignments WHERE assignment_type = 'practice'
)
LIMIT 20;
```

## 常见问题FAQ

### Q: 为什么"Start Practice Questions"按钮是灰色的？

**A**: 有两个可能原因：
1. 你还没有选择HSC科目 → 去HSC Subjects页面选择
2. 正在生成中 → 等待完成

### Q: 点击按钮后没有反应？

**A**: 
1. 打开浏览器Console查看错误
2. 检查后端服务器是否运行
3. 检查网络请求是否成功（Network标签）

### Q: 生成失败怎么办？

**A**:
1. 检查OpenAI API密钥是否正确
2. 检查API配额是否用完
3. 查看后端日志的详细错误信息

### Q: 为什么"Start Review Session"按钮是灰色的？

**A**: 因为还没有生成任何练习题。先去"Generate Practice Questions"标签生成题目。

### Q: 生成的题目在哪里？

**A**: 在"Review Practice Questions"标签中可以看到所有生成的题目。

## 手动测试数据（用于开发测试）

如果需要快速测试，可以手动插入测试数据：

```sql
-- 插入测试科目（替换student_id）
INSERT INTO selected_subjects (student_id, subject_code, subject_name, category)
VALUES 
  ('你的student_id', 'MATH-ADV', 'Mathematics Advanced', 'Mathematics'),
  ('你的student_id', 'ENG-ST', 'English Standard', 'English'),
  ('你的student_id', 'PHYS', 'Physics', 'Science')
ON CONFLICT (student_id, subject_code, subject_name) DO NOTHING;
```

## 日志检查

### 浏览器Console应该看到：
```
Selected subjects response: { success: true, subjects: [Array(3)] }
Response data: { success: true, message: "Practice questions generated successfully", ... }
```

### 后端Console应该看到：
```
[getSelectedSubjects] Fetching selected subjects for student_id: xxx
[getSelectedSubjects] Found 3 selected subjects for student xxx
[generatePracticeQuestions] Generating for 3 subjects
✅ Successfully generated questions
```

---

**如果以上步骤都完成了但还是不行，请提供：**
1. 浏览器Console的错误信息
2. 后端日志的错误信息
3. 数据库查询结果截图

