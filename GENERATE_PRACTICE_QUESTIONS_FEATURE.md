# Generate Practice Questions Feature

## 概述

这个功能允许学生根据他们选择的HSC科目生成AI练习题。题目会自动标注科目，并存储在数据库的`assignment_questions`表中。

## 功能特点

### 1. **AI生成练习题**
   - 基于学生在`selected_subjects`表中选择的HSC科目
   - 使用OpenAI GPT-4生成高质量的练习题
   - 每个科目生成3道题目
   - 题目类型包括：多选题、简答题等

### 2. **科目标注**
   - 每道题目都会标注所属科目
   - 包含`subject`字段（科目名称）
   - 包含`subject_code`字段（科目代码）

### 3. **用户界面**
   - 在Grades页面新增"Generate Practice Questions"标签页
   - 显示已选择的HSC科目
   - 显示统计信息（生成的题目总数、最后生成时间）
   - 一键生成练习题按钮

## 技术实现

### 前端组件

#### `GeneratePracticeQuestions.jsx`
- 位置：`frontend/src/components/dashboard/`
- 功能：
  - 显示学生选择的HSC科目
  - 提供"Start Practice Questions"按钮
  - 显示生成统计信息
  - 错误和成功消息提示

### 后端API

#### 端点1: 生成练习题
- **路径**: `POST /api/student/practice-questions/generate`
- **认证**: 需要学生角色JWT token
- **功能**:
  1. 获取学生选择的科目（从`selected_subjects`表）
  2. 为每个科目生成练习题（使用OpenAI）
  3. 创建一个特殊的"practice"类型的assignment
  4. 将题目保存到`assignment_questions`表
  5. 如果是多选题，保存选项到`assignment_question_options`表
- **响应**:
```json
{
  "success": true,
  "message": "Practice questions generated successfully",
  "assignmentId": "uuid",
  "questionsGenerated": 9,
  "subjects": ["Mathematics Advanced", "English Standard", "Physics"],
  "totalPoints": 90
}
```

#### 端点2: 获取统计信息
- **路径**: `GET /api/student/practice-questions/stats`
- **认证**: 需要学生角色JWT token
- **响应**:
```json
{
  "totalGenerated": 3,
  "lastGenerated": "2025-11-02T10:30:00Z"
}
```

### 数据库结构

#### `assignment_questions` 表
新增字段用于标注科目：
- `subject` (TEXT): 科目名称，例如 "Mathematics Advanced"
- `subject_code` (VARCHAR): 科目代码，例如 "MATH-ADV"

题目结构：
```sql
{
  id: UUID,
  assignment_id: UUID,
  position: INT,
  type: 'multiple_choice' | 'short_answer' | 'text',
  question: TEXT,
  points: INT,
  subject: TEXT,           -- 新增：科目名称
  subject_code: VARCHAR    -- 新增：科目代码
}
```

#### `assignment_question_options` 表
用于存储多选题选项：
```sql
{
  id: UUID,
  question_id: UUID,
  option_text: TEXT,
  is_correct: BOOLEAN
}
```

## AI生成逻辑

### OpenAI Prompt
- 使用`assignment-generation-instruction.md`作为系统提示
- 为每个科目生成3道题目
- 难度级别：medium
- 题目类型：practice

### 生成参数
```javascript
{
  subject: "科目名称",
  topic: "General Practice",
  difficulty: "medium",
  assignment_type: "practice",
  question_count: 3
}
```

## 用户流程

1. **选择HSC科目**
   - 学生在"HSC Subjects"页面选择科目
   - 科目保存到`selected_subjects`表

2. **生成练习题**
   - 前往"Grades"页面
   - 点击"Generate Practice Questions"标签
   - 查看已选择的科目
   - 点击"Start Practice Questions"按钮

3. **AI生成过程**
   - 系统为每个科目调用OpenAI API
   - 生成多道练习题
   - 自动标注科目信息
   - 保存到数据库

4. **完成**
   - 显示成功消息
   - 更新统计信息
   - 题目可用于练习

## 样式设计

### 主题色
- 按钮：绿色渐变 (#48bb78 → #38a169)
- 科目卡片：紫色强调 (#667eea)
- 错误提示：红色 (#fc8181)
- 成功提示：绿色 (#68d391)

### 响应式设计
- 桌面端：3列网格布局
- 平板端：2列网格布局
- 移动端：单列布局

## 文件清单

### 新增文件
1. `frontend/src/components/dashboard/GeneratePracticeQuestions.jsx` - 前端组件
2. `backend/controllers/student/practiceQuestions.js` - 后端控制器

### 修改文件
1. `frontend/src/components/dashboard/GradesView.jsx` - 添加新标签页
2. `frontend/src/services/studentApi.js` - 添加API调用
3. `backend/routes/student.js` - 添加路由
4. `frontend/src/pages/StudentDashboard.css` - 添加样式

## 数据库迁移（如需要）

如果`assignment_questions`表中没有`subject`和`subject_code`字段，运行以下SQL：

```sql
-- 添加科目字段到 assignment_questions 表
ALTER TABLE assignment_questions 
ADD COLUMN IF NOT EXISTS subject TEXT,
ADD COLUMN IF NOT EXISTS subject_code VARCHAR(50);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_assignment_questions_subject 
ON assignment_questions(subject);

CREATE INDEX IF NOT EXISTS idx_assignment_questions_subject_code 
ON assignment_questions(subject_code);
```

## 测试步骤

### 1. 准备测试环境
- 确保OpenAI API密钥已配置
- 确保学生账号已创建
- 确保`selected_subjects`表有数据

### 2. 功能测试
```bash
# 1. 登录为学生账号
# 2. 前往HSC Subjects页面，选择几个科目
# 3. 前往Grades页面
# 4. 点击"Generate Practice Questions"标签
# 5. 点击"Start Practice Questions"按钮
# 6. 等待生成完成（可能需要10-30秒）
# 7. 检查成功消息
# 8. 验证统计信息是否更新
```

### 3. 数据库验证
```sql
-- 检查生成的assignment
SELECT * FROM assignments 
WHERE assignment_type = 'practice' 
ORDER BY created_at DESC;

-- 检查生成的题目
SELECT * FROM assignment_questions 
WHERE assignment_id = 'YOUR_ASSIGNMENT_ID'
ORDER BY position;

-- 检查多选题选项
SELECT * FROM assignment_question_options 
WHERE question_id IN (
  SELECT id FROM assignment_questions 
  WHERE assignment_id = 'YOUR_ASSIGNMENT_ID'
);
```

## 错误处理

### 常见错误

1. **没有选择科目**
   - 错误消息："No HSC subjects selected. Please select subjects first."
   - 解决方案：引导学生前往HSC Subjects页面

2. **OpenAI API失败**
   - 错误消息："Failed to generate practice questions"
   - 解决方案：检查API密钥、网络连接、API配额

3. **数据库错误**
   - 错误消息：相关的数据库错误信息
   - 解决方案：检查数据库连接、表结构、权限

## 未来改进

1. **题目难度选择**
   - 让学生选择题目难度（easy/medium/hard）

2. **题目数量自定义**
   - 让学生选择每个科目生成多少题目

3. **题目类型选择**
   - 让学生选择生成哪些类型的题目

4. **练习历史**
   - 显示之前生成的练习题集
   - 允许重新练习

5. **进度跟踪**
   - 跟踪学生答题进度
   - 显示正确率统计

## 维护注意事项

1. **OpenAI成本**
   - 每次生成会调用多次OpenAI API
   - 建议设置使用限制或冷却时间

2. **数据库大小**
   - 练习题会持续增长
   - 考虑定期清理旧的练习题

3. **性能优化**
   - 生成过程可能较慢
   - 考虑添加队列系统或后台任务

## 支持

如有问题，请参考：
- `backend/instructions/assignment-generation-instruction.md` - AI生成指令
- Supabase文档 - 数据库操作
- OpenAI文档 - API使用

---

**创建日期**: 2025-11-02
**作者**: AI Assistant
**版本**: 1.0.0

