# Teacher API Documentation

本文档描述了为HSC Power教师门户实现的后端API端点。

## 概述

教师API提供了完整的课程管理、作业管理、学生跟踪和公告功能。所有端点都需要身份验证和教师角色权限。

## 身份验证

所有教师API端点需要：
1. **JWT令牌**: 在Authorization头中作为Bearer令牌
2. **教师角色**: 用户必须具有`teacher`或`admin`角色

### 示例请求头
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## API端点

### 基础URL
```
http://localhost:3000/api/teacher
```

---

## 课程管理 (Classes)

### 1. 获取教师的所有课程
**端点**: `GET /api/teacher/classes`

**描述**: 获取当前教师教授的所有课程

**响应示例**:
```json
{
  "classes": [
    {
      "id": "uuid",
      "code": "MATH12-ADV-A",
      "name": "HSC Mathematics Advanced - A",
      "description": "Advanced mathematics for Year 12",
      "color": "#667eea",
      "studentCount": 25,
      "assignmentCount": 8,
      "avgGrade": "85%"
    }
  ]
}
```

### 2. 获取课程详细信息
**端点**: `GET /api/teacher/classes/:id`

**描述**: 获取特定课程的详细信息

**参数**:
- `id` (路径参数): 课程ID

**响应示例**:
```json
{
  "class": {
    "id": "uuid",
    "code": "MATH12-ADV-A",
    "name": "HSC Mathematics Advanced - A",
    "description": "Advanced mathematics for Year 12",
    "studentCount": 25,
    "assignmentCount": 8,
    "materials": [
      {
        "id": "uuid",
        "name": "Chapter 5 Notes",
        "type": "pdf",
        "url": "https://..."
      }
    ],
    "schedule": [
      {
        "id": "uuid",
        "day_of_week": 1,
        "start_time": "09:00",
        "end_time": "10:30"
      }
    ]
  }
}
```

### 3. 获取课程学生名单
**端点**: `GET /api/teacher/classes/:id/students`

**描述**: 获取特定课程的学生花名册

**参数**:
- `id` (路径参数): 课程ID

**响应示例**:
```json
{
  "students": [
    {
      "id": "uuid",
      "name": "张三",
      "firstName": "三",
      "lastName": "张",
      "email": "zhang.san@example.com",
      "avatar": "https://...",
      "enrolledAt": "2025-01-15T00:00:00Z",
      "avgGrade": "88%"
    }
  ]
}
```

### 4. 获取课程分析数据
**端点**: `GET /api/teacher/classes/:id/analytics`

**描述**: 获取课程的统计分析数据

**参数**:
- `id` (路径参数): 课程ID

**响应示例**:
```json
{
  "analytics": {
    "averageGrade": "85%",
    "completionRate": "92%",
    "gradeDistribution": {
      "A": 8,
      "B": 12,
      "C": 4,
      "D": 1,
      "F": 0
    },
    "totalStudents": 25,
    "totalAssignments": 8
  }
}
```

---

## 作业管理 (Assignments)

### 1. 获取所有作业
**端点**: `GET /api/teacher/assignments`

**描述**: 获取教师创建的所有作业

**响应示例**:
```json
{
  "assignments": [
    {
      "id": "uuid",
      "title": "Calculus Problem Set 5",
      "description": "Complete problems 1-10",
      "className": "HSC Mathematics Advanced - A",
      "classCode": "MATH12-ADV-A",
      "dueDate": "2025-11-15T23:59:00Z",
      "totalPoints": 100,
      "status": "published",
      "submissionStats": {
        "total": 18,
        "graded": 10,
        "pending": 8,
        "totalStudents": 25
      },
      "createdAt": "2025-10-20T10:00:00Z"
    }
  ]
}
```

### 2. 获取作业详细信息
**端点**: `GET /api/teacher/assignments/:id`

**描述**: 获取特定作业的详细信息和提交情况

**参数**:
- `id` (路径参数): 作业ID

**响应示例**:
```json
{
  "assignment": {
    "id": "uuid",
    "title": "Calculus Problem Set 5",
    "description": "Complete problems 1-10",
    "instructions": ["Read chapter 5", "Complete all problems"],
    "dueDate": "2025-11-15T23:59:00Z",
    "totalPoints": 100,
    "rubric": [
      {
        "criteria": "Accuracy",
        "points": 60
      }
    ],
    "questions": [],
    "resources": [],
    "status": "published",
    "className": "HSC Mathematics Advanced - A",
    "classCode": "MATH12-ADV-A",
    "submissions": [
      {
        "id": "uuid",
        "studentId": "uuid",
        "studentName": "张三",
        "studentAvatar": "https://...",
        "submittedAt": "2025-11-10T14:30:00Z",
        "status": "submitted",
        "grade": null,
        "feedback": null,
        "content": "..."
      }
    ]
  }
}
```

### 3. 创建作业
**端点**: `POST /api/teacher/assignments`

**描述**: 创建新作业

**请求体**:
```json
{
  "classId": "uuid",
  "title": "新作业标题",
  "description": "作业描述",
  "instructions": ["指导1", "指导2"],
  "dueDate": "2025-11-30T23:59:00Z",
  "totalPoints": 100,
  "rubric": [
    {
      "criteria": "准确性",
      "points": 60
    }
  ],
  "questions": [],
  "resources": []
}
```

**响应示例**:
```json
{
  "message": "Assignment created successfully",
  "assignment": {
    "id": "uuid",
    "title": "新作业标题",
    ...
  }
}
```

### 4. 更新作业
**端点**: `PUT /api/teacher/assignments/:id`

**描述**: 更新现有作业

**参数**:
- `id` (路径参数): 作业ID

**请求体**: 包含要更新的字段

**响应示例**:
```json
{
  "message": "Assignment updated successfully",
  "assignment": {
    "id": "uuid",
    ...
  }
}
```

### 5. 删除作业
**端点**: `DELETE /api/teacher/assignments/:id`

**描述**: 删除作业

**参数**:
- `id` (路径参数): 作业ID

**响应示例**:
```json
{
  "message": "Assignment deleted successfully"
}
```

### 6. 发布作业
**端点**: `POST /api/teacher/assignments/:id/publish`

**描述**: 发布作业（使学生可见）

**参数**:
- `id` (路径参数): 作业ID

**响应示例**:
```json
{
  "message": "Assignment published successfully",
  "assignment": {
    "id": "uuid",
    "status": "published",
    ...
  }
}
```

---

## 学生管理 (Students)

### 1. 获取所有学生
**端点**: `GET /api/teacher/students`

**描述**: 获取教师所有课程中的所有学生

**响应示例**:
```json
{
  "students": [
    {
      "id": "uuid",
      "name": "张三",
      "firstName": "三",
      "lastName": "张",
      "email": "zhang.san@example.com",
      "avatar": "https://...",
      "classes": [
        {
          "id": "uuid",
          "name": "HSC Mathematics Advanced - A",
          "code": "MATH12-ADV-A",
          "enrolledAt": "2025-01-15T00:00:00Z"
        }
      ],
      "avgGrade": "88%",
      "completedAssignments": 15,
      "totalAssignments": 20
    }
  ]
}
```

### 2. 获取学生详细信息
**端点**: `GET /api/teacher/students/:id`

**描述**: 获取特定学生的详细信息

**参数**:
- `id` (路径参数): 学生ID

**响应示例**:
```json
{
  "student": {
    "id": "uuid",
    "name": "张三",
    "firstName": "三",
    "lastName": "张",
    "email": "zhang.san@example.com",
    "avatar": "https://...",
    "classes": [
      {
        "classId": "uuid",
        "className": "HSC Mathematics Advanced - A",
        "classCode": "MATH12-ADV-A",
        "color": "#667eea",
        "enrolledAt": "2025-01-15T00:00:00Z",
        "avgGrade": "88%",
        "completedAssignments": 15,
        "totalAssignments": 20
      }
    ],
    "recentActivity": [
      {
        "id": "uuid",
        "assignmentTitle": "Calculus Problem Set 5",
        "submittedAt": "2025-11-10T14:30:00Z",
        "grade": "90"
      }
    ],
    "notes": "优秀学生，数学能力突出"
  }
}
```

### 3. 保存学生备注
**端点**: `PUT /api/teacher/students/:id/notes`

**描述**: 为学生保存或更新备注

**参数**:
- `id` (路径参数): 学生ID

**请求体**:
```json
{
  "notes": "这是关于学生的备注内容"
}
```

**响应示例**:
```json
{
  "message": "Notes updated successfully",
  "notes": {
    "student_id": "uuid",
    "teacher_id": "uuid",
    "notes": "这是关于学生的备注内容",
    "updated_at": "2025-10-28T10:00:00Z"
  }
}
```

---

## 公告管理 (Announcements)

### 1. 获取公告
**端点**: `GET /api/teacher/announcements`

**描述**: 获取教师创建的所有公告

**查询参数**:
- `classId` (可选): 按课程过滤

**响应示例**:
```json
{
  "announcements": [
    {
      "id": "uuid",
      "title": "重要通知",
      "content": "下周五将进行期中考试",
      "classId": "uuid",
      "className": "HSC Mathematics Advanced - A",
      "classCode": "MATH12-ADV-A",
      "createdAt": "2025-10-28T09:00:00Z",
      "updatedAt": "2025-10-28T09:00:00Z",
      "viewCount": 23
    }
  ]
}
```

### 2. 创建公告
**端点**: `POST /api/teacher/announcements`

**描述**: 创建新公告

**请求体**:
```json
{
  "classId": "uuid",
  "title": "公告标题",
  "content": "公告内容"
}
```

**响应示例**:
```json
{
  "message": "Announcement created successfully",
  "announcement": {
    "id": "uuid",
    "title": "公告标题",
    "content": "公告内容",
    "classId": "uuid",
    "className": "HSC Mathematics Advanced - A",
    "classCode": "MATH12-ADV-A",
    "createdAt": "2025-10-28T10:00:00Z"
  }
}
```

### 3. 更新公告
**端点**: `PUT /api/teacher/announcements/:id`

**描述**: 更新现有公告

**参数**:
- `id` (路径参数): 公告ID

**请求体**:
```json
{
  "title": "更新的标题",
  "content": "更新的内容"
}
```

**响应示例**:
```json
{
  "message": "Announcement updated successfully",
  "announcement": {
    "id": "uuid",
    "title": "更新的标题",
    "content": "更新的内容",
    ...
  }
}
```

### 4. 删除公告
**端点**: `DELETE /api/teacher/announcements/:id`

**描述**: 删除公告

**参数**:
- `id` (路径参数): 公告ID

**响应示例**:
```json
{
  "message": "Announcement deleted successfully"
}
```

---

## 错误响应

所有端点可能返回以下错误响应：

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You do not have access to this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An error occurred while processing your request"
}
```

---

## 数据库要求

### 必需的表

1. **classes** - 课程表
2. **class_teachers** - 教师-课程关联表
3. **enrollments** - 学生注册表
4. **assignments** - 作业表
5. **assignment_submissions** - 作业提交表
6. **class_materials** - 课程材料表
7. **class_schedule_sessions** - 课程时间表
8. **class_announcements** - 课程公告表
9. **student_notes** - 学生备注表
10. **profiles** - 用户资料表
11. **profile_roles** - 用户角色表

### 注意事项

某些表（如`student_notes`和`class_announcements`）可能需要创建。如果它们不存在，请运行相应的迁移脚本：

```sql
-- student_notes表
CREATE TABLE IF NOT EXISTS public.student_notes (
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (student_id, teacher_id)
);

-- class_announcements表
CREATE TABLE IF NOT EXISTS public.class_announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 使用示例

### JavaScript/Fetch API

```javascript
// 获取教师的所有课程
const getTeacherClasses = async () => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch('http://localhost:3000/api/teacher/classes', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data.classes;
};

// 创建新作业
const createAssignment = async (assignmentData) => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch('http://localhost:3000/api/teacher/assignments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(assignmentData)
  });
  
  const data = await response.json();
  return data.assignment;
};
```

### 使用authService（前端集成）

```javascript
import authService from '../services/authService';

// 获取课程
const classes = await authService.authenticatedRequest('/api/teacher/classes');

// 创建作业
const assignment = await authService.authenticatedRequest(
  '/api/teacher/assignments',
  {
    method: 'POST',
    body: JSON.stringify(assignmentData)
  }
);
```

---

## 测试

启动服务器后，可以使用以下命令测试API：

```bash
# 启动后端服务器
cd backend
npm start

# 在另一个终端中测试健康检查
curl http://localhost:3000/api/health

# 测试教师端点（需要有效的JWT令牌）
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3000/api/teacher/classes
```

---

## 版本

**版本**: 1.0.0  
**最后更新**: 2025年10月28日  
**维护者**: ELEC5620 Group 83

