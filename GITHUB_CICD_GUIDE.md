# GitHub CI/CD 运行指南

## 🚀 步骤 1: 提交代码到 GitHub

### 1.1 检查当前状态

```bash
git status
```

### 1.2 添加所有更改

```bash
git add .
```

### 1.3 提交更改

```bash
git commit -m "feat: add comprehensive testing and CI/CD pipeline"
```

### 1.4 推送到 GitHub

```bash
# 推送到当前分支 (Ziqi)
git push origin Ziqi

# 或推送到其他分支
git push origin main
```

## 📡 步骤 2: 查看 CI/CD 运行状态

### 2.1 访问 GitHub Actions

1. 打开浏览器，访问你的 GitHub 仓库
2. 点击顶部的 **Actions** 选项卡
3. 你会看到 "CI/CD Pipeline" 工作流正在运行

### 2.2 查看运行详情

点击最新的 workflow 运行，你会看到：

```
CI/CD Pipeline
├── Backend Tests ✓
├── Frontend Tests ✓
├── Frontend Build ✓
├── Code Quality ✓
├── Security ✓
└── Deploy (仅 main 分支)
```

### 2.3 查看测试输出

1. 点击 "Backend Tests" 查看后端测试详情
2. 点击 "Frontend Tests" 查看前端测试详情
3. 展开每个步骤查看详细日志

## ✅ 步骤 3: 验证测试通过

### 成功标志

- 🟢 **绿色勾号**: 所有测试通过
- 每个 Job 显示 ✓ 标记
- 可以看到测试数量：
  - Backend: 158 tests passed
  - Frontend: 87 tests passed

### 失败情况

- 🔴 **红色叉号**: 测试失败
- 点击查看失败的测试用例
- 查看错误信息并修复

## 🎯 快速操作指南

### 方案 A: 命令行操作

```bash
# 1. 确保在项目根目录
cd "d:\5620 project\ELEC5620-Group83"

# 2. 查看当前分支
git branch

# 3. 添加所有文件
git add .

# 4. 提交
git commit -m "feat: add 245 tests and CI/CD"

# 5. 推送
git push origin Ziqi
```

### 方案 B: VS Code 操作

1. 打开 VS Code 的源代码管理面板（Ctrl+Shift+G）
2. 点击 "+" 暂存所有更改
3. 输入提交消息: "feat: add 245 tests and CI/CD"
4. 点击 "✓ 提交"
5. 点击 "..." → "推送"

## 📱 查看实时进度

### 在 GitHub 网页查看

1. 打开: `https://github.com/YOUR_USERNAME/ELEC5620-Group83/actions`
2. 点击最新的 workflow 运行
3. 实时查看测试进度

### 预期执行时间

- Backend Tests: ~30秒
- Frontend Tests: ~30秒
- Frontend Build: ~1分钟
- 总计: ~3-5分钟

## 🔔 可选: 设置通知

### GitHub 通知

GitHub 会自动发送邮件通知（如果失败）。

### 在仓库页面查看

仓库首页会显示最新的 CI/CD 状态徽章：

![CI/CD Status](badge示例)

## 🐛 常见问题

### Q: 看不到 Actions 选项卡？

**A**: 
- 确保已推送代码到 GitHub
- 检查 `.github/workflows/CICD.yml` 文件已提交

### Q: Workflow 未自动运行？

**A**:
- 检查推送的分支名称（应该是 main/develop/Ziqi）
- 查看 workflow 文件的触发条件

### Q: 测试在 GitHub 上失败，本地却通过？

**A**:
- 检查 Node.js 版本是否一致
- 查看 GitHub Actions 日志中的详细错误
- 确保所有文件都已提交

## 📊 查看测试报告

### 在 Actions 页面

点击成功的 workflow run，你会看到：

```
✓ Backend Tests
  - Test Suites: 11 passed
  - Tests: 158 passed
  - Duration: 0.8s

✓ Frontend Tests  
  - Test Files: 7 passed
  - Tests: 87 passed
  - Duration: 1.1s

✓ Frontend Build
  - Build completed successfully
  - Artifacts uploaded

✓ Code Quality
  - TODO comments checked
  - Lines of code counted

✓ Security
  - npm audit passed
```

## 🎉 成功后

当所有测试通过后：

1. PR 会显示绿色勾号
2. 可以安全合并代码
3. main 分支会自动触发部署（如果配置）

## 🔗 相关文档

- [CICD_SETUP.md](./CICD_SETUP.md) - CI/CD 详细配置
- [TESTS_SUMMARY.md](./TESTS_SUMMARY.md) - 测试文件总结
- [TESTING.md](./TESTING.md) - 完整测试文档

---

## 立即开始！

```bash
git add .
git commit -m "feat: add 245 tests and CI/CD pipeline"
git push origin Ziqi
```

然后访问: `https://github.com/YOUR_USERNAME/ELEC5620-Group83/actions`

查看测试运行！🚀

