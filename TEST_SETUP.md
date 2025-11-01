# 测试环境设置指南

## 快速开始

### 1. 安装依赖

```bash
# 后端测试依赖
cd backend
npm install

# 前端测试依赖
cd ../frontend
npm install
```

### 2. 配置测试环境变量

#### 后端

在 `backend/` 目录创建 `.env.test` 文件（基于 `.env.test.example`）：

```bash
cd backend
cp .env.test.example .env.test
```

编辑 `.env.test` 文件，添加你的测试配置：

```env
NODE_ENV=test
SUPABASE_URL=https://your-test-project.supabase.co
SUPABASE_ANON_KEY=your-test-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-test-service-role-key
```

#### 前端

前端测试通常使用 mock 数据，不需要额外配置。

### 3. 运行测试

#### 后端测试

```bash
cd backend

# 运行所有测试
npm test

# 监听模式（推荐开发时使用）
npm run test:watch

# 生成覆盖率报告
npm run test:ci
```

#### 前端测试

```bash
cd frontend

# 运行所有测试
npm test

# 测试 UI 界面
npm run test:ui

# 生成覆盖率报告
npm run test:coverage
```

#### 运行所有测试（Windows）

```powershell
.\test-all.ps1
```

#### 运行所有测试（Linux/Mac）

```bash
chmod +x test-all.sh
./test-all.sh
```

## 测试结构

### 后端测试结构

```
backend/
├── __tests__/
│   ├── setup.js                 # 全局测试配置
│   ├── unit/                    # 单元测试
│   │   ├── utils/
│   │   │   └── errorResponse.test.js
│   │   ├── middleware/
│   │   │   └── auth.test.js
│   │   └── controllers/
│   │       └── teacher/
│   │           ├── assignments.test.js
│   │           └── students.test.js
│   └── integration/             # 集成测试
│       └── auth.test.js
└── jest.config.js               # Jest 配置
```

### 前端测试结构

```
frontend/
├── src/
│   └── __tests__/
│       ├── setup.js             # 全局测试配置
│       ├── components/          # 组件测试
│       │   ├── ProtectedRoute.test.jsx
│       │   └── teacher/
│       │       └── StudentsView.test.jsx
│       └── services/            # 服务测试
│           └── authService.test.js
└── vitest.config.js             # Vitest 配置
```

## 编写测试指南

### 后端测试示例

#### 1. 工具函数测试

```javascript
// __tests__/unit/utils/myUtil.test.js
import { describe, it, expect } from '@jest/globals';
import { myFunction } from '../../../utils/myUtil.js';

describe('myFunction', () => {
  it('should return correct result', () => {
    expect(myFunction(1, 2)).toBe(3);
  });
  
  it('should handle edge cases', () => {
    expect(myFunction(null, 2)).toBeNull();
  });
});
```

#### 2. API Controller 测试

```javascript
// __tests__/unit/controllers/myController.test.js
import { describe, it, expect, jest } from '@jest/globals';

// Mock Supabase
jest.mock('../../../clients/supabaseClient.js', () => ({
  getSupabaseClient: jest.fn()
}));

describe('My Controller', () => {
  let mockReq, mockRes;
  
  beforeEach(() => {
    mockReq = { user: { id: 'user-123' }, body: {}, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  it('should handle request correctly', async () => {
    // Test logic
  });
});
```

### 前端测试示例

#### 1. 组件测试

```javascript
// src/__tests__/components/MyComponent.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../../components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

#### 2. 用户交互测试

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyButton from '../../components/MyButton';

describe('MyButton', () => {
  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<MyButton onClick={handleClick}>Click Me</MyButton>);
    
    await user.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 覆盖率要求

### 目标

- **总体覆盖率**: ≥ 60%
- **分支覆盖率**: ≥ 60%
- **函数覆盖率**: ≥ 60%
- **语句覆盖率**: ≥ 60%

### 查看覆盖率报告

#### 后端

```bash
cd backend
npm run test:ci
open coverage/lcov-report/index.html  # Mac
start coverage/lcov-report/index.html  # Windows
```

#### 前端

```bash
cd frontend
npm run test:coverage
open coverage/index.html  # Mac
start coverage/index.html  # Windows
```

## CI/CD 配置

### GitHub Secrets 配置

在 GitHub 仓库设置中添加以下 Secrets：

1. 进入仓库页面
2. Settings → Secrets and variables → Actions
3. 点击 "New repository secret"
4. 添加以下 Secrets：

| Secret 名称 | 说明 |
|------------|------|
| `SUPABASE_URL` | Supabase 项目 URL |
| `SUPABASE_ANON_KEY` | Supabase Anonymous Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key |
| `OPENAI_API_KEY` | OpenAI API Key（可选） |

### 工作流说明

#### CI Pipeline (`.github/workflows/ci.yml`)

- 触发: Push 到 main/develop/Ziqi 或 Pull Request
- 执行:
  - 后端测试（Node 18 & 20）
  - 前端测试（Node 18 & 20）
  - 前端构建
  - 代码检查
  - 安全审计

#### Deploy Pipeline (`.github/workflows/deploy.yml`)

- 触发: Push 到 main 或手动触发
- 执行:
  - 运行所有测试
  - 构建应用
  - 部署到生产环境

#### Coverage Pipeline (`.github/workflows/test-coverage.yml`)

- 触发: Push 或 Pull Request
- 执行:
  - 生成覆盖率报告
  - 上传到 Codecov
  - 生成覆盖率徽章

## 常见问题

### Q: 后端测试失败 - "Cannot use import statement"

**A**: 确保使用 `NODE_OPTIONS=--experimental-vm-modules jest`

在 `package.json` 中已配置，直接使用 `npm test` 即可。

### Q: 前端测试失败 - "document is not defined"

**A**: 确保 `vitest.config.js` 中设置了 `environment: 'jsdom'`

### Q: 测试超时

**A**: 增加超时时间：

```javascript
// 在测试文件中
jest.setTimeout(10000); // 10秒

// 或在 setup.js 中全局设置
```

### Q: Mock 不工作

**A**: 确保 mock 在导入被测试模块之前：

```javascript
// ✅ 正确
vi.mock('./myModule');
import { myFunction } from './myModule';

// ❌ 错误
import { myFunction } from './myModule';
vi.mock('./myModule');
```

### Q: GitHub Actions 失败

**A**: 检查：
1. Secrets 是否正确配置
2. `package-lock.json` 是否已提交
3. Node 版本是否兼容
4. 依赖是否有安全漏洞

## 测试最佳实践

1. **AAA 模式**: Arrange（准备）, Act（执行）, Assert（断言）
2. **一个测试只测一件事**
3. **使用描述性的测试名称**
4. **Mock 外部依赖**
5. **避免测试实现细节**
6. **保持测试独立**
7. **定期运行测试**
8. **保持高覆盖率**

## 持续改进

1. 定期review测试代码
2. 增加测试覆盖率
3. 添加E2E测试
4. 优化CI/CD流程
5. 监控测试执行时间

## 参考文档

- [TESTING.md](./TESTING.md) - 完整测试文档
- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [GitHub Actions](https://docs.github.com/en/actions)

