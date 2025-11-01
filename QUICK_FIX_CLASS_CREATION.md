# 快速修复课程创建问题

## 🎯 立即执行的修复步骤

根据你的错误提示 "Failed to create class. Please try again."，最可能的原因是数据库表或RLS策略问题。

### ✅ 第一步：在Supabase SQL Editor运行修复脚本

1. 打开: https://supabase.com/dashboard/project/lhkyjculexeyfswiursm/sql/new

2. 复制并粘贴 `db_scripts/fix_classes_setup.sql` 的全部内容

3. 点击 "Run" 执行

这将会：
- 创建classes表（如果不存在）
- 创建class_teachers表（如果不存在）
- 设置正确的RLS策略
- 授予必要权限

### ✅ 第二步：检查后端是否运行

打开终端，运行：

```bash
cd backend
npm run dev
```

确保看到：
```
🚀 HSC Power Server is running on http://localhost:3000
✅ Supabase client initialized
```

### ✅ 第三步：检查环境变量

确认 `backend/.env` 文件存在且包含：

```env
SUPABASE_URL=https://lhkyjculexeyfswiursm.supabase.co
SUPABASE_KEY=eyJhbGc...（你的service_role密钥）
PORT=3000
```

**重要**: 确保使用service_role key，不是anon key！

获取密钥位置：
- https://supabase.com/dashboard/project/lhkyjculexeyfswiursm/settings/api
- 复制 "service_role" 密钥（secret）

### ✅ 第四步：重启后端和前端

1. **停止后端**：在运行 `npm run dev` 的终端按 Ctrl+C

2. **重新启动后端**：
```bash
cd backend
npm run dev
```

3. **重新加载前端**：在浏览器按F5刷新页面

### ✅ 第五步：重新尝试创建课程

1. 清除表单数据
2. 填写完整信息：
   - Class Code: `TEST123`
   - Class Name: `Test Class`
   - Description: `Test description`
   - Color: 选择一个颜色
   - Location: `Room 101`
3. 点击 "Create Class"

## 🔍 如何查看详细错误

### 方法1: 查看后端终端日志

在后端运行 `npm run dev` 的终端窗口中，应该能看到类似这样的错误：

```
Error creating class: { code: '42P01', message: 'relation "public.classes" does not exist' }
```

这将告诉我们确切的问题是什么。

### 方法2: 查看浏览器控制台

1. 按F12打开开发者工具
2. 点击 "Console" 标签
3. 查看是否有红色错误信息
4. 点击 "Network" 标签
5. 刷新页面，点击 "Create Class"
6. 查看最新的 `/teacher/classes` 请求
7. 点击请求，查看响应内容

### 方法3: 查看Supabase日志

1. 访问: https://supabase.com/dashboard/project/lhkyjculexeyfswiursm/logs
2. 查看最近的错误日志
3. 寻找数据库相关的错误

## 🎯 最可能的3个问题

### 问题1: classes表不存在

**症状**: 后端日志显示 "relation does not exist"  
**解决**: 运行 `db_scripts/fix_classes_setup.sql`

### 问题2: RLS策略阻止插入

**症状**: 后端日志显示 "new row violates row-level security policy"  
**解决**: 确保运行了 `fix_classes_setup.sql` 中的策略设置部分

### 问题3: 后端未运行或环境变量错误

**症状**: 浏览器显示 "Network error" 或无法连接到后端  
**解决**: 
1. 确认后端在localhost:3000运行
2. 检查环境变量配置
3. 重启后端服务

## 📝 最小可运行测试

如果你仍然遇到问题，运行这个简单测试：

### 在Supabase SQL Editor中测试插入：

```sql
-- 测试直接插入一个课程
INSERT INTO public.classes (code, name, description, color, location, teacher)
VALUES ('TEST-DIRECT', 'Direct Test Class', 'Testing direct insert', '#667eea', 'Room 999', 'System')
RETURNING *;
```

如果这个插入成功了，说明表结构和RLS都没问题。

然后尝试通过后端API：

```bash
# 1. 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"你的邮箱","password":"你的密码","role":"teacher"}'

# 2. 复制返回的access_token，用它替换下面的YOUR_TOKEN
curl -X POST http://localhost:3000/api/teacher/classes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"CURL-TEST","name":"Curl Test","description":"Testing via curl","color":"#667eea","location":"Room 1"}'
```

这将帮助我们确定问题是出在前端、后端API还是数据库。

## ✅ 成功标志

当一切正常时，你应该看到：

1. ✅ 后端终端显示请求日志，没有错误
2. ✅ 浏览器显示 "Class created successfully!" 的alert
3. ✅ 模态框关闭
4. ✅ 课程出现在列表中
5. ✅ Supabase中能看到新创建的课程记录

## 📞 仍然有问题？

如果以上所有步骤都尝试了仍然失败，请提供：

1. **后端终端**的错误日志（完整信息）
2. **浏览器控制台**的错误信息（F12 → Console和Network标签）
3. **Supabase SQL Editor**中运行 `SELECT * FROM public.classes LIMIT 5;` 的结果

这将帮助我们准确定位问题。

