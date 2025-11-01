# 📚 教师端评分和AI功能指南

## 🎯 功能概述

本指南介绍教师端的**评分功能**和**AI辅助功能**。

---

## ✅ 已启用的功能

### 1. 手动评分 ✅
教师可以手动为学生作业打分并提供反馈。

### 2. AI 自动评分 ✨ NEW
AI 自动分析学生提交并建议成绩和反馈。

### 3. AI 班级分析 ✨ NEW  
AI 分析班级表现并提供洞察和建议。

---

## 📝 使用流程

### 一、手动评分流程

#### 步骤 1: 进入作业列表
1. 登录教师账号
2. 点击左侧菜单 **"Assignments"**
3. 查看所有已发布的作业

#### 步骤 2: 选择作业进行评分
1. 找到有学生提交的作业
2. 点击作业卡片右下角的 **"Grade"** 按钮
3. 进入评分界面

#### 步骤 3: 选择学生提交
- 左侧显示所有学生的提交列表
- 点击学生名称查看其提交内容
- 状态标识：
  - 🟡 **Pending** - 待评分
  - 🟢 **Graded** - 已评分

#### 步骤 4: 输入成绩和反馈
1. **成绩输入框**: 输入 0-100 的分数（根据作业总分）
2. **反馈文本框**: 为学生提供详细的反馈评语
3. 点击 **"Save Grade"** 保存

#### 步骤 5: 批量评分
- 保存后自动跳转到下一个学生
- 重复步骤4，完成所有学生的评分

---

### 二、AI 自动评分功能 ✨

#### 什么是 AI 自动评分？
AI 会自动分析学生的提交内容，并根据：
- 作业要求
- 评分标准（Rubric）
- 答案质量

生成建议成绩和反馈。

#### 如何使用？

##### 步骤 1: 进入评分界面
按照上面的"手动评分流程"进入评分界面

##### 步骤 2: 选择学生提交
选择要用 AI 评分的学生提交

##### 步骤 3: 点击 AI 自动评分按钮
在提交内容上方找到：
```
✨ AI Auto-Grade
```
按钮并点击

##### 步骤 4: 确认使用 AI
系统会弹出确认对话框：
> Use AI to automatically grade this submission? You can review and modify the grade before saving.

点击 **"确定"** 继续

##### 步骤 5: 等待 AI 分析
- 按钮显示 "AI Grading..."
- AI 正在分析学生提交
- 通常需要 3-5 秒

##### 步骤 6: 审查 AI 建议
AI 完成后会弹出提示：
```
AI Grading Complete!
Suggested Grade: 85

Please review and save if you agree.
```

- **成绩输入框** 自动填入 AI 建议的分数
- **反馈文本框** 自动填入 AI 生成的反馈
- **你可以修改**成绩和反馈

##### 步骤 7: 保存或修改
1. 如果同意 AI 的建议 → 直接点击 **"Save Grade"**
2. 如果不同意 → 修改成绩和反馈后再保存

---

### 三、AI 班级分析功能 ✨

#### 什么是 AI 班级分析？
AI 分析整个班级的表现数据，提供：
- ✅ **关键洞察** (Key Insights)
- 💡 **教学建议** (Recommendations)  
- ⚠️ **需要关注的问题** (Concerns)

#### 如何使用？

##### 步骤 1: 进入分析页面
1. 登录教师账号
2. 点击左侧菜单 **"Analytics"**

##### 步骤 2: 选择班级
在页面顶部下拉菜单中：
- 选择具体的班级（不能选 "All Classes"）

##### 步骤 3: 生成 AI 洞察
点击 **"✨ Generate AI Insights"** 按钮

##### 步骤 4: 查看分析结果
AI 会显示：

**🔍 Key Insights (关键洞察):**
- 班级平均成绩趋势
- 学生表现分布
- 需要关注的学生

**💡 Recommendations (建议):**
- 针对性的教学建议
- 需要加强的知识点
- 改进教学的策略

**⚠️ Areas of Concern (关注点):**
- 成绩下降的学生
- 低完成率的作业
- 需要额外帮助的领域

**📊 Statistics:**
- Class Average: 85%
- Total Submissions: 120

---

## 🔧 API 端点说明

### 评分相关 API

#### 1. 获取作业的所有提交
```http
GET /api/teacher/assignments/:assignmentId/submissions
```

#### 2. 手动评分
```http
PUT /api/teacher/assignments/:assignmentId/submissions/:submissionId/grade
Content-Type: application/json

{
  "grade": 85,
  "feedback": "Great work! Keep it up."
}
```

### AI 功能 API

#### 1. AI 自动评分
```http
POST /api/teacher/ai/auto-grade
Content-Type: application/json

{
  "submission_id": "uuid",
  "assignment_id": "uuid"
}
```

**响应示例：**
```json
{
  "grade": 85,
  "feedback": "Strong submission demonstrating solid understanding. Minor improvements needed in problem 3.",
  "ai_generated": true,
  "mock": false
}
```

#### 2. AI 班级分析
```http
POST /api/teacher/ai/analyze-class
Content-Type: application/json

{
  "class_id": "uuid"
}
```

**响应示例：**
```json
{
  "insights": [
    "Class average has improved by 5% this month",
    "85% of students are performing above expectations"
  ],
  "recommendations": [
    "Focus on integration techniques - 30% of students struggling",
    "Consider review session before midterm"
  ],
  "concerns": [
    "3 students have not submitted last 2 assignments",
    "Average score on Problem Set 5 was only 65%"
  ],
  "class_average": 88,
  "total_submissions": 120
}
```

#### 3. AI 生成评分标准 (Rubric)
```http
POST /api/teacher/ai/generate-rubric
Content-Type: application/json

{
  "assignment_title": "Calculus Problem Set",
  "assignment_description": "Integration techniques",
  "total_points": 100
}
```

#### 4. AI 内容摘要
```http
POST /api/teacher/ai/summarize
Content-Type: application/json

{
  "content": "Long student essay...",
  "content_type": "essay"
}
```

---

## 🎨 界面说明

### 评分界面布局

```
┌─────────────────────────────────────────────────────┐
│  ← Back to Assignments                              │
│  Assignment: Calculus Problem Set 5                 │
│  Total: 20 | Graded: 15 | Pending: 5                │
├──────────────┬──────────────────────────────────────┤
│ SUBMISSIONS  │  GRADING PANEL                       │
│              │                                       │
│ 👤 Student 1 │  Student 1's Submission              │
│    [Pending] │  Submitted Oct 15, 2025              │
│              │                                       │
│ 👤 Student 2 │  ✨ AI Auto-Grade                     │
│    [Graded]  │  (AI will suggest grade & feedback)  │
│              │                                       │
│ 👤 Student 3 │  ─────────────────────────           │
│    [Pending] │  Submission Content:                 │
│              │  [Student's work...]                 │
│              │  ─────────────────────────           │
│              │                                       │
│              │  Grade (out of 100): [  85  ]        │
│              │                                       │
│              │  Feedback:                           │
│              │  ┌───────────────────────┐           │
│              │  │ Great work! Keep it up│           │
│              │  └───────────────────────┘           │
│              │                                       │
│              │  [Save Grade]                        │
└──────────────┴──────────────────────────────────────┘
```

---

## 💡 最佳实践

### 评分建议
1. **及时评分** - 学生提交后尽快评分，保持反馈及时性
2. **详细反馈** - 提供具体、建设性的反馈
3. **一致性** - 对所有学生使用统一的评分标准

### AI 使用建议
1. **AI 是辅助工具** - 始终审查 AI 的建议，不要盲目接受
2. **适合大批量** - AI 评分特别适合大量相似作业
3. **结合人工判断** - 复杂的开放性问题仍需要人工判断

### 班级分析建议
1. **定期生成** - 每周/每月生成一次班级分析
2. **跟踪趋势** - 对比不同时期的分析结果
3. **采取行动** - 根据 AI 建议制定改进计划

---

## ⚙️ 配置要求

### 环境变量
确保后端配置了 OpenAI API Key：

```bash
# backend/.env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
```

### 数据库权限
确保教师可以：
- 读取学生提交: `assignment_submissions`
- 更新成绩: `grade`, `feedback`, `graded_at`
- 读取班级数据: `classes`, `enrollments`

---

## 🐛 常见问题

### Q: AI Auto-Grade 按钮是灰色的？
**A:** 可能原因：
1. 没有选择学生提交
2. OPENAI_API_KEY 未配置
3. 网络连接问题

### Q: AI 评分总是失败？
**A:** 检查：
1. 后端日志中的错误信息
2. OpenAI API key 是否有效
3. 是否有 API 额度

### Q: AI 建议的成绩不合理？
**A:** 
- AI 只是建议，你可以修改
- 确保作业有清晰的评分标准
- 复杂作业建议人工评分

### Q: 保存成绩后学生看不到？
**A:** 检查：
1. 是否成功保存（查看提示）
2. 学生端是否刷新页面
3. 数据库权限是否正确

---

## 📊 功能对比

| 功能 | 手动评分 | AI 评分 |
|------|----------|---------|
| **速度** | 慢 | 快 (3-5秒/份) |
| **准确性** | 高 | 中等（需审查） |
| **适用场景** | 所有作业 | 标准化作业 |
| **反馈质量** | 个性化 | 通用性 |
| **成本** | 时间 | API 费用 |

---

## 🔄 更新日志

**v1.0.0** (2025-10-29)
- ✅ 实现手动评分功能
- ✅ 启用 AI 自动评分
- ✅ 启用 AI 班级分析
- ✅ 连接后端 AI API
- ✅ 添加 AI 功能到前端 UI

---

## 📚 相关文档

- [教师 API 完整文档](backend/TEACHER_API.md)
- [教师快速开始](backend/TEACHER_QUICKSTART.md)
- [AI Features 后端实现](backend/controllers/teacher/aiFeatures.js)

---

**完成日期**: 2025-10-29  
**版本**: 1.0.0

