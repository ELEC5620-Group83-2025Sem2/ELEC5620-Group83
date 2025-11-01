# 🔧 修复缺失的角色分配

## 问题描述

数据库中 `profiles` 表有用户数据，但 `profile_roles` 表中没有角色记录，导致管理员界面显示为空。

## 解决方案

### 方法1：使用 SQL 脚本（推荐）

1. 打开 Supabase Dashboard
2. 进入 **SQL Editor**
3. 复制并运行 `db_scripts/fix_existing_users_roles.sql` 的内容

该脚本会：
- 为所有没有角色的用户分配默认 `student` 角色
- 显示角色分布统计
- 不会覆盖已有的角色

### 方法2：使用 Node.js 脚本

在项目根目录运行：

```bash
cd backend
node fix-missing-roles.js
```

## 验证修复

运行后，检查：
1. 刷新管理员页面，应该能看到学生账户
2. 后端日志应该显示找到的角色数量
3. 在 Supabase 中检查 `profile_roles` 表应该有数据了

## 重要提示

- 脚本会为所有用户分配默认 `student` 角色
- 如果某些用户应该是 `teacher` 或 `admin`，需要：
  1. 通过管理员界面手动编辑
  2. 或者在 Supabase 中手动修改 `profile_roles` 表

## 手动分配角色

如果需要手动分配角色，在 Supabase SQL Editor 中运行：

```sql
-- 为特定用户分配 teacher 角色
INSERT INTO profile_roles (profile_id, role)
VALUES ('user-id-here', 'teacher')
ON CONFLICT (profile_id, role) DO NOTHING;

-- 为特定用户分配 admin 角色
INSERT INTO profile_roles (profile_id, role)
VALUES ('user-id-here', 'admin')
ON CONFLICT (profile_id, role) DO NOTHING;
```


