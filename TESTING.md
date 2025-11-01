# 测试文档 - HSC Power

## 概览

本项目包含完整的单元测试、集成测试和 CI/CD 流程配置。

## 目录结构

```
ELEC5620-Group83/
├── backend/
│   ├── __tests__/
│   │   ├── setup.js              # 测试环境配置
│   │   ├── unit/                 # 单元测试
│   │   │   ├── utils/
│   │   │   ├── middleware/
│   │   │   └── controllers/
│   │   └── integration/          # 集成测试
│   │       └── auth.test.js
│   ├── jest.config.js            # Jest 配置
│   └── .env.test.example         # 测试环境变量模板
├── frontend/
│   ├── src/
│   │   └── __tests__/
│   │       ├── setup.js          # 测试环境配置
│   │       ├── components/       # 组件测试
│   │       └── services/         # 服务测试
│   └── vitest.config.js          # Vitest 配置
└── .github/
    └── workflows/
        ├── ci.yml                # CI 测试流程
        └── deploy.yml            # 部署流程
```

## 后端测试

### 技术栈
- **Jest**: 测试框架
- **Supertest**: HTTP 集成测试
- **@jest/globals**: ES Modules 支持

### 运行测试

```bash
cd backend

# 运行所有测试
npm test

# 监听模式（开发时使用）
npm run test:watch

# 只运行单元测试
npm run test:unit

# 只运行集成测试
npm run test:integration

# CI 模式（生成覆盖率报告）
npm run test:ci
```

### 编写测试

#### 单元测试示例

```javascript
// __tests__/unit/utils/example.test.js
import { describe, it, expect } from '@jest/globals';
import { yourFunction } from '../../../utils/yourFile.js';

describe('Your Function', () => {
  it('should do something', () => {
    const result = yourFunction('input');
    expect(result).toBe('expected output');
  });
});
```

#### 集成测试示例

```javascript
// __tests__/integration/api.test.js
import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../../server.js';

describe('API Endpoint', () => {
  it('should return 200', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body.status).toBe('OK');
  });
});
```

### 测试覆盖率

- 目标覆盖率: **60%**
- 覆盖率报告: `backend/coverage/`
- 查看报告: 打开 `backend/coverage/lcov-report/index.html`

## 前端测试

### 技术栈
- **Vitest**: 快速的单元测试框架
- **React Testing Library**: React 组件测试
- **@testing-library/user-event**: 用户交互模拟
- **jsdom**: DOM 环境模拟

### 运行测试

```bash
cd frontend

# 运行所有测试
npm test

# 监听模式
npm run test:ui

# 生成覆盖率报告
npm run test:coverage

# CI 模式
npm run test:ci
```

### 编写测试

#### 组件测试示例

```javascript
// src/__tests__/components/YourComponent.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import YourComponent from '../../components/YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

#### 服务测试示例

```javascript
// src/__tests__/services/api.test.js
import { describe, it, expect, vi } from 'vitest';
import yourService from '../../services/yourService';

describe('Your Service', () => {
  it('should call API correctly', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      })
    );

    const result = await yourService.fetchData();
    expect(result.data).toBe('test');
  });
});
```

### 测试覆盖率

- 目标覆盖率: **60%**
- 覆盖率报告: `frontend/coverage/`

## CI/CD 流程

### GitHub Actions 工作流

#### 1. CI Pipeline (`.github/workflows/ci.yml`)

触发条件：
- Push 到 `main`、`develop`、`Ziqi` 分支
- 创建 Pull Request 到 `main` 或 `develop`

执行步骤：
1. **后端测试**
   - 在 Node.js 18 和 20 上测试
   - 运行单元测试和集成测试
   - 生成代码覆盖率报告
   - 上传到 Codecov

2. **前端测试**
   - 在 Node.js 18 和 20 上测试
   - 运行组件测试和服务测试
   - 生成代码覆盖率报告
   - 上传到 Codecov

3. **前端构建**
   - 构建生产版本
   - 上传构建产物

4. **代码检查**
   - 运行 linting（如果配置）

5. **安全审计**
   - 运行 `npm audit` 检查依赖漏洞

#### 2. Deploy Pipeline (`.github/workflows/deploy.yml`)

触发条件：
- Push 到 `main` 分支
- 手动触发

执行步骤：
1. 运行所有测试
2. 构建前端
3. 部署到生产环境

### 所需的 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

```
Settings → Secrets and variables → Actions → New repository secret
```

必需的 Secrets：
- `SUPABASE_URL`: Supabase 项目 URL
- `SUPABASE_ANON_KEY`: Supabase Anon Key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Service Role Key
- `OPENAI_API_KEY`: OpenAI API Key（可选）

可选的 Secrets（用于部署）：
- `VERCEL_TOKEN`: Vercel 部署 token
- `SSH_PRIVATE_KEY`: SSH 私钥（如果部署到自己的服务器）

## 本地测试最佳实践

### 开发流程

1. **编写代码前先写测试** (TDD)
   ```bash
   # 启动测试监听模式
   npm run test:watch
   ```

2. **编写代码**

3. **运行测试确保通过**
   ```bash
   npm test
   ```

4. **检查覆盖率**
   ```bash
   npm run test:coverage
   ```

5. **提交代码**
   ```bash
   git add .
   git commit -m "feat: add new feature with tests"
   git push
   ```

### 测试原则

1. **测试行为，不是实现**
2. **每个测试应该独立运行**
3. **使用描述性的测试名称**
4. **Mock 外部依赖（API、数据库等）**
5. **保持测试简单和可读**

## 持续集成状态徽章

在 README.md 中添加状态徽章：

```markdown
![CI Status](https://github.com/YOUR_USERNAME/ELEC5620-Group83/workflows/CI%2FCD%20Pipeline/badge.svg)
![Coverage](https://codecov.io/gh/YOUR_USERNAME/ELEC5620-Group83/branch/main/graph/badge.svg)
```

## 故障排除

### 后端测试失败

**问题**: ES Modules 错误
```
SyntaxError: Cannot use import statement outside a module
```

**解决**: 确保使用 `NODE_OPTIONS=--experimental-vm-modules jest`

**问题**: Supabase 连接失败

**解决**: 检查 `.env.test` 文件是否正确配置

### 前端测试失败

**问题**: `document is not defined`

**解决**: 确保 `vitest.config.js` 中设置了 `environment: 'jsdom'`

**问题**: React 组件渲染错误

**解决**: 确保使用 `BrowserRouter` 包裹需要路由的组件

### CI/CD 失败

**问题**: GitHub Secrets 未配置

**解决**: 在 GitHub 仓库设置中添加所需的 Secrets

**问题**: 依赖安装失败

**解决**: 确保 `package-lock.json` 已提交到仓库

## 下一步

1. **安装测试依赖**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **配置 GitHub Secrets**
   - 进入仓库设置添加所需的 Secrets

3. **运行本地测试**
   ```bash
   # 后端
   cd backend && npm test
   
   # 前端
   cd frontend && npm test
   ```

4. **推送代码触发 CI**
   ```bash
   git push
   ```

5. **查看 CI 状态**
   - GitHub → Actions 选项卡

## 扩展测试

### 添加 E2E 测试（可选）

可以使用 Playwright 或 Cypress 进行端到端测试：

```bash
# 安装 Playwright
npm install -D @playwright/test

# 运行 E2E 测试
npx playwright test
```

### 添加性能测试（可选）

使用 Lighthouse CI 进行性能测试：

```yaml
# .github/workflows/lighthouse.yml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    urls: |
      http://localhost:5173
    uploadArtifacts: true
```

## 参考资源

- [Jest 文档](https://jestjs.io/)
- [Vitest 文档](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

