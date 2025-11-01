# Mock Data Removal Summary

## 完成时间
2025-11-01

## 问题
Vite开发服务器无法启动，因为多个文件引用了已删除的mock data文件：
- `frontend/src/mockData/mock-career-pathway-res.json`
- `frontend/src/mockData/mock-HSC-subject-recommendation.json`
- `frontend/src/components/dashboard/mockData.js`

## 解决方案
移除所有mock data引用，改为使用Supabase真实数据或空初始状态。

## 修改的文件

### 1. 新建文件
- ✅ `frontend/src/utils/helpers.js` - 创建工具函数库
  - `getDaysUntilDue()` - 计算距离截止日期的天数
  - `formatDate()` - 格式化日期
  - `calculateGradeAverage()` - 计算平均成绩

### 2. Services (服务层)
- ✅ `frontend/src/services/careerService.js`
  - 移除 `mock-career-pathway-res.json` 导入
  - 移除 `useMockData` 参数
  - 移除fallback到mock data的逻辑
  - 只使用真实API调用

- ✅ `frontend/src/services/courseService.js`
  - 移除 `mock-HSC-subject-recommendation.json` 导入
  - 移除 `useMockData` 参数
  - 移除fallback到mock data的逻辑
  - 只使用真实API调用

### 3. Components (组件层)

#### 简单组件（只使用工具函数）
- ✅ `frontend/src/components/dashboard/DashboardOverview.jsx`
  - 从 `./mockData` 改为 `../../utils/helpers` 导入 `getDaysUntilDue`

- ✅ `frontend/src/components/dashboard/AssignmentsView.jsx`
  - 从 `./mockData` 改为 `../../utils/helpers` 导入 `getDaysUntilDue`

- ✅ `frontend/src/components/dashboard/AssignmentDetailPage.jsx`
  - 从 `./mockData` 改为 `../../utils/helpers` 导入 `getDaysUntilDue`

#### 复杂组件（需要数据管理）
- ✅ `frontend/src/components/dashboard/HSCSubjectsView.jsx`
  - 移除所有mockData导入和函数调用
  - 添加useState管理HSC科目数据
  - 添加useEffect钩子准备API调用
  - 实现本地的 `addSubjectToPlan` 和 `removeSubjectFromPlan` 逻辑
  - 实现本地的 `getPlanWarnings` 逻辑

- ✅ `frontend/src/components/dashboard/WeeklyReportView.jsx`
  - 移除所有mockData导入
  - 添加useState管理报告数据
  - 修改 `generateReport` 函数使用空初始数据结构
  - 添加TODO注释标记需要API集成的位置

- ✅ `frontend/src/components/dashboard/ReviewIncorrectQuestions.jsx`
  - 移除所有mockData导入和函数调用
  - 添加useState管理问题数据
  - 添加useEffect钩子准备API调用
  - 实现本地的问题更新逻辑
  - 修复统计数据管理

- ✅ `frontend/src/components/dashboard/ComparePlans.jsx`
  - 移除所有mockData导入
  - 添加useState管理学习计划数据
  - 添加useEffect钩子准备API调用
  - 实现本地的 `calculatePlanMetrics` 函数
  - 实现本地的 `getPlanDifferences` 函数
  - 添加空数据状态处理

### 4. Pages (页面层)
- ✅ `frontend/src/pages/StudentDashboard.jsx`
  - 移除所有mockData导入
  - 添加多个useState管理各类数据：
    - `studentData`
    - `enrolledClasses`
    - `upcomingAssignments`
    - `recentGrades`
    - `studyPlanSuggestions`
    - `careerRecommendations`
  - 数据初始化为空数组/对象

## 数据流改变

### 之前（使用Mock Data）
```
mockData.js → Components → UI
```

### 之后（使用Supabase）
```
Supabase API → State Management → Components → UI
```

## 后续集成任务（TODOs）

所有需要API集成的位置都已用TODO注释标记：

1. **StudentDashboard.jsx**
   - 需要添加API调用获取学生数据、课程、作业、成绩等

2. **HSCSubjectsView.jsx**
   - `TODO: Replace with actual API call to fetch HSC subjects from Supabase`

3. **WeeklyReportView.jsx**
   - `TODO: Replace with actual API call to fetch weekly study data from Supabase`

4. **ReviewIncorrectQuestions.jsx**
   - `TODO: Load incorrect questions from Supabase API`
   - `TODO: Update question review status in Supabase`

5. **ComparePlans.jsx**
   - `TODO: Load study plans from Supabase API`

## 验证

运行以下命令验证没有mockData引用：
```bash
# 在frontend目录下
grep -r "mockData" src/
```

应该返回空结果（除了这个文档）。

## 测试步骤

1. 停止当前的Vite开发服务器（如果运行中）
2. 重新启动：
   ```bash
   cd frontend
   npm run dev
   ```
3. Vite应该正常启动，不再有导入错误
4. 访问 `http://localhost:5173/`
5. 各个页面应该可以加载（显示空数据状态）

## 注意事项

1. ✅ 所有mock data引用已完全移除
2. ✅ 组件不会因为缺少数据而崩溃（使用空数组/对象初始化）
3. ✅ 工具函数已提取到独立文件，可复用
4. ⚠️ 需要后续集成真实的Supabase API调用
5. ⚠️ 目前页面会显示空数据状态，需要API集成后才能显示真实数据

## 影响范围

- ❌ 不影响后端代码
- ✅ 只影响前端组件和服务
- ✅ 所有改动向后兼容
- ✅ API接口保持不变

## 成功标准

✅ Vite开发服务器可以正常启动
✅ 没有导入错误
✅ 页面可以正常加载（即使数据为空）
✅ 没有运行时错误
✅ 为API集成做好准备

