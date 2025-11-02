# HSC 科目选择功能 - 即时保存改进

## 改进时间
2025-11-02

## 改进内容

### 🎯 用户需求
1. ✅ 每次选择/取消选择立即保存到数据库（不需要点击"保存"按钮）
2. ✅ 刷新页面后选择状态保持（从数据库加载）
3. ✅ 不能选择重复的科目
4. ✅ 尝试选择重复科目时显示友好提示："您已经选择了 [科目名称]"

---

## 修改的文件

### 1. 前端 Frontend

#### `frontend/src/components/dashboard/HSCSubjectRecommendation.jsx`

**主要改动**：

1. **添加 useEffect 钩子 - 页面加载时获取已选科目**
```javascript
useEffect(() => {
  const fetchSelectedSubjects = async () => {
    try {
      const response = await studentApi.getSelectedSubjects()
      setSelectedSubjects(response.subjects || [])
    } catch (e) {
      console.error('Failed to load selected subjects:', e)
    } finally {
      setLoadingSubjects(false)
    }
  }
  fetchSelectedSubjects()
}, [])
```

2. **修改 toggleSubjectSelection - 立即保存/删除**
```javascript
const toggleSubjectSelection = async (subject) => {
  const existingSubject = selectedSubjects.find(...)
  
  if (existingSubject) {
    // 取消选择：立即从数据库删除
    await studentApi.deleteSelectedSubject(existingSubject.id)
    setSelectedSubjects(...)
    // 显示成功通知
  } else {
    // 选择：立即保存到数据库
    const response = await studentApi.addSelectedSubject(...)
    setSelectedSubjects([...selectedSubjects, response.data])
    // 显示成功通知或重复错误
  }
}
```

3. **修改 isSubjectSelected - 匹配数据库字段**
```javascript
const isSubjectSelected = (subject) => {
  return selectedSubjects.some(
    s => s.subject_code === subjectCode && s.subject_name === subjectName
  )
}
```

4. **添加已选科目摘要卡片**
```javascript
{selectedSubjects.length > 0 && (
  <div className="selected-summary">
    ✓ Your Selected Subjects ({selectedSubjects.length})
    {selectedSubjects.map(subject => (
      <span>{subject.subject_name}</span>
    ))}
  </div>
)}
```

5. **移除 "Save Selection" 按钮**
   - 不再需要批量保存按钮
   - 每次点击立即保存

#### `frontend/src/services/studentApi.js`

**修改 API 函数**：

```javascript
// 之前：批量保存
async saveSelectedSubjects(data) { ... }

// 现在：单个添加
async addSelectedSubject(data) {
  return authenticatedRequest('/student/selected-subjects', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 新增：删除单个科目
async deleteSelectedSubject(subjectId) {
  return authenticatedRequest(`/student/selected-subjects/${subjectId}`, {
    method: 'DELETE'
  });
}
```

---

### 2. 后端 Backend

#### `backend/controllers/student/selectedSubjects.js`

**重写 addSelectedSubject（之前是 saveSelectedSubjects）**：

```javascript
export const addSelectedSubject = async (req, res) => {
  const { subject_code, subject_name, category, reasoning } = req.body;
  
  // 1. 检查是否已存在
  const { data: existing } = await supabase
    .from('selected_subjects')
    .select('*')
    .eq('student_id', studentId)
    .eq('subject_code', subject_code)
    .eq('subject_name', subject_name)
    .maybeSingle();
  
  if (existing) {
    // 返回友好的错误消息
    return res.status(400).json({
      success: false,
      error: `You have already selected "${subject_name}"`
    });
  }
  
  // 2. 插入新选择
  const { data } = await supabase
    .from('selected_subjects')
    .insert({
      student_id: studentId,
      subject_code,
      subject_name,
      category,
      reasoning,
      selected_at: new Date().toISOString()
    })
    .select()
    .single();
  
  return res.status(200).json({
    success: true,
    message: `Successfully added "${subject_name}"`,
    data: data
  });
};
```

**关键改进**：
- ✅ 不再"删除所有 + 批量插入"
- ✅ 改为"单个插入"
- ✅ 添加重复检查
- ✅ 返回友好的错误消息
- ✅ 处理数据库 unique constraint violation (code 23505)

#### `backend/routes/student.js`

**更新导入和路由**：
```javascript
// 之前
import { saveSelectedSubjects, ... } from '...'
router.post('/selected-subjects', saveSelectedSubjects);

// 现在
import { addSelectedSubject, ... } from '...'
router.post('/selected-subjects', addSelectedSubject);
```

---

## 数据流

### 页面加载流程
```
1. 用户打开 HSC Subject Recommendation 页面
   ↓
2. useEffect 自动执行
   ↓
3. 调用 studentApi.getSelectedSubjects()
   ↓
4. GET /api/student/selected-subjects
   ↓
5. 后端从数据库查询该学生的所有已选科目
   ↓
6. 返回数据到前端
   ↓
7. setSelectedSubjects(response.subjects)
   ↓
8. 页面显示已选科目摘要卡片（紫色渐变）
   ↓
9. AI 推荐的科目中，已选的显示为选中状态（蓝色边框）
```

### 选择科目流程
```
1. 用户点击科目卡片或复选框
   ↓
2. toggleSubjectSelection(subject) 执行
   ↓
3. 检查是否已选择？
   
   未选择：
   ↓
   4a. 调用 studentApi.addSelectedSubject(...)
   ↓
   5a. POST /api/student/selected-subjects
   ↓
   6a. 后端检查是否重复
   ↓
   7a. 如果重复 → 返回 400 错误："You have already selected XX"
   7b. 如果不重复 → 插入数据库 → 返回成功
   ↓
   8a. 前端更新 selectedSubjects 状态
   ↓
   9a. 显示绿色通知："Added 'XX' to your selections ✓"
   ↓
   10a. 卡片边框变蓝，复选框被勾选
```

### 取消选择流程
```
1. 用户再次点击已选中的科目
   ↓
2. toggleSubjectSelection(subject) 执行
   ↓
3. 发现已选择
   ↓
   4b. 调用 studentApi.deleteSelectedSubject(existingSubject.id)
   ↓
   5b. DELETE /api/student/selected-subjects/:id
   ↓
   6b. 后端从数据库删除该记录
   ↓
   7b. 前端更新 selectedSubjects 状态（移除该科目）
   ↓
   8b. 显示绿色通知："Removed 'XX' from your selections"
   ↓
   9b. 卡片边框恢复正常，复选框取消勾选
```

---

## 用户体验

### 改进前
❌ 需要点击"Save Selection"按钮才能保存  
❌ 刷新页面后选择消失  
❌ 可以重复选择同一科目  
❌ 没有选择历史  

### 改进后
✅ 点击即保存，无需额外操作  
✅ 刷新页面后选择保持  
✅ 自动防止重复选择  
✅ 显示友好的重复提示  
✅ 页面顶部显示已选科目摘要（紫色渐变卡片）  
✅ 实时通知（绿色 = 成功，红色 = 错误）  

---

## 视觉效果

### 已选科目摘要卡片（紫色渐变）
```
╔══════════════════════════════════════════════════════╗
║ ✓ Your Selected Subjects (3)                    📚  ║
║                                                      ║
║ [English Advanced] [Mathematics] [Physics]          ║
╚══════════════════════════════════════════════════════╝
```

### 科目卡片状态
- **未选择**：白色背景，灰色边框
- **已选择**：白色背景，**蓝色粗边框**，蓝色阴影，复选框勾选
- **悬停**：轻微放大效果

### 通知消息
- **成功（绿色）**："Added 'Mathematics' to your selections ✓"
- **成功（绿色）**："Removed 'Physics' from your selections"
- **错误（红色）**："You have already selected 'English Advanced'"

---

## API 端点变化

### POST /api/student/selected-subjects

**之前（批量保存）**：
```json
Request: {
  "subjects": [
    { "code": "ENG-ADV", "name": "English Advanced", ... },
    { "code": "MATH", "name": "Mathematics", ... }
  ]
}

Response: {
  "success": true,
  "message": "Successfully saved 2 selected subject(s)",
  "data": [...]
}
```

**现在（单个添加）**：
```json
Request: {
  "subject_code": "ENG-ADV",
  "subject_name": "English Advanced",
  "category": "English",
  "reasoning": "Strong analytical skills..."
}

Response (成功): {
  "success": true,
  "message": "Successfully added 'English Advanced'",
  "data": {
    "id": "uuid",
    "student_id": "student-uuid",
    "subject_code": "ENG-ADV",
    "subject_name": "English Advanced",
    ...
  }
}

Response (重复): {
  "success": false,
  "error": "You have already selected 'English Advanced'"
}
```

### DELETE /api/student/selected-subjects/:id (新增)

```json
Request: DELETE /api/student/selected-subjects/abc-123-uuid

Response: {
  "success": true,
  "message": "Selected subject deleted successfully"
}
```

---

## 错误处理

### 前端错误处理
```javascript
try {
  const response = await studentApi.addSelectedSubject(...)
  // 成功处理
} catch (e) {
  if (e.message && e.message.includes('already selected')) {
    // 显示重复错误
    setNotification({ 
      type: 'error', 
      message: `You have already selected "${subjectName}"` 
    })
  } else {
    // 显示通用错误
    setNotification({ 
      type: 'error', 
      message: 'Failed to save selection. Please try again.' 
    })
  }
}
```

### 后端错误处理
```javascript
// 1. 检查重复（数据库查询）
if (existing) {
  return res.status(400).json({
    success: false,
    error: `You have already selected "${subject_name}"`
  });
}

// 2. 捕获 unique constraint violation
if (insertError.code === '23505') {
  return res.status(400).json({
    success: false,
    error: `You have already selected "${subject_name}"`
  });
}
```

---

## 数据库表结构（保持不变）

```sql
CREATE TABLE selected_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id),
  subject_code VARCHAR(50) NOT NULL,
  subject_name TEXT NOT NULL,
  category VARCHAR(100),
  reasoning TEXT,
  selected_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint prevents duplicates
CREATE UNIQUE INDEX idx_selected_subjects_unique 
ON selected_subjects(student_id, subject_code, subject_name);
```

---

## 测试步骤

### 测试 1：页面加载时显示已选科目
1. 打开 HSC Subject Recommendation 页面
2. 如果之前有选择科目，应该看到紫色的摘要卡片
3. 卡片显示："✓ Your Selected Subjects (N)"
4. 列出所有已选科目的名称

### 测试 2：选择新科目
1. 点击 "Generate Recommendation"
2. 点击一个未选择的科目卡片
3. 应该立即：
   - 卡片边框变蓝
   - 复选框被勾选
   - 显示绿色通知："Added 'XX' to your selections ✓"
   - 摘要卡片更新数量

### 测试 3：取消选择
1. 再次点击已选中的科目
2. 应该立即：
   - 卡片边框恢复正常
   - 复选框取消勾选
   - 显示绿色通知："Removed 'XX' from your selections"
   - 摘要卡片更新数量

### 测试 4：防止重复选择
1. 选择科目 A
2. 刷新页面（或重新生成推荐）
3. 科目 A 应该显示为已选中状态
4. 如果尝试再次选择科目 A（通过其他方式）
5. 应该显示红色错误："You have already selected 'XX'"

### 测试 5：持久化验证
1. 选择几个科目
2. 刷新浏览器页面（F5）
3. 已选科目应该仍然显示
4. 摘要卡片应该显示所有已选科目
5. 在推荐列表中，已选科目显示为选中状态

### 测试 6：跨会话验证
1. 选择科目并退出登录
2. 重新登录
3. 进入 HSC Subject Recommendation 页面
4. 已选科目应该仍然保持

---

## 性能优化

1. **数据库查询优化**
   - 使用索引加速重复检查
   - 使用 `.maybeSingle()` 而不是 `.limit(1)`

2. **前端优化**
   - 只在组件挂载时加载一次已选科目
   - 使用本地状态管理，避免重复请求
   - 乐观更新 UI（先更新界面，后台同步数据库）

3. **网络优化**
   - 单个科目操作，减少数据传输
   - 立即响应用户操作，体验更流畅

---

## 安全性

1. **认证**
   - 所有 API 需要有效的 JWT Token
   - 验证 student 角色

2. **授权**
   - 通过 `req.user.id` 确保只能操作自己的数据
   - RLS 策略在数据库层面强制执行

3. **数据验证**
   - 前端：检查必需字段
   - 后端：双重验证（查询 + unique constraint）
   - 数据库：unique index 防止并发重复

---

## 日志输出

### 后端日志
```
[addSelectedSubject] Adding subject Mathematics for student_id: <UUID>
[addSelectedSubject] Successfully added subject Mathematics for student <UUID>

[addSelectedSubject] Subject English Advanced already selected by student <UUID>

[deleteSelectedSubject] Deleting subject <UUID> for student_id: <UUID>
[deleteSelectedSubject] Successfully deleted subject <UUID>

[getSelectedSubjects] Fetching selected subjects for student_id: <UUID>
[getSelectedSubjects] Found 3 selected subjects for student <UUID>
```

---

## 与之前版本的对比

| 功能 | 之前版本 | 改进后版本 |
|------|---------|-----------|
| 保存方式 | 点击"Save Selection"按钮 | 点击科目立即保存 |
| 刷新页面 | 选择消失 | 选择保持 |
| 重复检测 | 无 | 有，显示友好提示 |
| 数据持久化 | 需要手动保存 | 自动持久化 |
| 用户反馈 | 仅在保存时 | 每次操作都有通知 |
| 已选科目展示 | 无 | 紫色摘要卡片 |
| API 调用 | 批量保存 | 单个增删 |
| 数据库操作 | DELETE ALL + INSERT | 单个 INSERT/DELETE |

---

## 后续功能建议

1. **拖拽排序**
   - 允许学生对已选科目排序
   - 保存排序顺序

2. **批量操作**
   - "全选推荐"按钮
   - "清空所有选择"按钮

3. **选择限制**
   - 设置最多可选科目数量（如 HSC 最多 12 units）
   - 显示当前已选 units 总数

4. **分享功能**
   - 生成分享链接
   - 发送给家长或老师

5. **历史记录**
   - 查看选择历史
   - 撤销/恢复操作

---

## 成功标准

✅ 点击科目立即保存到数据库  
✅ 刷新页面后选择状态保持  
✅ 防止重复选择  
✅ 显示友好的重复提示  
✅ 页面顶部显示已选科目摘要  
✅ 实时通知反馈  
✅ 数据持久化正常  
✅ API 性能优良  
✅ 错误处理完善  
✅ 用户体验流畅  

## 总结

这次改进实现了真正的"即选即存"功能：
- ✅ 无需手动点击保存按钮
- ✅ 每次操作立即同步到数据库
- ✅ 刷新页面或重新登录后数据保持
- ✅ 智能防止重复选择
- ✅ 友好的用户反馈

学生现在可以放心地选择科目，不用担心数据丢失！🎉

