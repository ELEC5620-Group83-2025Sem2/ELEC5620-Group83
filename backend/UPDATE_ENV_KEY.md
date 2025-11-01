# 🔑 更新 SUPABASE_KEY 为 service_role key

## 问题

您的 `.env` 文件中使用的是 **anon key**，而不是 **service_role key**。

anon key 受 RLS（行级安全）策略限制，无法查询所有数据，这就是为什么管理员界面看不到账户的原因。

## 解决步骤

### 第1步：获取 service_role key

1. 打开 Supabase Dashboard: https://supabase.com/dashboard/project/lhkyjculexeyfswiursm
2. 点击左侧 **Settings** (齿轮图标)
3. 点击 **API**
4. 在 **Project API keys** 部分，找到标记为 **service_role** 的 key
5. 这个 key 通常标记为 "secret" 或显示为 "service_role"
6. **复制这个完整的 key**

### 第2步：更新 .env 文件

编辑 `backend/.env` 文件，将 `SUPABASE_KEY` 的值替换为 service_role key：

**当前（错误）：**
```env
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxoa3lqY3VsZXhleWZzd2l1cnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0OTA2OTEsImV4cCI6MjA3NjA2NjY5MX0.XqEZ64SUrtyesQCjCPc7so651sJryRqU6OmuAgEZcFY
```

**应该改为（service_role key）：**
```env
SUPABASE_KEY=你的service_role_key_粘贴在这里
```

### 第3步：验证 key 类型

更新后，重启后端，应该看到：
```
✅ CORRECT: Using service_role key
```

而不是：
```
❌ ERROR: You are using the ANON key instead of SERVICE_ROLE key!
```

### 第4步：重启后端并测试

```bash
# 停止后端（Ctrl+C）
cd backend
npm start
```

现在应该能正常看到所有账户了！

## 重要提示

- **anon key**：用于前端，受 RLS 限制，无法访问所有数据
- **service_role key**：用于后端，可以绕过 RLS，管理员操作必需

**⚠️ 安全提示**：
- service_role key 具有完整数据库访问权限
- 不要提交到 git
- 不要分享给其他人
- 只在后端服务器使用

