# 🧪 Study Plan功能测试指南

## ✅ 已修复的问题

1. **404错误** - 修复了API路径重复问题
2. **数据显示** - 添加了成功提示和详细日志
3. **空状态UI** - 添加了"No Study Plan Yet"占位符

---

## 🚀 测试步骤

### 1️⃣ **确认后端正在运行**
```bash
# 在 backend 目录
npm run dev
```
应该看到：
```
🚀 HSC Power Server is running on http://localhost:3000
```

### 2️⃣ **刷新前端页面**
- 按 `Ctrl + Shift + R` 强制刷新（清除缓存）

### 3️⃣ **登录系统**
- 使用student账户登录

### 4️⃣ **进入Study Planner**
- 点击左侧菜单 "Study Planner"
- 应该看到 "No Study Plan Yet" 的占位符

### 5️⃣ **生成Study Plan**
- 点击 **"✨ Generate New Plan"** 按钮
- 弹出配置模态框

### 6️⃣ **配置参数**
1. **选择科目**（至少选1个）：
   - 勾选 Mathematics
   - 勾选 Physics
   - 或其他科目

2. **设置学习时间**：
   - Available Hours per Week: 20（默认）

3. **设置学习偏好**（可选）：
   - Learning Style: Visual / Auditory / Kinesthetic
   - Preferred Study Time: Morning / Afternoon / Evening
   - Break Frequency: Every hour / Every 2 hours / Every 30 minutes

### 7️⃣ **点击生成**
- 点击 **"Generate Study Plan"** 按钮
- 等待生成（可能需要5-10秒）

### 8️⃣ **查看结果**
✅ **成功标志**：
- 弹出提示：`✅ AI generated X personalized study suggestions!`
- 模态框自动关闭
- 显示多个study suggestion卡片

### 9️⃣ **检查控制台日志**
按 `F12` 打开浏览器Console，应该看到：
```
📥 Received study plan response: {study_plan: Array(3), ai_generated: true, ...}
📊 Study plan data: [{id: "plan_1", subject: "Mathematics", ...}, ...]
📏 Study plan length: 3
Study plan set successfully: 3 items
```

### 🔟 **测试交互功能**
1. **点击 "▶ Why this recommendation?"** 
   - 查看AI推荐的详细解释（Explainability）

2. **点击 "📅 Add to Schedule"**
   - 添加项目到下方的Study Schedule
   - 应该看到成功提示
   - Schedule列表应该更新

3. **在Schedule中测试**：
   - ✅ **Mark Complete** - 标记完成
   - 🗑️ **Remove** - 删除项目

---

## 🔍 调试信息

### 如果看不到study plan卡片

**1. 检查浏览器Console**
- 按 `F12` → Console标签
- 查找错误信息或日志

**2. 检查Network**
- 按 `F12` → Network标签
- 点击 "Generate Study Plan"
- 查找 `/api/student/study-plan/generate` 请求
- 查看 Response:
  ```json
  {
    "study_plan": [...],
    "ai_generated": true,
    "mock": false
  }
  ```

**3. 常见问题**

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 404错误 | 后端未运行 | `cd backend && npm run dev` |
| 空数组返回 | 没有选择科目 | 至少选择1个科目 |
| Mock data | OpenAI API未配置 | 正常，会返回fallback数据 |
| 没有显示卡片 | State未更新 | 检查Console日志 |

---

## 📊 预期数据结构

### API响应格式
```json
{
  "study_plan": [
    {
      "id": "plan_1",
      "subject": "Mathematics",
      "topic": "Calculus Review",
      "duration": "2 hours",
      "priority": "high",
      "reason": "Recent test score of 72% suggests this needs attention",
      "profileEvidence": [
        "Recent average: 72%",
        "Based on last 3 assessments"
      ],
      "curriculumRules": [
        "Mathematics is a core HSC subject"
      ],
      "performanceData": [
        {
          "label": "Recent Average",
          "value": "72%",
          "color": "#ed8936"
        }
      ],
      "expectedOutcome": "Improve understanding and raise average to 80%+",
      "recommended_resources": [
        "Textbook chapters 5-7",
        "Khan Academy calculus course"
      ],
      "study_activities": [
        "Review derivatives (30 min)",
        "Practice problems (60 min)",
        "Review mistakes (30 min)"
      ]
    }
  ],
  "ai_generated": true,
  "mock": false
}
```

---

## ✨ 成功指标

✅ **功能完整性**
- [ ] 可以配置科目和参数
- [ ] 可以生成study plan
- [ ] 显示3-5个study suggestions
- [ ] 可以查看详细解释（Explainability）
- [ ] 可以添加到Schedule
- [ ] Schedule可以mark complete/remove

✅ **AI特性**
- [ ] 基于学生profile生成建议
- [ ] 显示推荐理由（profileEvidence, curriculumRules）
- [ ] 显示performance data
- [ ] 显示expected outcome
- [ ] 提供学习资源和活动建议

✅ **用户体验**
- [ ] 有loading状态
- [ ] 有错误提示
- [ ] 有成功提示
- [ ] UI响应流畅
- [ ] 空状态有友好提示

---

## 🎯 下一步

测试成功后，可以继续实现：
1. **UC3**: Interactive Learning Chatbot
2. **UC4**: AI-Generated Quizzes
3. **UC5**: Performance Analytics Dashboard

---

**祝测试顺利！** 🚀

如果遇到任何问题，查看浏览器Console并分享错误信息。

