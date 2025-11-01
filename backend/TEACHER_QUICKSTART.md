# 教师端后端快速开始指南

## 📋 已完成的功能

### ✅ 核心功能模块

1. **班级管理** (`controllers/teacher/classes.js`)
   - 获取教师的所有班级
   - 查看班级详情
   - 查看班级学生名单
   - 班级表现分析

2. **作业管理** (`controllers/teacher/assignments.js`)
   - 创建、更新、删除作业
   - 发布作业
   - 查看作业列表和详情
   - 支持多种作业类型和问题格式

3. **提交和评分** (`controllers/teacher/submissions.js`)
   - 查看学生提交
   - 手动评分
   - 添加反馈
   - 评分统计摘要

4. **学生管理** (`controllers/teacher/students.js`)
   - 查看所有学生
   - 学生详情和行为报告
   - 学生在特定班级的表现追踪

5. **AI 功能** (`controllers/teacher/aiFeatures.js`)
   - **UC10**: AI生成评分标准 (rubric)
   - **UC11**: 内容摘要
   - **UC04**: 自动评分
   - **UC07**: AI分析班级表现

### 🗺️ API 路由结构

```
/api/teacher
├── /classes
│   ├── GET  /                          # 获取所有班级
│   ├── GET  /:classId                  # 班级详情
│   ├── GET  /:classId/roster           # 学生名单
│   └── GET  /:classId/analytics        # 班级分析
├── /assignments
│   ├── GET    /                        # 获取所有作业
│   ├── POST   /                        # 创建作业
│   ├── GET    /:id                     # 作业详情
│   ├── PUT    /:id                     # 更新作业
│   ├── DELETE /:id                     # 删除作业
│   ├── POST   /:id/publish             # 发布作业
│   ├── GET    /:id/submissions         # 获取提交
│   └── GET    /:id/grading-summary     # 评分摘要
├── /submissions
│   ├── GET  /:id                       # 提交详情
│   ├── PUT  /:id/grade                 # 评分
│   └── PUT  /:id/feedback              # 更新反馈
├── /students
│   ├── GET  /                          # 获取所有学生
│   ├── GET  /:id                       # 学生详情
│   └── GET  /:studentId/classes/:classId/performance
└── /ai
    ├── POST /generate-rubric           # 生成评分标准
    ├── POST /summarize                 # 内容摘要
    ├── POST /auto-grade                # 自动评分
    └── POST /analyze-performance       # 分析表现
```

## 🚀 快速测试

### 1. 确保环境变量配置

在 `backend/.env` 中添加：

```env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# 可选：AI功能需要
OPENAI_API_KEY=your_openai_api_key
```

### 2. 启动服务器

```bash
cd backend
npm install
npm run dev
```

### 3. 测试基本端点

#### 登录获取Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "your_password",
    "role": "teacher"
  }'
```

保存返回的 `token`。

#### 获取班级列表

```bash
curl http://localhost:3000/api/teacher/classes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 获取作业列表

```bash
curl http://localhost:3000/api/teacher/assignments \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 生成AI评分标准 (UC10)

```bash
curl -X POST http://localhost:3000/api/teacher/ai/generate-rubric \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "assignment_title": "Climate Change Essay",
    "assignment_description": "Write an essay on climate change impacts",
    "assignment_type": "essay",
    "points_possible": 100
  }'
```

## 📊 Use Cases 实现状态

| Use Case | 状态 | 相关端点 |
|----------|------|---------|
| UC01: Select HSC Subjects | ⏳ 学生端 | - |
| UC02: Generate & Adjust Study Plan | ⏳ 学生端 | - |
| UC03: Practice with Auto-Generated Questions | ⏳ 学生端 | - |
| UC04: Submit Answers for Auto-Grading | ✅ 完成 | `PUT /submissions/:id/grade`, `POST /ai/auto-grade` |
| UC05: Receive Motivation Notifications | ⏳ 待实现 | - |
| UC06: Identify Knowledge Gaps | ⏳ 学生端 | - |
| UC07: Analyze Class Performance | ✅ 完成 | `GET /classes/:id/analytics`, `POST /ai/analyze-performance` |
| UC08: Review Student Behavior Report | ✅ 完成 | `GET /students`, `GET /students/:id` |
| UC09: AI-Driven Career Pathway | ⏳ 学生端 | - |
| UC10: AI-Generated Assessment Rubric | ✅ 完成 | `POST /ai/generate-rubric` |
| UC11: Content Summarisation | ✅ 完成 | `POST /ai/summarize` |
| UC12: Privacy and Data Protection | ⏳ 待实现 | - |

## 🔐 权限控制

所有教师端点都通过以下中间件保护：

1. **verifyAuth** - 验证JWT token
2. **requireRole('teacher')** - 确保用户是教师
3. **数据库级别** - 通过 `class_teachers` 表验证班级访问权限

### 权限验证流程

```javascript
// 示例：验证教师是否可以访问某个班级
const { data: access } = await supabase
  .from('class_teachers')
  .select('role_in_class')
  .eq('profile_id', teacherId)
  .eq('class_id', classId)
  .single();

if (!access) {
  return ErrorResponse.forbidden('No access').send(res);
}
```

## 🤖 AI 功能说明

### Mock vs 真实AI

AI功能具有fallback机制：

- **有 OPENAI_API_KEY**: 使用真实OpenAI API
- **无 OPENAI_API_KEY**: 返回mock数据，不影响功能测试

### AI 功能特点

1. **生成评分标准** - 基于作业描述生成详细rubric
2. **自动评分** - 分析学生答案并给出分数和反馈
3. **内容摘要** - 总结长文本
4. **表现分析** - 提供班级表现insights和建议

## 📝 数据库要求

### 必需的表

确保Supabase中存在以下表：

- `profiles` - 用户信息
- `profile_roles` - 用户角色
- `classes` - 班级
- `class_teachers` - 教师-班级映射
- `enrollments` - 学生-班级映射
- `assignments` - 作业
- `assignment_submissions` - 提交
- `assignment_questions` - 问题
- `assignment_submission_answers` - 答案

### RLS 策略

所有表都启用了Row Level Security (RLS)：

- 教师可以访问自己班级的数据
- 使用 `is_class_teacher()` 等辅助函数验证权限

## 🧪 测试建议

### 单元测试

创建测试用例测试每个控制器：

```javascript
// 示例测试
describe('Teacher Classes Controller', () => {
  it('should get teacher classes', async () => {
    // 测试代码
  });
});
```

### 集成测试

测试完整的API流程：

1. 登录 → 获取token
2. 创建作业
3. 学生提交
4. 教师评分
5. 查看分析

### Postman Collection

考虑创建Postman collection包含所有端点。

## 🔄 前后端集成

### 前端调用示例

```javascript
// authService.js
async getTeacherClasses() {
  return this.authenticatedRequest('/teacher/classes', {
    method: 'GET'
  });
}

async createAssignment(assignmentData) {
  return this.authenticatedRequest('/teacher/assignments', {
    method: 'POST',
    body: JSON.stringify(assignmentData)
  });
}

async gradeSubmission(submissionId, gradeData) {
  return this.authenticatedRequest(`/teacher/submissions/${submissionId}/grade`, {
    method: 'PUT',
    body: JSON.stringify(gradeData)
  });
}
```

## 📈 性能优化建议

1. **缓存常用数据** - 如班级列表、学生名单
2. **分页** - 对大量数据实现分页
3. **懒加载** - 按需加载详细数据
4. **批量操作** - 实现批量评分等功能
5. **数据库索引** - 确保关键字段有索引

## 🐛 常见问题

### 1. "User not authenticated"

**原因**: Token无效或过期

**解决**: 重新登录获取新token

### 2. "You do not have access to this class"

**原因**: 教师不是该班级的授课教师

**解决**: 检查 `class_teachers` 表中的映射关系

### 3. "OpenAI API error"

**原因**: API key无效或余额不足

**解决**: 检查 `OPENAI_API_KEY`，AI功能会自动fallback到mock模式

## 📚 完整文档

详细API文档请查看: [TEACHER_API.md](./TEACHER_API.md)

## 🎯 下一步

1. ✅ 教师端后端 - 已完成
2. ⏳ 学生端后端 - 待实现
3. ⏳ 家长端后端 - 待实现
4. ⏳ 前后端集成测试
5. ⏳ 部署配置

---

**开发团队**: ELEC5620 Group 83  
**最后更新**: 2024-10-28



