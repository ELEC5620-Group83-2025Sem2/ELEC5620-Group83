# 测试快速参考卡

## 🚀 快速命令

### 后端测试

| 命令 | 描述 |
|------|------|
| `npm test` | 运行所有测试 |
| `npm run test:watch` | 监听模式 |
| `npm run test:unit` | 只运行单元测试 |
| `npm run test:integration` | 只运行集成测试 |
| `npm run test:ci` | CI 模式（含覆盖率） |

### 前端测试

| 命令 | 描述 |
|------|------|
| `npm test` | 运行所有测试 |
| `npm run test:ui` | 测试 UI 界面 |
| `npm run test:coverage` | 生成覆盖率 |
| `npm run test:ci` | CI 模式 |

### 全局测试

| 命令 | 描述 |
|------|------|
| `./test-all.sh` | 运行所有测试（Linux/Mac） |
| `.\test-all.ps1` | 运行所有测试（Windows） |

## 📝 测试模板

### 单元测试（Backend）

```javascript
import { describe, it, expect } from '@jest/globals';

describe('Feature Name', () => {
  it('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = yourFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### 组件测试（Frontend）

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## 🎯 覆盖率目标

| 指标 | 目标 |
|------|------|
| 语句覆盖率 | ≥ 60% |
| 分支覆盖率 | ≥ 60% |
| 函数覆盖率 | ≥ 60% |
| 行覆盖率 | ≥ 60% |

## 🔧 常用断言

### Jest/Vitest 断言

```javascript
expect(value).toBe(expected)           // 严格相等
expect(value).toEqual(expected)        // 深度相等
expect(value).toBeTruthy()             // 真值
expect(value).toBeFalsy()              // 假值
expect(value).toBeNull()               // null
expect(value).toBeUndefined()          // undefined
expect(array).toContain(item)          // 包含元素
expect(fn).toHaveBeenCalled()          // 函数被调用
expect(fn).toHaveBeenCalledWith(arg)   // 函数被特定参数调用
```

### React Testing Library

```javascript
screen.getByText('text')               // 获取文本元素
screen.getByRole('button')             // 获取角色元素
screen.getByPlaceholderText('...')     // 获取占位符元素
screen.getByTestId('test-id')          // 获取 data-testid 元素
expect(element).toBeInTheDocument()    // 元素存在
expect(element).toHaveClass('class')   // 有特定类名
expect(element).toBeDisabled()         // 被禁用
```

## 🐛 Mock 模式

### Mock 函数

```javascript
const mockFn = vi.fn();                // 创建 mock
mockFn.mockReturnValue(42);            // 返回固定值
mockFn.mockResolvedValue(data);        // 返回 Promise
mockFn.mockRejectedValue(error);       // 拒绝 Promise
```

### Mock 模块

```javascript
vi.mock('./module', () => ({
  default: {
    method: vi.fn()
  }
}));
```

### Mock API

```javascript
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'test' })
  })
);
```

## ✅ CI/CD 检查清单

- [ ] 所有测试通过
- [ ] 覆盖率达标（≥60%）
- [ ] 无 linting 错误
- [ ] 无安全漏洞（critical/high）
- [ ] 构建成功
- [ ] GitHub Secrets 已配置
- [ ] 文档已更新

## 🔗 相关文档

- [TESTING.md](./TESTING.md) - 完整测试文档
- [TEST_SETUP.md](./TEST_SETUP.md) - 测试环境设置
- [README.md](./README.md) - 项目说明

## 💡 小贴士

1. **先写测试，后写代码** (TDD)
2. **保持测试简单**
3. **测试行为，不是实现**
4. **定期运行测试**
5. **提交前确保测试通过**
6. **不要跳过失败的测试**
7. **Mock 外部依赖**
8. **使用有意义的测试名称**

