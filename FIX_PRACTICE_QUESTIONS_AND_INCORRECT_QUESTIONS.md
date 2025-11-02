# 修复练习题和错题本功能

## 当前问题

1. **生成的单选题没有选项**
2. **incorrect_questions 数据集不被写入**

## 问题原因

### 问题1：单选题没有选项
- OpenAI 可能返回的数据格式不正确
- 选项字段名称可能不匹配

### 问题2：incorrect_questions 表结构不完整
你的表只有这些列：
- id, student_id, question_id, subject, topic, difficulty, correct_answer

但是代码需要更多列来正常工作。

## 修复步骤

### 第一步：修复 incorrect_questions 表结构

1. **登录 Supabase Dashboard**
   - 打开 https://supabase.com
   - 进入你的项目

2. **打开 SQL Editor**
   - 点击左侧菜单的 "SQL Editor"
   - 点击 "New Query"

3. **运行修复脚本**
   - 打开文件 `db_scripts/fix_incorrect_questions_table_complete.sql`
   - 复制全部内容
   - 粘贴到 SQL Editor
   - 点击 "Run" 按钮

4. **验证结果**
   - 查看输出消息，应该看到 "✅ Added xxx column" 的消息
   - 检查表结构是否包含所有需要的列

### 第二步：测试单选题选项生成

1. **重启后端服务**
   - 后端应该已经自动重启（nodemon）
   - 如果没有，手动重启：`Ctrl+C` 然后 `npm run dev`

2. **生成新的练习题**
   - 登录学生账号
   - 进入 "Practice Questions" 标签
   - 点击 "Generate Practice Questions" 按钮

3. **查看后端日志**
   - 在后端终端中，你应该看到：
   ```
   Question type: multiple_choice
   Question options: ["Option 1", "Option 2", "Option 3", "Option 4"]
   Inserting options: [...]
   Successfully inserted 4 options for question xxx
   ```

4. **如果看到 "Skipping options - not a multiple choice or no options provided"**
   - 说明 OpenAI 返回的数据格式有问题
   - 把后端日志截图发给我，我会继续调试

### 第三步：测试错题保存

1. **回答一道错误的题**
   - 选择一道练习题
   - 故意选择错误答案
   - 提交

2. **查看后端日志**
   - 应该看到：
   ```
   === Submit Practice Answer Debug ===
   Student ID: xxx
   Question ID: xxx
   Answer: xxx
   Correct: false
   Correct type: boolean
   ====================================
   Updating practice_questions with data: {...}
   Successfully updated practice_questions table
   Answer is incorrect, adding to incorrect_questions table...
   Attempting to insert into incorrect_questions with data: {...}
   Successfully added question to incorrect_questions table
   ```

3. **检查数据库**
   - 在 Supabase Dashboard 中打开 "Table Editor"
   - 查看 `incorrect_questions` 表
   - 应该能看到新插入的记录

4. **在前端查看**
   - 切换到 "Review Incorrect Questions" 标签
   - 应该能看到刚才答错的题目

## 如果还有问题

### 单选题没有选项
1. 复制后端生成题目时的完整日志
2. 特别是包含 "Question type:" 和 "Question options:" 的日志
3. 发给我分析

### 错题保存失败
1. 复制后端提交答案时的完整日志
2. 特别是包含 "Error inserting into incorrect_questions:" 的错误信息
3. 截图 Supabase 中 incorrect_questions 表的结构
4. 发给我分析

## 已添加的调试日志

### 生成题目时
- `Question type:` - 显示题目类型
- `Question options:` - 显示选项数组
- `Inserting options:` - 显示要插入的选项
- `Successfully inserted X options` - 插入成功
- `Skipping options` - 跳过插入（说明有问题）

### 提交答案时
- `=== Submit Practice Answer Debug ===` - 显示提交的数据
- `Updating practice_questions with data:` - 更新练习题
- `Successfully updated practice_questions table` - 更新成功
- `Attempting to insert into incorrect_questions` - 插入错题
- `Successfully added question to incorrect_questions table` - 插入成功

## 代码改动总结

### backend/controllers/student/practiceQuestions.js
- 添加了选项插入的调试日志
- 添加了 position 字段到选项

### backend/controllers/student/practiceAnswers.js
- 修改了 incorrect_questions 的插入数据，包含完整信息
- 添加了详细的调试日志

### db_scripts/fix_incorrect_questions_table_complete.sql
- 新建：用于修复 incorrect_questions 表结构的完整 SQL 脚本

