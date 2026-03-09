---
title: "TypeScript 實用技巧：提升程式碼品質"
description: "分享幾個實用的 TypeScript 技巧，包含型別工具、泛型模式、以及常見陷阱。"
pubDate: 2026-03-07
category: "技術"
tags: ["typescript", "javascript", "frontend"]
---

## 型別工具（Utility Types）

TypeScript 內建了許多實用的型別工具，善加利用可以大幅減少重複的型別定義。

### Partial 與 Required

```typescript
interface User {
  name: string;
  email: string;
  age: number;
}

// 所有欄位變成可選
type UpdateUser = Partial<User>;

// 所有欄位變成必填
type StrictUser = Required<User>;
```

### Pick 與 Omit

```typescript
// 只保留指定欄位
type UserPreview = Pick<User, 'name' | 'email'>;

// 排除指定欄位
type UserWithoutAge = Omit<User, 'age'>;
```

## 泛型模式

### 通用 API 回應型別

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

### 受限泛型（Constrained Generics）

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { name: 'CCY', email: 'ccy@example.com', age: 25 };
const name = getProperty(user, 'name'); // type: string
```

## 常見陷阱

### 1. 不要濫用 `any`

```typescript
// ❌ 避免
function process(data: any) {
  return data.value;
}

// ✅ 使用 unknown + 型別守衛
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: unknown }).value;
  }
  throw new Error('Invalid data');
}
```

### 2. 善用 `as const`

```typescript
// 型別為 string[]
const colors = ['red', 'green', 'blue'];

// 型別為 readonly ['red', 'green', 'blue']
const colors = ['red', 'green', 'blue'] as const;
```

## 結語

TypeScript 的型別系統非常強大，花時間學習這些進階用法，能讓你的程式碼更安全、更易於維護。
