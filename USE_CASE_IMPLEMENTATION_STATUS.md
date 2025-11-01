# 📋 Use Case 实现状态检查表

## 概述
这个文档对照12个Use Cases检查当前代码的实现状态。

---

## ✅ 已完成的Use Cases

### ✅ Use Case 1: AI Recommends HSC Subjects (Leyu Qian)
**状态**: **已完成 (100%)** ✅

**已完成**:
- ✅ 后端API: `POST /api/ai-agent/course-recommendation`
- ✅ Controller: `backend/controllers/course.js`
- ✅ AI Instruction: `backend/instructions/course-recommendation-instruction.md`
- ✅ 前端UI: `frontend/src/components/dashboard/HSCSubjectRecommendation.jsx`
- ✅ 输入表单（interests）
- ✅ AI 推荐结果显示
- ✅ Reasoning 高亮显示
- ✅ Loading 和 Error 处理
- ✅ 科目浏览: `HSCSubjectsView.jsx`

**文件位置**:
```
backend/controllers/course.js
backend/instructions/course-recommendation-instruction.md
frontend/src/components/dashboard/HSCSubjectRecommendation.jsx (AI推荐)
frontend/src/components/dashboard/HSCSubjectsView.jsx (科目浏览)
frontend/src/services/courseService.js
```

---

### ✅ Use Case 4: AI Grades and Explains Answers (Leyu Qian)
**状态**: **已实现 (90%)**

**已完成**:
- ✅ 后端API: `POST /api/teacher/ai/auto-grade`
- ✅ Controller: `backend/controllers/teacher/aiFeatures.js → autoGradeSubmission()`
- ✅ 前端UI: `frontend/src/components/teacher/GradeAssignmentView.jsx`
- ✅ 按钮: "✨ AI Auto-Grade"

**缺少**:
- ❌ 学生端看不到AI的详细解释步骤
- ❌ 没有"step-by-step explanations"的UI展示

**文件位置**:
```
backend/controllers/teacher/aiFeatures.js (lines 211-375)
frontend/src/components/teacher/GradeAssignmentView.jsx (lines 87-115)
```

---

### ✅ Use Case 7: AI-Based Class Performance Analysis (Ziqi Liu)
**状态**: **已实现 (85%)**

**已完成**:
- ✅ 后端API: `POST /api/teacher/ai/analyze-class`
- ✅ Controller: `backend/controllers/teacher/aiFeatures.js → analyzeClassPerformance()`
- ✅ 前端UI: `frontend/src/components/teacher/AnalyticsView.jsx`
- ✅ 按钮: "✨ Generate AI Insights"
- ✅ 显示insights, recommendations, concerns

**缺少**:
- ❌ 没有"下载报告"功能
- ❌ 没有"添加到lesson plan"功能

**文件位置**:
```
backend/controllers/teacher/aiFeatures.js (lines 380-505)
frontend/src/components/teacher/AnalyticsView.jsx (lines 11-28, 81-123)
```

---

### ✅ Use Case 9: AI-Driven Career Pathway Recommendation (Ziqi Liu)
**状态**: **已实现 (95%)**

**已完成**:
- ✅ 后端API: `POST /api/ai-agent/career-pathway`
- ✅ Controller: `backend/controllers/career.js`
- ✅ AI Instruction: `backend/instructions/career-pathway-instruction.md`
- ✅ 前端UI: `frontend/src/components/dashboard/CareerView.jsx`
- ✅ 输入表单: interests, strengths, goals
- ✅ 显示career pathways, salary, job growth

**缺少**:
- ❌ 没有"course selection suggestions"基于career的映射

**文件位置**:
```
backend/controllers/career.js
backend/instructions/career-pathway-instruction.md
frontend/src/components/dashboard/CareerView.jsx (lines 27-38)
```

---

### ✅ Use Case 10: AI-Generated Assessment Rubric (Ning Bao)
**状态**: **已实现 (70%)**

**已完成**:
- ✅ 后端API: `POST /api/teacher/ai/generate-rubric`
- ✅ Controller: `backend/controllers/teacher/aiFeatures.js → generateRubric()`
- ✅ Mock和真实AI两种模式

**缺少**:
- ❌ 前端UI没有"Generate rubric with AI"按钮
- ❌ 创建作业时没有集成这个功能
- ❌ 没有rubric预览和编辑界面
- ❌ 没有version history

**文件位置**:
```
backend/controllers/teacher/aiFeatures.js (lines 11-129)
frontend/src/components/teacher/CreateAssignmentView.jsx (需要添加)
```

---

### ✅ Use Case 11: Content Summarisation (Ning Bao)
**状态**: **已实现 (60%)**

**已完成**:
- ✅ 后端API: `POST /api/teacher/ai/summarize`
- ✅ Controller: `backend/controllers/teacher/aiFeatures.js → summarizeContent()`

**缺少**:
- ❌ 没有文件上传功能
- ❌ 没有病毒扫描/安全检查
- ❌ 没有OCR/转录功能
- ❌ 前端UI完全缺失
- ❌ 没有支持多种文件类型

**文件位置**:
```
backend/controllers/teacher/aiFeatures.js (lines 135-206)
(前端UI完全缺失)
```

---

### ⚠️ Use Case 12: Privacy and Data Protection Management (Ning Bao)
**状态**: **部分实现 (50%)**

**已完成**:
- ✅ Row Level Security (RLS) policies in database
- ✅ 基本的role-based access control
- ✅ JWT authentication
- ✅ 权限检查 middleware

**缺少**:
- ❌ 没有Consent Management（家长同意）
- ❌ 没有Audit Logging（审计日志）
- ❌ 没有Data Minimisation配置
- ❌ 没有Privacy Controls UI（隐私控制界面）
- ❌ 没有数据脱敏/假名化

**文件位置**:
```
backend/middleware/auth.js
db_scripts/init.sql (RLS policies)
db_scripts/policies.sql
```

---

## ❌ 未实现的Use Cases

### ❌ Use Case 2: Personalized Study Plan (Qiyue Chen)
**状态**: **未实现 (仅有UI mock)**

**现状**:
- ✅ 前端UI: `frontend/src/components/dashboard/StudyPlannerView.jsx`
- ✅ Mock数据: `mockData.js → studyPlanSuggestions`
- ❌ **没有后端API**
- ❌ **没有AI生成功能**
- ❌ **没有调整和保存功能**

**需要实现**:
```javascript
// 后端需要
POST /api/ai-agent/generate-study-plan
{
  "student_id": "uuid",
  "exam_dates": ["2025-11-15"],
  "available_hours": 20,
  "subjects": ["Math", "Physics"],
  "preferences": "visual learner"
}

// 返回
{
  "study_plan": [
    {
      "subject": "Mathematics",
      "topic": "Integration",
      "duration": "2 hours",
      "priority": "high",
      "reasoning": "..."
    }
  ]
}
```

**文件位置**:
```
frontend/src/components/dashboard/StudyPlannerView.jsx (仅UI)
frontend/src/components/dashboard/mockData.js (lines 835-915)
```

---

### ❌ Use Case 3: Generate Practice Questions (Qiyue Chen)
**状态**: **完全未实现**

**现状**:
- ❌ 没有任何相关代码
- ❌ 没有后端API
- ❌ 没有前端UI

**需要实现**:
```javascript
// 后端需要
POST /api/ai-agent/generate-questions
{
  "subject": "Mathematics",
  "topic": "Calculus",
  "difficulty": "medium",
  "count": 10,
  "question_type": "multiple-choice"
}

// 返回
{
  "questions": [
    {
      "id": 1,
      "question": "What is the derivative of x^2?",
      "options": ["2x", "x", "x^2", "2"],
      "correct_answer": "2x",
      "explanation": "Using power rule..."
    }
  ]
}
```

**需要创建的文件**:
```
backend/controllers/student/practiceQuestions.js (新建)
backend/instructions/practice-questions-instruction.md (新建)
frontend/src/components/dashboard/PracticeQuestionsView.jsx (新建)
```

---

### ❌ Use Case 5: AI Study Motivation Detector (Leyu Qian)
**状态**: **完全未实现**

**现状**:
- ❌ 没有任何相关代码
- ❌ 没有学习行为监控
- ❌ 没有通知系统

**需要实现**:
```javascript
// 后端需要
1. 监控系统
   - 跟踪学习时间
   - 记录quiz结果
   - 分析聊天情绪

2. 检测系统
POST /api/ai-agent/detect-motivation
{
  "student_id": "uuid",
  "recent_activity": {...},
  "sentiment": "stressed"
}

3. 通知系统
POST /api/notifications/send
{
  "user_id": "uuid",
  "type": "motivation",
  "message": "Great streak! Keep it up!"
}
```

**需要创建的文件**:
```
backend/controllers/student/motivation.js (新建)
backend/services/notificationService.js (新建)
backend/utils/behaviorAnalyzer.js (新建)
```

---

### ❌ Use Case 6: Identify Knowledge Gaps (Qiyue Chen)
**状态**: **未实现 (仅有UI mock)**

**现状**:
- ✅ 前端UI: `frontend/src/components/dashboard/ReviewIncorrectQuestions.jsx`
- ✅ Mock数据: `mockData.js → incorrectQuestions`
- ❌ **没有后端AI分析**
- ❌ **没有真实的知识图谱**

**需要实现**:
```javascript
// 后端需要
POST /api/ai-agent/analyze-knowledge-gaps
{
  "student_id": "uuid",
  "performance_data": [
    {
      "subject": "Math",
      "topic": "Calculus",
      "scores": [65, 70, 68]
    }
  ]
}

// 返回
{
  "knowledge_gaps": [
    {
      "subject": "Mathematics",
      "topic": "Integration Techniques",
      "weakness_level": "high",
      "evidence": "Failed 3/5 questions on substitution",
      "recommendation": "Review Chapter 5 sections 5.1-5.3"
    }
  ],
  "overall_analysis": "..."
}
```

**文件位置**:
```
frontend/src/components/dashboard/ReviewIncorrectQuestions.jsx (仅UI)
frontend/src/components/dashboard/mockData.js (lines 1917-2014)
```

---

### ❌ Use Case 8: Automated Weekly Progress Report for Parents (Ziqi Liu)
**状态**: **未实现 (仅有学生端周报mock)**

**现状**:
- ✅ 学生端周报UI: `frontend/src/components/dashboard/WeeklyReportView.jsx`
- ✅ Mock数据生成: `mockData.js → generateWeeklyReport()`
- ❌ **没有家长Portal**
- ❌ **没有家长-学生绑定**
- ❌ **没有AI生成功能**
- ❌ **没有自动发送机制**

**需要实现**:
```javascript
// 1. 家长Portal
frontend/src/pages/ParentDashboard.jsx (新建)
frontend/src/pages/ParentLogin.jsx (新建)

// 2. 后端API
POST /api/parent/weekly-report/generate
{
  "student_id": "uuid",
  "week_start": "2025-10-20",
  "week_end": "2025-10-26"
}

// 3. 定时任务
backend/jobs/weeklyReportScheduler.js (新建)
```

**文件位置**:
```
frontend/src/components/dashboard/WeeklyReportView.jsx (学生端)
frontend/src/components/dashboard/mockData.js (lines 1899-1914)
(家长Portal完全缺失)
```

---

## 📊 总体实现统计

| Use Case | 负责人 | 状态 | 完成度 | 优先级 |
|----------|--------|------|--------|--------|
| UC1: AI Recommends HSC Subjects | Leyu Qian | ✅ 已实现 | 100% | ✅ 完成 |
| UC2: Personalized Study Plan | Qiyue Chen | ❌ 未实现 | 20% | 🔴 高 |
| UC3: Generate Practice Questions | Qiyue Chen | ❌ 未实现 | 0% | 🟡 中 |
| UC4: AI Grades and Explains | Leyu Qian | ✅ 已实现 | 90% | ✅ 完成 |
| UC5: AI Motivation Detector | Leyu Qian | ❌ 未实现 | 0% | 🟢 低 |
| UC6: Identify Knowledge Gaps | Qiyue Chen | ❌ 未实现 | 15% | 🟡 中 |
| UC7: Class Performance Analysis | Ziqi Liu | ✅ 已实现 | 85% | ✅ 完成 |
| UC8: Weekly Report for Parents | Ziqi Liu | ❌ 未实现 | 10% | 🟢 低 |
| UC9: Career Pathway Recommendation | Ziqi Liu | ✅ 已实现 | 95% | ✅ 完成 |
| UC10: AI-Generated Rubric | Ning Bao | ⚠️ 部分实现 | 70% | 🟡 中 |
| UC11: Content Summarisation | Ning Bao | ⚠️ 部分实现 | 60% | 🟡 中 |
| UC12: Privacy & Data Protection | Ning Bao | ⚠️ 部分实现 | 50% | 🟡 中 |

**总体完成度**: **56%** (6.75/12)

---

## 🎯 优先级建议

### 🔴 高优先级（必须完成）

#### 1. **UC1: 完善HSC科目推荐** (需要2-3小时)
- [ ] 添加个人资料输入表单
- [ ] 连接course recommendation API到前端
- [ ] 显示AI推荐结果

#### 2. **UC2: 实现学习计划生成** (需要4-5小时)
- [ ] 创建后端API controller
- [ ] 创建AI instruction文件
- [ ] 连接前端StudyPlannerView到真实API
- [ ] 实现保存和调整功能

### 🟡 中优先级（建议完成）

#### 3. **UC10: 完善Rubric生成UI** (需要2-3小时)
- [ ] 在CreateAssignmentView添加"Generate Rubric"按钮
- [ ] 实现rubric预览和编辑
- [ ] 添加保存功能

#### 4. **UC6: 实现知识缺陷分析** (需要3-4小时)
- [ ] 创建后端AI分析API
- [ ] 连接ReviewIncorrectQuestions到真实API
- [ ] 生成可视化报告

#### 5. **UC11: 完善内容摘要功能** (需要3-4小时)
- [ ] 添加文件上传UI
- [ ] 实现文件处理（PDF, 图片, 音视频）
- [ ] 显示摘要结果

### 🟢 低优先级（可选）

#### 6. **UC3: 练习题生成** (需要5-6小时)
- 全新功能，工作量大

#### 7. **UC5: 学习激励检测** (需要6-8小时)
- 需要行为监控系统，工作量大

#### 8. **UC8: 家长周报** (需要8-10小时)
- 需要家长Portal，工作量非常大

---

## 📝 快速实现指南

### 方案1: 快速补全高优先级功能 (推荐)

**时间估算**: 8-10小时

**实现步骤**:
1. ✅ UC4 - 已完成
2. ✅ UC7 - 已完成  
3. ✅ UC9 - 已完成
4. ⚠️ UC1 - 补全前端集成 (2小时)
5. ❌ UC2 - 实现后端API (4小时)
6. ⚠️ UC10 - 补全前端UI (2小时)

### 方案2: 展示最完整的功能

**重点完善**:
- UC4 (AI评分) - 添加学生端查看详细解释
- UC7 (班级分析) - 添加下载报告功能
- UC9 (职业路径) - 添加课程映射

**放弃**:
- UC3, UC5, UC8 (工作量太大)

---

## 📂 需要创建的新文件

```
后端:
backend/controllers/student/studyPlanner.js
backend/controllers/student/practiceQuestions.js
backend/controllers/student/knowledgeGaps.js
backend/controllers/parent/weeklyReport.js
backend/instructions/study-plan-instruction.md
backend/instructions/practice-questions-instruction.md
backend/instructions/knowledge-gaps-instruction.md

前端:
frontend/src/pages/ParentDashboard.jsx
frontend/src/pages/ParentLogin.jsx
frontend/src/components/dashboard/PracticeQuestionsView.jsx
frontend/src/components/parent/WeeklyReportView.jsx
```

---

**最后更新**: 2025-10-29  
**版本**: 1.0.0

