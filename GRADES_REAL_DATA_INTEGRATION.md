# 成绩页面真实数据集成总结

## 问题描述
学生端的 Grades 页面不显示 Supabase 数据库中的真实数据，原因是：
1. 后端没有专门的获取成绩的 API 路由
2. 前端 `studentApi.js` 中没有获取成绩的函数
3. `StudentDashboard.jsx` 中的 `recentGrades` 状态从未从 API 获取数据

## 修改时间
2025-11-02

## 修改的文件

### 1. 后端 (Backend)

#### 新建文件
**`backend/controllers/student/grades.js`**
- ✅ 创建 `getStudentGrades` 控制器函数
- ✅ 从 `class_grade_history` 表查询学生的所有成绩
- ✅ 连接 `classes` 表获取课程信息（名称、代码、颜色）
- ✅ 计算百分比和字母等级 (A/B/C/D/F)
- ✅ 转换数据格式为前端所需的格式：
  ```javascript
  {
    id: UUID,
    assignment: "作业名称",
    class: "课程名称",
    classCode: "课程代码",
    classColor: "#6366f1",
    score: 80,
    maxScore: 100,
    weight: 10,
    percentage: 80,
    grade: "B",
    date: "2025-11-02T...",
    classId: UUID
  }
  ```

#### 修改文件
**`backend/routes/student.js`**
- ✅ 导入 `getStudentGrades` 函数
- ✅ 添加新路由: `GET /api/student/grades`
- ✅ 应用认证中间件 (`verifyAuth` 和 `requireRole(['student'])`)

### 2. 前端 (Frontend)

#### 修改文件

**`frontend/src/services/studentApi.js`**
- ✅ 添加 `getGrades()` 函数
- ✅ 发送 GET 请求到 `/api/student/grades`
- ✅ 自动在请求头中包含 JWT token
- ✅ 返回成绩数据

**`frontend/src/pages/StudentDashboard.jsx`**
- ✅ 添加 `fetchStudentGrades()` 函数（使用 `useCallback` 优化）
- ✅ 调用 `studentApi.getGrades()` 获取真实数据
- ✅ 将数据存储到 `recentGrades` 状态
- ✅ 添加 `useEffect` 钩子：
  - 当切换到 `grades` 标签时自动获取数据
  - 当在 `dashboard` 标签时也获取数据（显示最近成绩）
- ✅ 错误处理：API 失败时保持空数组，不会导致页面崩溃

## API 端点详情

### GET /api/student/grades
**认证**: 需要 JWT Token (Student 角色)

**请求示例**:
```javascript
GET /api/student/grades
Headers: {
  Authorization: Bearer <JWT_TOKEN>
}
```

**响应示例**:
```json
{
  "success": true,
  "grades": [
    {
      "id": "uuid-1",
      "assignment": "Programming Assignment 1",
      "class": "Advanced Programming",
      "classCode": "COMP2041",
      "classColor": "#667eea",
      "score": 80,
      "maxScore": 100,
      "weight": 10,
      "percentage": 80,
      "grade": "B",
      "date": "2025-10-15T10:30:00.000Z",
      "classId": "class-uuid-1"
    }
  ]
}
```

## 数据库表结构

使用的表：
1. **`class_grade_history`** - 存储学生成绩记录
   - `id` (UUID)
   - `student_id` (UUID) - 关联到 profiles 表
   - `class_id` (UUID) - 关联到 classes 表
   - `assessment` (TEXT) - 作业/考试名称
   - `score` (INT4) - 获得分数
   - `max_score` (INT4) - 最高分数
   - `weight` (INT4) - 权重百分比
   - `created_at` (TIMESTAMPTZ) - 创建时间

2. **`classes`** - 课程信息
   - `id` (UUID)
   - `name` (TEXT) - 课程名称
   - `code` (TEXT) - 课程代码
   - `color` (TEXT) - 课程颜色

## 字母等级计算规则

```javascript
percentage >= 90 → A
percentage >= 80 → B
percentage >= 70 → C
percentage >= 60 → D
percentage < 60  → F
```

## 数据流

### 之前（使用Mock Data / 无数据）
```
空数组 [] → GradesView → 无数据显示
```

### 之后（使用Supabase真实数据）
```
Supabase (class_grade_history)
  ↓
Backend API (/api/student/grades)
  ↓
Frontend (studentApi.getGrades())
  ↓
State (recentGrades)
  ↓
Components (GradesView, DashboardOverview)
  ↓
UI (显示真实成绩)
```

## 组件更新

### 受影响的组件（无需修改，已支持真实数据）

1. **`GradesView.jsx`**
   - 接收 `recentGrades` props
   - 显示所有成绩的表格
   - 按评估名称、课程、分数、等级显示

2. **`DashboardOverview.jsx`**
   - 接收 `recentGrades` props
   - 在 Dashboard 显示最近的成绩
   - 提供 "View All" 按钮跳转到 Grades 页面

3. **`WeeklyReportView.jsx`**
   - 显示本周的成绩记录
   - 从 Weekly Report API 获取数据（独立于此次修改）

## 测试步骤

### 1. 确保数据库有测试数据

检查 `class_grade_history` 表是否有当前学生的成绩记录。

### 2. 启动后端服务器
```bash
cd backend
npm start
```

### 3. 启动前端开发服务器
```bash
cd frontend
npm run dev
```

### 4. 测试场景

#### 场景 1: Grades 页面
1. 以学生身份登录
2. 点击左侧菜单 "📈 Grades"
3. 应该看到：
   - "Grades Overview" 标签页
   - 显示所有成绩的表格
   - 每行显示：作业名称、课程、分数、等级、日期

#### 场景 2: Dashboard 页面
1. 在 Dashboard 主页
2. 滚动到 "Recent Grades" 部分
3. 应该看到：
   - 最近的成绩记录
   - 每行显示：作业名称、课程、分数、等级
   - "View All" 按钮跳转到 Grades 页面

#### 场景 3: 空数据处理
1. 使用没有成绩记录的学生账号登录
2. 页面应该正常显示，不会崩溃
3. 显示空表格或提示信息

## 错误处理

### 前端错误处理
```javascript
catch (error) {
  console.error('Failed to fetch student grades:', error)
  setRecentGrades([]) // 保持空数组，避免崩溃
}
```

### 后端错误处理
- 数据库查询失败 → 500 Internal Server Error
- 认证失败 → 401 Unauthorized
- 权限不足 → 403 Forbidden

## 日志输出

### 后端日志
```
[getStudentGrades] Fetching grades for student_id: <UUID>
[getStudentGrades] Found X grades for student <UUID>
```

### 前端日志
```
Making API request to: http://localhost:3000/api/student/grades
Response status: 200 OK
Response data: { success: true, grades: [...] }
```

## 性能考虑

1. **查询优化**
   - 使用 Supabase `.select()` 连接查询，一次请求获取所有数据
   - 按 `created_at` 降序排序，显示最新成绩在前

2. **前端优化**
   - 使用 `useCallback` 缓存 fetch 函数
   - 只在需要时获取数据（标签切换时）
   - 避免重复请求

## 安全性

1. **认证**
   - 所有请求需要有效的 JWT Token
   - Token 包含学生的 user_id

2. **授权**
   - 后端通过 `req.user.id` 获取当前学生 ID
   - 只查询当前学生的成绩，无法访问其他学生数据

3. **数据验证**
   - 前端验证 API 响应格式
   - 后端验证请求来源和权限

## 后续优化建议

1. **添加过滤功能**
   - 按课程筛选成绩
   - 按日期范围筛选
   - 按成绩等级筛选

2. **添加排序功能**
   - 按日期排序
   - 按分数排序
   - 按课程排序

3. **添加统计信息**
   - 总体 GPA 计算
   - 各课程平均分
   - 成绩趋势图表

4. **添加缓存**
   - 使用 React Query 或 SWR 缓存数据
   - 减少重复 API 请求
   - 实现自动刷新

5. **添加实时更新**
   - 使用 Supabase Realtime 订阅
   - 教师更新成绩后自动刷新学生页面

## 成功标准

✅ 后端 API 正常工作，返回学生成绩数据  
✅ 前端可以成功调用 API 并获取数据  
✅ Grades 页面显示真实的数据库数据  
✅ Dashboard 页面显示最近的成绩  
✅ 空数据情况下页面不崩溃  
✅ 错误处理正常工作  
✅ 认证和授权机制正常  
✅ 日志输出清晰，便于调试  

## 与之前 Mock Data 清理的关系

这次修改是继 `MOCK_DATA_REMOVAL_SUMMARY.md` 之后的**真实数据集成**工作：

- 之前：移除了 mock data，但 `recentGrades` 一直是空数组
- 现在：实现了完整的 API 调用链，从数据库获取真实数据

这完成了学生 Grades 功能的端到端真实数据集成。

