# CI/CD 设置指南

## 📋 概述

本项目使用 GitHub Actions 实现自动化测试和部署。

## 🔄 工作流程

### 触发条件

- **Push** 到 `main`, `develop`, `Ziqi` 分支
- **Pull Request** 到 `main`, `develop` 分支

### 执行流程

```
┌─────────────────────────────────────────┐
│         Push 代码到 GitHub              │
└──────────────┬──────────────────────────┘
               │
      ┌────────┴────────┐
      │                 │
┌─────▼─────┐     ┌────▼──────┐
│ 后端测试   │     │ 前端测试  │
│  (13个)    │     │  (5个)    │
└─────┬─────┘     └────┬──────┘
      │                │
      └────────┬────────┘
               │
        ✅ 测试通过
               │
         ┌─────▼──────┐
         │  前端构建   │
         └─────┬──────┘
               │
        ┌──────▼────────┐
        │  代码质量检查  │
        │  安全审计      │
        └──────┬────────┘
               │
      ┌────────▼─────────┐
      │ 部署（仅 main）  │
      └──────────────────┘
```

## 📁 工作流文件

### `.github/workflows/CICD.yml`

包含以下 Jobs：

#### 1. **backend-test** - 后端测试
- 安装依赖
- 运行 13 个测试用例
- 验证后端功能

#### 2. **frontend-test** - 前端测试
- 安装依赖
- 运行 5 个测试用例
- 验证前端功能

#### 3. **frontend-build** - 前端构建
- 依赖 `frontend-test` 通过
- 构建生产版本
- 上传构建产物（保留 7 天）

#### 4. **code-quality** - 代码质量
- 检查 TODO 注释
- 统计代码行数

#### 5. **security** - 安全审计
- 运行 `npm audit`
- 检查依赖漏洞

#### 6. **deploy** - 部署
- 仅在 `main` 分支触发
- 依赖所有测试通过
- 准备部署（需配置）

## 🔐 所需的 GitHub Secrets

### 基础配置（可选）

如果需要部署到 Vercel，添加：

| Secret 名称 | 描述 | 获取方式 |
|------------|------|---------|
| `VERCEL_TOKEN` | Vercel 部署令牌 | Vercel Dashboard → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel 组织 ID | Vercel 项目设置 |
| `VERCEL_PROJECT_ID` | Vercel 项目 ID | Vercel 项目设置 |

### 添加 Secrets 步骤

1. 进入 GitHub 仓库
2. Settings → Secrets and variables → Actions
3. 点击 "New repository secret"
4. 输入名称和值
5. 点击 "Add secret"

## ✅ 测试内容

### 后端测试（13个）
- ✅ 基础 JavaScript 功能（5个）
- ✅ ErrorResponse 工具类（4个）
- ✅ 模块加载和环境配置（4个）

### 前端测试（5个）
- ✅ 基础 JavaScript 功能（5个）

### 总计
- **18 个测试用例**
- **全部自动运行**
- **无覆盖率限制**

## 🚀 使用方式

### 1. 本地测试

提交代码前先本地测试：

```bash
# Windows
.\test-all.ps1

# Linux/Mac
./test-all.sh
```

### 2. 提交代码

```bash
git add .
git commit -m "feat: your changes"
git push
```

### 3. 查看 CI/CD 状态

- 进入 GitHub 仓库
- 点击 **Actions** 选项卡
- 查看最新的 workflow 运行状态

### 4. 状态徽章

在 README.md 中添加状态徽章：

```markdown
![CI/CD](https://github.com/YOUR_USERNAME/ELEC5620-Group83/actions/workflows/CICD.yml/badge.svg)
```

## 📊 CI/CD 优势

- ✅ **自动化测试**: 每次 push 自动运行
- ✅ **快速反馈**: < 5 分钟完成所有检查
- ✅ **防止错误**: 测试失败时阻止合并
- ✅ **代码质量**: 自动检查和审计
- ✅ **自动部署**: main 分支自动部署

## 🔧 自定义配置

### 修改触发分支

编辑 `.github/workflows/CICD.yml`:

```yaml
on:
  push:
    branches: [ your-branch-name ]
```

### 添加部署步骤

取消注释 `deploy` job 中的部署步骤，或添加自定义部署：

```yaml
- name: Deploy to Server
  run: |
    # 你的部署命令
```

### 添加通知

可以添加 Slack/Discord 通知：

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🐛 故障排除

### 问题: Actions 未运行

**解决**: 
- 确保 `.github/workflows/CICD.yml` 已提交
- 检查分支名称是否匹配

### 问题: 测试失败

**解决**:
- 本地运行 `npm test` 确认通过
- 检查 Actions 日志查看详细错误

### 问题: 依赖安装失败

**解决**:
- 确保 `package-lock.json` 已提交
- 运行 `npm ci` 而不是 `npm install`

## 📝 工作流状态

运行后，你会在 Actions 页面看到：

- 🟢 绿色勾号 = 全部通过
- 🔴 红色叉号 = 有失败
- 🟡 黄色圆点 = 正在运行

点击每个 workflow 可以查看详细日志。

## 🎯 下一步

1. ✅ Workflow 文件已创建
2. 提交并推送代码到 GitHub
3. 在 Actions 选项卡查看运行结果
4. 根据需要配置部署

准备好了吗？提交代码后，CI/CD 会自动运行！

