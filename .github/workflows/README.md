# GitHub Actions 工作流说明

## 工作流文件

### 1. `ci.yml` - 持续集成流程

**触发条件**:
- Push 到 `main`、`develop`、`Ziqi` 分支
- Pull Request 到 `main` 或 `develop`

**包含的 Jobs**:

#### `backend-test`
- 运行后端单元测试和集成测试
- 在 Node.js 18.x 和 20.x 上测试
- 生成代码覆盖率报告
- 上传覆盖率到 Codecov

#### `frontend-test`
- 运行前端组件测试和服务测试
- 在 Node.js 18.x 和 20.x 上测试
- 生成代码覆盖率报告
- 上传覆盖率到 Codecov

#### `frontend-build`
- 依赖 `frontend-test` 成功
- 构建生产版本
- 上传构建产物（保留 7 天）

#### `lint`
- 代码风格检查（如果配置了 ESLint）

#### `security`
- 运行 `npm audit` 检查依赖漏洞
- 允许 moderate 级别的漏洞（警告但不失败）

### 2. `deploy.yml` - 部署流程

**触发条件**:
- Push 到 `main` 分支
- 手动触发（workflow_dispatch）

**执行步骤**:
1. 安装后端依赖并测试
2. 安装前端依赖并构建
3. 部署到生产环境
4. 通知部署状态

**注意**: 需要配置实际的部署步骤（Vercel、Netlify、自定义服务器等）

### 3. `test-coverage.yml` - 覆盖率报告

**触发条件**:
- Push 或 Pull Request

**执行步骤**:
1. 运行后端和前端测试并生成覆盖率
2. 上传到 Codecov
3. 生成覆盖率徽章
4. 提交徽章到仓库（仅 main 分支）

## 所需的 GitHub Secrets

在仓库设置中配置以下 Secrets：

### 必需 Secrets

| Secret 名称 | 描述 | 示例 |
|------------|------|------|
| `SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase Anonymous Key | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key | `eyJ...` |

### 可选 Secrets

| Secret 名称 | 描述 | 用途 |
|------------|------|------|
| `OPENAI_API_KEY` | OpenAI API Key | AI 功能测试 |
| `CODECOV_TOKEN` | Codecov 上传 Token | 私有仓库上传覆盖率 |
| `VERCEL_TOKEN` | Vercel 部署 Token | 自动部署到 Vercel |

## 配置 Secrets 步骤

1. 进入 GitHub 仓库页面
2. 点击 **Settings** 选项卡
3. 左侧菜单选择 **Secrets and variables** → **Actions**
4. 点击 **New repository secret**
5. 输入 Secret 名称和值
6. 点击 **Add secret**

## 查看工作流状态

### 在 GitHub UI 中

1. 进入仓库页面
2. 点击 **Actions** 选项卡
3. 查看最近的工作流运行情况

### 通过徽章

在 README.md 中添加状态徽章：

```markdown
![CI Status](https://github.com/YOUR_USERNAME/ELEC5620-Group83/workflows/CI%2FCD%20Pipeline/badge.svg)
```

## 手动触发工作流

某些工作流支持手动触发：

1. 进入 **Actions** 选项卡
2. 选择要运行的工作流
3. 点击 **Run workflow** 按钮
4. 选择分支
5. 点击 **Run workflow** 确认

## 调试工作流

### 查看日志

1. 进入 **Actions** 选项卡
2. 点击失败的工作流运行
3. 点击失败的 Job
4. 展开失败的 Step 查看详细日志

### 常见问题

**问题**: Secrets 未定义

```
Error: Input required and not supplied: SUPABASE_URL
```

**解决**: 在仓库设置中添加所需的 Secret

**问题**: 测试超时

```
Error: Test suite failed to run within timeout
```

**解决**: 增加 `jest.setTimeout()` 或 `testTimeout` 配置

**问题**: 依赖安装失败

```
Error: npm ci failed
```

**解决**: 确保 `package-lock.json` 已提交且是最新的

## 最佳实践

1. **保持工作流简洁**: 每个 Job 做一件事
2. **使用缓存**: 缓存 node_modules 加速构建
3. **并行执行**: 利用矩阵策略并行测试
4. **失败快速**: 一旦测试失败立即停止
5. **安全第一**: 敏感信息使用 Secrets
6. **文档完善**: 更新工作流时更新文档

## 扩展功能

### 添加代码质量检查

```yaml
- name: Run ESLint
  run: npm run lint
```

### 添加性能测试

```yaml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
```

### 添加通知

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 参考资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Codecov 文档](https://docs.codecov.com/)
- [Jest CI 配置](https://jestjs.io/docs/cli#--ci)

