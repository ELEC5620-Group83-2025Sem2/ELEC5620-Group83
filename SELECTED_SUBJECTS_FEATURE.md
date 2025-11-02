# HSC 科目选择功能实现文档

## 实现时间
2025-11-02

## 功能描述
在 HSC Subject Recommendation 页面中，学生可以：
1. 输入兴趣爱好生成 AI 推荐的 HSC 科目
2. 通过复选框选择推荐的科目
3. 保存选择的科目到数据库
4. 后续可查看已选择的科目

## 用户体验改进
- ✅ 去掉了页面下方重复的标题和描述文字
- ✅ 每个科目卡片添加了复选框
- ✅ 点击卡片即可选择/取消选择
- ✅ 选中的卡片有明显的视觉反馈（蓝色边框和阴影）
- ✅ 实时显示已选择的科目数量
- ✅ 只有选择了科目后才显示"Save Selection"按钮
- ✅ 保存成功/失败有明确的通知消息

---

## 修改的文件

### 1. 前端 Frontend

#### `frontend/src/components/dashboard/HSCSubjectRecommendation.jsx`
**主要改动**：
- ✅ 去掉了重复的页面标题和描述（原第56-60行）
- ✅ 添加了状态管理：
  - `selectedSubjects` - 存储已选择的科目
  - `saving` - 保存加载状态
- ✅ 添加了三个新函数：
  - `toggleSubjectSelection()` - 切换科目选择状态
  - `isSubjectSelected()` - 检查科目是否被选中
  - `handleSaveSelection()` - 保存选择的科目
- ✅ 每个科目卡片添加了：
  - 复选框（可点击）
  - 点击卡片即可选择
  - 选中状态的视觉反馈
- ✅ 结果摘要区域添加：
  - 显示选中的科目数量
  - "Save Selection"按钮（仅在有选择时显示）
- ✅ 改进了通知系统（支持 success 和 error 类型）

#### `frontend/src/services/studentApi.js`
**新增函数**：
```javascript
// 保存学生选择的 HSC 科目
async saveSelectedSubjects(data) {
  return authenticatedRequest('/student/selected-subjects', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 获取学生已选择的 HSC 科目
async getSelectedSubjects() {
  return authenticatedRequest('/student/selected-subjects', {
    method: 'GET'
  });
}
```

---

### 2. 后端 Backend

#### `backend/controllers/student/selectedSubjects.js` (新建)
**包含三个控制器函数**：

1. **`saveSelectedSubjects`** - 保存选择的科目
   - 删除学生之前的所有选择
   - 插入新的选择
   - 返回保存结果

2. **`getSelectedSubjects`** - 获取已选择的科目
   - 查询学生的所有已选科目
   - 按选择时间降序排序

3. **`deleteSelectedSubject`** - 删除特定科目
   - 删除单个已选科目
   - 验证学生权限

#### `backend/routes/student.js`
**新增路由**：
```javascript
// POST /api/student/selected-subjects - 保存学生选择的 HSC 科目
router.post('/selected-subjects', saveSelectedSubjects);

// GET /api/student/selected-subjects - 获取学生已选择的 HSC 科目
router.get('/selected-subjects', getSelectedSubjects);

// DELETE /api/student/selected-subjects/:id - 删除特定的已选科目
router.delete('/selected-subjects/:id', deleteSelectedSubject);
```

---

### 3. 数据库 Database

#### `db_scripts/create_selected_subjects_table.sql` (新建)
**创建的表结构**：

```sql
CREATE TABLE selected_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_code VARCHAR(50) NOT NULL,
  subject_name TEXT NOT NULL,
  category VARCHAR(100),
  reasoning TEXT,
  selected_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**字段说明**：
- `id` - 唯一标识符
- `student_id` - 学生 ID（外键，关联到 profiles 表）
- `subject_code` - 科目代码（如 ENG-ADV, MATH-EXT1）
- `subject_name` - 科目全名（如 English Advanced）
- `category` - 科目类别（如 Mathematics, Science, English）
- `reasoning` - AI 生成的推荐理由
- `selected_at` - 选择时间戳
- `created_at` - 记录创建时间
- `updated_at` - 记录更新时间

**创建的索引**：
- `idx_selected_subjects_student_id` - 加速按学生查询
- `idx_selected_subjects_unique` - 防止重复选择（student_id + subject_code + subject_name 唯一）

**Row Level Security (RLS) 策略**：
- ✅ 学生只能查看自己的选择
- ✅ 学生只能插入自己的选择
- ✅ 学生只能更新自己的选择
- ✅ 学生只能删除自己的选择
- 📝 预留教师查看权限（已注释，可选启用）

**自动触发器**：
- `trigger_update_selected_subjects_updated_at` - 自动更新 `updated_at` 字段

---

## API 端点

### 1. POST /api/student/selected-subjects
**保存学生选择的 HSC 科目**

**认证**: 需要 JWT Token (Student 角色)

**请求示例**：
```javascript
POST /api/student/selected-subjects
Headers: {
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
}
Body: {
  "subjects": [
    {
      "code": "ENG-ADV",
      "name": "English Advanced",
      "category": "English",
      "reasoning": "Strong analytical skills suit this course"
    },
    {
      "code": "MATH-EXT1",
      "name": "Mathematics Extension 1",
      "category": "Mathematics",
      "reasoning": "Excellent problem-solving abilities"
    }
  ]
}
```

**响应示例**：
```json
{
  "success": true,
  "message": "Successfully saved 2 selected subject(s)",
  "data": [
    {
      "id": "uuid-1",
      "student_id": "student-uuid",
      "subject_code": "ENG-ADV",
      "subject_name": "English Advanced",
      "category": "English",
      "reasoning": "Strong analytical skills suit this course",
      "selected_at": "2025-11-02T10:30:00.000Z",
      "created_at": "2025-11-02T10:30:00.000Z",
      "updated_at": "2025-11-02T10:30:00.000Z"
    }
  ]
}
```

### 2. GET /api/student/selected-subjects
**获取学生已选择的 HSC 科目**

**认证**: 需要 JWT Token (Student 角色)

**请求示例**：
```javascript
GET /api/student/selected-subjects
Headers: {
  Authorization: Bearer <JWT_TOKEN>
}
```

**响应示例**：
```json
{
  "success": true,
  "subjects": [
    {
      "id": "uuid-1",
      "student_id": "student-uuid",
      "subject_code": "ENG-ADV",
      "subject_name": "English Advanced",
      "category": "English",
      "reasoning": "Strong analytical skills suit this course",
      "selected_at": "2025-11-02T10:30:00.000Z"
    }
  ]
}
```

### 3. DELETE /api/student/selected-subjects/:id
**删除特定的已选科目**

**认证**: 需要 JWT Token (Student 角色)

**请求示例**：
```javascript
DELETE /api/student/selected-subjects/uuid-1
Headers: {
  Authorization: Bearer <JWT_TOKEN>
}
```

**响应示例**：
```json
{
  "success": true,
  "message": "Selected subject deleted successfully"
}
```

---

## 数据流

### 用户操作流程
```
1. 学生输入兴趣爱好
   ↓
2. 点击 "Generate Recommendation"
   ↓
3. AI 生成推荐科目列表
   ↓
4. 学生点击复选框或卡片选择科目
   ↓
5. 点击 "Save Selection (N)" 按钮
   ↓
6. 前端调用 API 保存到数据库
   ↓
7. 显示成功通知
```

### 技术数据流
```
Frontend (HSCSubjectRecommendation.jsx)
  ↓ [selectedSubjects state]
studentApi.saveSelectedSubjects()
  ↓ [POST /api/student/selected-subjects]
Backend (selectedSubjects.js)
  ↓ [DELETE old + INSERT new]
Supabase (selected_subjects table)
  ↓ [RLS policies check]
✅ 保存成功
  ↓
Frontend 显示通知
```

---

## 使用方法

### 1. 创建数据库表
在 Supabase SQL 编辑器中运行：
```bash
# 在 Supabase Dashboard 的 SQL Editor 中运行
db_scripts/create_selected_subjects_table.sql
```

### 2. 重启后端服务器
```bash
cd backend
npm start
```

### 3. 重启前端服务器
```bash
cd frontend
npm run dev
```

### 4. 测试功能
1. 以学生身份登录
2. 进入 "HSC Subject Recommendation" 页面
3. 输入兴趣爱好（如：software, health, design）
4. 点击 "✨ Generate Recommendation"
5. 查看 AI 生成的推荐科目
6. 点击科目卡片或复选框选择科目
7. 点击 "💾 Save Selection (N)" 保存
8. 应该看到成功通知消息

---

## 视觉变化

### 修改前
- 有重复的标题 "HSC Subject Recommendation"
- 科目卡片无法选择
- 无法保存选择

### 修改后
- ✅ 去掉了重复标题
- ✅ 每个科目卡片有复选框
- ✅ 点击卡片即可选择
- ✅ 选中的卡片有蓝色边框和阴影
- ✅ 显示选中数量："Showing 5 recommended subjects • 2 selected"
- ✅ 有选择时显示 "💾 Save Selection (2)" 按钮
- ✅ 保存成功显示绿色通知："Successfully saved 2 selected subject(s)!"

---

## 安全性

### 认证
- ✅ 所有 API 端点需要有效的 JWT Token
- ✅ Token 必须包含 student 角色

### 授权
- ✅ 学生只能操作自己的数据
- ✅ 通过 RLS 策略在数据库层面强制执行
- ✅ 后端通过 `req.user.id` 验证身份

### 数据验证
- ✅ 前端验证：至少选择一个科目才能保存
- ✅ 后端验证：检查 subjects 数组是否存在且非空
- ✅ 数据库约束：防止重复选择（unique index）

---

## 错误处理

### 前端错误处理
```javascript
try {
  await studentApi.saveSelectedSubjects({ subjects: selectedSubjects })
  // 成功通知
} catch (e) {
  // 错误通知
  setError(e?.message || 'Failed to save selected subjects')
}
```

### 后端错误处理
- 缺少必需参数 → 400 Bad Request
- 数据库操作失败 → 500 Internal Server Error
- 认证失败 → 401 Unauthorized
- 权限不足 → 403 Forbidden

### 用户友好的错误消息
- 未选择科目：" Please select at least one subject to save."
- 保存失败："Failed to save your selection. Please try again."
- 保存成功："Successfully saved 2 selected subject(s)!"

---

## 日志输出

### 后端日志
```
[saveSelectedSubjects] Saving 2 subjects for student_id: <UUID>
[saveSelectedSubjects] Successfully saved 2 subjects for student <UUID>

[getSelectedSubjects] Fetching selected subjects for student_id: <UUID>
[getSelectedSubjects] Found 2 selected subjects for student <UUID>

[deleteSelectedSubject] Deleting subject <UUID> for student_id: <UUID>
[deleteSelectedSubject] Successfully deleted subject <UUID>
```

---

## 后续功能建议

### 短期优化
1. **在其他页面显示已选科目**
   - Dashboard 显示已选科目摘要
   - HSC Subjects 页面标记已选科目

2. **编辑功能**
   - 允许学生修改已选科目
   - 添加/删除单个科目而不是全部替换

3. **导出功能**
   - 导出已选科目列表为 PDF
   - 分享给家长或老师

### 中期功能
4. **科目详情页**
   - 点击已选科目查看详细信息
   - 显示推荐理由和职业路径

5. **比较功能**
   - 比较不同科目的难度、热门度
   - 显示科目组合建议

6. **通知功能**
   - 选课截止日期提醒
   - 科目信息更新通知

### 长期功能
7. **AI 建议优化**
   - 根据已选科目提供补充建议
   - 分析科目组合的合理性

8. **协作功能**
   - 与家长/老师分享选择
   - 收集反馈和建议

9. **统计分析**
   - 显示每个科目的选择率
   - 提供同龄人选择对比

---

## 测试场景

### 场景 1：首次选择科目
1. 进入 HSC Subject Recommendation 页面
2. 输入兴趣："software, mathematics"
3. 点击生成推荐
4. 选择 2-3 个科目
5. 点击保存
6. 验证成功消息

### 场景 2：修改已选科目
1. 已有已选科目
2. 重新生成推荐
3. 修改选择（添加/删除科目）
4. 再次保存
5. 验证旧选择被替换

### 场景 3：空选择处理
1. 不选择任何科目
2. 点击保存按钮（不应显示）
3. 验证无法保存

### 场景 4：数据持久化
1. 选择并保存科目
2. 退出登录
3. 重新登录
4. 调用 GET API 验证数据仍在

### 场景 5：权限验证
1. 尝试访问其他学生的选择
2. 验证 RLS 策略阻止访问
3. 只能看到自己的数据

---

## 性能考虑

1. **数据库查询优化**
   - 使用索引加速查询（`idx_selected_subjects_student_id`）
   - 唯一索引防止重复插入

2. **前端性能**
   - 使用 React state 管理选择状态
   - 避免不必要的重新渲染

3. **API 性能**
   - 批量插入（一次请求保存所有科目）
   - 使用 DELETE + INSERT 策略简化逻辑

---

## 成功标准

✅ 去掉了页面重复标题  
✅ 科目卡片可以选择  
✅ 选中状态有明显视觉反馈  
✅ 可以保存选择到数据库  
✅ API 端点正常工作  
✅ RLS 策略正确配置  
✅ 错误处理完善  
✅ 用户体验流畅  
✅ 数据持久化正常  
✅ 安全性得到保障  

## 总结

这次功能实现完成了：
- ✅ 改进了 UI/UX（去掉重复标题，添加选择功能）
- ✅ 创建了完整的数据库表结构
- ✅ 实现了端到端的保存功能
- ✅ 配置了安全的 RLS 策略
- ✅ 提供了完善的错误处理

学生现在可以：
1. 获取 AI 推荐的 HSC 科目
2. 选择感兴趣的科目
3. 保存选择到数据库
4. 后续查看和管理已选科目

这为未来的功能扩展（如学习计划生成、职业路径分析）奠定了基础。

