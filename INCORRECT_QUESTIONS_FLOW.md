# 错题系统流程说明 (Incorrect Questions Flow)

## 📊 完整流程图

```
学生做题 → 提交答案 (POST /api/student/practice-answers/submit)
    ↓
判断对错 (在 practiceAnswers.js 中)
    ↓
更新 practice_questions 表
    ├─ attempted = true
    ├─ correct = true/false ← 关键字段！
    └─ attempt_count += 1
    ↓
如果答错 (correct = false)
    ↓
写入 incorrect_questions 表 ← 专门的错题表
    ├─ student_id
    ├─ question_id
    ├─ question (题目文本)
    ├─ type
    ├─ subject
    ├─ subject_code
    ├─ points
    ├─ student_answer ← 学生的错误答案
    ├─ correct_answer
    ├─ explanation
    ├─ options (JSON格式)
    ├─ review_count
    ├─ mastery_level
    └─ timestamps
    
获取错题时 (GET /api/student/review-questions)
    ↓
从 incorrect_questions 表查询
    WHERE student_id = 当前学生
    ORDER BY last_reviewed_at DESC
    ↓
返回错题列表给前端
```

## 🗂️ 数据表说明

### 1. practice_questions 表
**作用：** 存储所有练习题（正确的和错误的）
**关键字段：**
- `attempted`: 是否已尝试
- `correct`: 是否答对（用于标记错题）
- `attempt_count`: 尝试次数

### 2. incorrect_questions 表 ⭐
**作用：** 专门存储错题，用于错题复习功能
**关键字段：**
- `student_id`: 学生ID
- `question_id`: 引用 practice_questions 的 ID
- `student_answer`: 学生提交的答案（重要：可以看到自己的错误）
- `correct_answer`: 正确答案
- `explanation`: 解析
- `options`: 选项（JSON格式）
- `review_count`: 复习次数
- `mastery_level`: 掌握程度 ('Needs Review', 'Practicing', 'Mastered')
- `first_answered_at`: 第一次答错的时间
- `last_reviewed_at`: 最后复习时间

**唯一约束：** (student_id, question_id) - 每个学生对同一题目只保存一次错题记录

## 📁 相关文件

### Backend (后端)
1. **backend/controllers/student/practiceAnswers.js**
   - `submitPracticeAnswer()`: 提交答案，判断对错，写入 incorrect_questions
   
2. **backend/controllers/student/reviewQuestions.js**
   - `getReviewQuestions()`: 从 incorrect_questions 表获取错题
   - `getReviewStats()`: 获取错题统计信息

3. **backend/routes/student.js**
   - `POST /api/student/practice-answers/submit`: 提交答案
   - `GET /api/student/review-questions`: 获取错题列表
   - `GET /api/student/review-questions/stats`: 获取错题统计

### Frontend (前端)
1. **frontend/src/components/dashboard/GeneratePracticeQuestions.jsx**
   - 提交答案到后端

2. **frontend/src/components/dashboard/ReviewIncorrectQuestions.jsx**
   - 显示错题列表
   - 学生可以看到自己的错误答案

3. **frontend/src/services/studentApi.js**
   - API 调用函数

## 🔧 数据库设置

确保已运行以下 SQL 脚本：

```sql
-- 创建 incorrect_questions 表
-- 文件: db_scripts/create_incorrect_questions_table.sql
-- 或
-- 文件: db_scripts/fix_incorrect_questions_table_complete.sql
```

## ✅ 核心优势

1. **完整的错题记录**
   - 保存学生的错误答案
   - 保存正确答案和解析
   - 保存所有选项（JSON格式）

2. **复习追踪**
   - `review_count`: 复习次数
   - `mastery_level`: 掌握程度
   - `last_reviewed_at`: 最后复习时间

3. **性能优化**
   - 专门的错题表，查询更快
   - 索引优化（student_id, subject, mastery_level）

4. **数据完整性**
   - RLS 策略保护（学生只能看自己的错题）
   - 唯一约束防止重复记录
   - 自动更新时间戳

## 🧪 测试步骤

1. **生成练习题**
   - 在前端选择科目
   - 生成练习题

2. **故意答错**
   - 选择错误答案
   - 提交

3. **查看后端日志**
   ```
   [Incorrect Questions] Saving to incorrect_questions table
   [Incorrect Questions] ✅ Successfully upserted to incorrect_questions
   ```

4. **查看错题列表**
   - 进入"Review Incorrect Questions"页面
   - 应该能看到刚才答错的题目
   - 可以看到自己的错误答案

5. **查看数据库**
   ```sql
   SELECT * FROM incorrect_questions 
   WHERE student_id = 'your-student-id'
   ORDER BY last_reviewed_at DESC;
   ```

## 🐛 常见问题

### 问题1: 错题没有保存到 incorrect_questions 表
**检查：**
1. 后端日志中是否有错误
2. RLS 策略是否正确设置
3. 表结构是否完整

### 问题2: 前端看不到错题
**检查：**
1. API 调用是否成功
2. 后端是否返回数据
3. 前端数据格式是否匹配

### 问题3: options 字段为空
**原因：** options 以 JSON 格式存储
**解决：** 代码已自动处理 JSON 解析

## 📊 数据流示例

```json
// 1. 提交答案 (POST)
{
  "questionId": "123-456-789",
  "answer": "B",
  "correct": false
}

// 2. 写入 incorrect_questions
{
  "student_id": "user-id",
  "question_id": "123-456-789",
  "question": "What is 2+2?",
  "type": "multiple-choice",
  "subject": "Mathematics",
  "student_answer": "B",
  "correct_answer": "A",
  "options": [
    {"text": "4", "isCorrect": true},
    {"text": "5", "isCorrect": false}
  ],
  "explanation": "2+2 equals 4"
}

// 3. 获取错题 (GET)
{
  "questions": [
    {
      "id": "incorrect-question-id",
      "questionId": "123-456-789",
      "question": "What is 2+2?",
      "studentAnswer": "B",
      "correctAnswer": "A",
      "explanation": "2+2 equals 4",
      "masteryLevel": "Needs Review"
    }
  ],
  "total": 1
}
```

## 🎯 下一步功能

1. **复习次数追踪**
   - 更新 `review_count` 当学生复习错题时
   
2. **掌握度更新**
   - 当学生连续答对时，更新 `mastery_level` 为 'Mastered'
   
3. **间隔重复**
   - 根据 `next_review_date` 推荐复习时间

---

**最后更新：** 2025-11-02
**维护者：** ELEC5620 Group 83

