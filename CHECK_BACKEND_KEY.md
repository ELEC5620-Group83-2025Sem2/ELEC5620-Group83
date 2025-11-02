# 检查后端密钥配置

## 问题诊断

从后端日志看到这个错误：
```
❌ ERROR: You are using the ANON key instead of SERVICE_ROLE key!
```

这是一个**重要问题**！后端必须使用 SERVICE_ROLE key，否则会有权限问题。

## 解决方案

### 1. 获取正确的 SERVICE_ROLE key

在 Supabase Dashboard：
1. 进入你的项目
2. 点击左侧 **Settings** (齿轮图标)
3. 点击 **API**
4. 找到 **service_role** key (标记为 "secret")
5. 复制这个 key

**注意**：
- ❌ 不要用 `anon` key (这是给前端用的)
- ✅ 要用 `service_role` key (这是给后端用的)

### 2. 更新 backend/.env 文件

打开 `backend/.env`，确保使用 SERVICE_ROLE key：

```env
SUPABASE_URL=https://你的项目.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M... (很长的key，以service_role开头)
OPENAI_API_KEY=sk-你的OpenAI密钥
```

### 3. 重启后端服务器

在后端终端按 `Ctrl+C` 停止，然后重新运行：

```bash
npm run dev
```

### 4. 验证

重启后，应该看到：
```
✅ Supabase client initialized
🔑 Key starts with: eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...
✅ Database connection successful!
```

**不应该再看到** "using the ANON key" 的错误。

## 为什么这很重要？

- **ANON key**: 有限权限，受 RLS 策略限制，适合前端
- **SERVICE_ROLE key**: 完全权限，绕过 RLS，适合后端管理操作

后端需要完全权限来创建 practice assignments 和题目。

## 完整测试步骤

1. ✅ 更新 backend/.env 使用 service_role key
2. ✅ 重启后端服务器
3. ✅ 在 Supabase 运行权限 SQL 脚本
4. ✅ 刷新前端页面
5. ✅ 点击 "Start Practice Questions" 按钮
6. ✅ 等待生成完成

应该就可以了！

