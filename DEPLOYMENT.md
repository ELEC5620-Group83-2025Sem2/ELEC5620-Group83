# 部署指南

## 部署选项

### 选项 1: Vercel (推荐前端)

#### 前端部署到 Vercel

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **部署前端**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **配置环境变量**
   在 Vercel Dashboard 中设置环境变量

#### 后端部署到 Vercel

```bash
cd backend
vercel --prod
```

### 选项 2: Railway

1. **连接 GitHub 仓库**
   - 访问 [railway.app](https://railway.app)
   - 创建新项目
   - 连接 GitHub 仓库

2. **配置服务**
   - 添加 Backend 服务
   - 添加 Frontend 服务
   - 配置环境变量

3. **部署**
   - Push 到 main 分支自动部署

### 选项 3: 自定义服务器

#### 准备服务器

```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2（进程管理器）
npm install -g pm2

# 安装 Nginx（反向代理）
sudo apt-get install nginx
```

#### 部署后端

```bash
# 克隆代码
git clone https://github.com/YOUR_USERNAME/ELEC5620-Group83.git
cd ELEC5620-Group83/backend

# 安装依赖
npm ci --production

# 配置环境变量
nano .env

# 启动应用
pm2 start server.js --name hsc-power-backend

# 保存 PM2 配置
pm2 save
pm2 startup
```

#### 部署前端

```bash
cd ../frontend

# 构建
npm ci
npm run build

# 复制到 Nginx 目录
sudo cp -r dist/* /var/www/hsc-power/
```

#### 配置 Nginx

```nginx
# /etc/nginx/sites-available/hsc-power
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/hsc-power;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/hsc-power /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 环境变量配置

### 生产环境必需变量

#### 后端 (.env)

```env
NODE_ENV=production
PORT=3000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI (可选)
OPENAI_API_KEY=your-openai-api-key

# CORS (根据前端域名配置)
FRONTEND_URL=https://your-frontend-domain.com
```

#### 前端 (.env.production)

```env
VITE_API_URL=https://your-backend-domain.com/api
```

## 部署前检查清单

- [ ] 所有测试通过
- [ ] 生产环境变量已配置
- [ ] 数据库迁移已运行
- [ ] API 端点可访问
- [ ] CORS 配置正确
- [ ] SSL 证书已安装（HTTPS）
- [ ] 备份策略已制定
- [ ] 监控和日志已配置

## 自动化部署（GitHub Actions）

### 配置自动部署到 Vercel

更新 `.github/workflows/deploy.yml`:

```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    vercel-args: '--prod'
    working-directory: ./frontend
```

### 配置自动部署到自定义服务器

更新 `.github/workflows/deploy.yml`:

```yaml
- name: Deploy to Server
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USER }}
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    script: |
      cd /path/to/app
      git pull
      cd backend && npm ci && pm2 restart backend
      cd ../frontend && npm ci && npm run build
      sudo cp -r dist/* /var/www/hsc-power/
```

## 数据库迁移

### 运行初始化脚本

```sql
-- 在 Supabase SQL Editor 中按顺序运行：
1. db_scripts/init.sql
2. db_scripts/policies.sql
3. db_scripts/sample_classes.sql
4. db_scripts/populate_assignments.sql
```

### 自动化迁移

使用 Supabase CLI:

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref your-project-ref

# 推送迁移
supabase db push
```

## 监控和日志

### 后端日志

使用 PM2:
```bash
pm2 logs hsc-power-backend
pm2 monit
```

### 错误追踪

推荐集成 Sentry:

```bash
npm install @sentry/node
```

```javascript
// backend/server.js
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

## 性能优化

### 前端优化

- ✅ 代码分割（Vite 自动处理）
- ✅ 懒加载路由
- ✅ 图片优化
- ✅ CDN 部署静态资源

### 后端优化

- ✅ 启用 Gzip 压缩
- ✅ 使用数据库连接池
- ✅ 实施 API 速率限制
- ✅ 添加缓存层（Redis）

## 回滚策略

### Vercel

Vercel 自动保存每次部署，可以一键回滚：
1. 进入 Vercel Dashboard
2. 选择项目
3. 找到之前的部署
4. 点击 "Promote to Production"

### 自定义服务器

```bash
# 使用 Git 回滚
git checkout <previous-commit>
pm2 restart all

# 或使用 PM2 生态系统文件
pm2 reload ecosystem.config.js
```

## 安全建议

1. **使用 HTTPS**: 始终使用 SSL/TLS
2. **环境变量**: 敏感信息使用环境变量
3. **定期更新依赖**: `npm audit fix`
4. **启用 CORS**: 仅允许可信域名
5. **实施速率限制**: 防止 API 滥用
6. **数据备份**: 定期备份数据库
7. **监控异常**: 使用 Sentry 等工具

## 故障排除

### 前端无法连接后端

检查：
- 后端是否运行
- CORS 配置是否正确
- API URL 是否正确

### 数据库连接失败

检查：
- Supabase URL 和 Keys 是否正确
- 网络是否可达
- RLS 策略是否正确

### 部署失败

检查：
- 环境变量是否配置
- 构建是否成功
- 端口是否被占用
- 日志中的错误信息

## 扩展阅读

- [Vercel 部署文档](https://vercel.com/docs)
- [Railway 部署文档](https://docs.railway.app/)
- [PM2 文档](https://pm2.keymetrics.io/)
- [Nginx 配置](https://nginx.org/en/docs/)

