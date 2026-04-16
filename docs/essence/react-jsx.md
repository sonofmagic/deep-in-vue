# React createElement 与 jsx 函数

这一页不是为了展开讲 React，而是为了帮助你在读 Vue 的 JSX / TSX、`h()` 和编译产物时，多一个非常重要的对照坐标。

最核心的一句话是：

> JSX 从来都不是浏览器原生语法，它总要先被编译成某种函数调用。

在 React 里，这个函数调用从早期的 `React.createElement`，逐步演进到了新的 `jsx` runtime。

## 旧模式：`React.createElement`

在 React 17 之前很长一段时间里，JSX 通常会被编译成：

```jsx
const element = <h1>Hello, world!</h1>
```

编译后更接近：

```js
const element = React.createElement('h1', null, 'Hello, world!')
```

这说明 JSX 本质上只是语法糖，真正落地的是函数调用。

## 新模式：`jsx` 函数

从 React 17 开始引入新的 JSX Transform，后续逐步成为主流推荐方式。

同样的代码：

```jsx
const element = <h1>Hello, world!</h1>
```

会被编译成类似：

```js
import { jsx } from 'react/jsx-runtime'

const element = jsx('h1', { children: 'Hello, world!' })
```

所以对比可以简单记成：

| 时代 | JSX 编译目标 |
| :-- | :-- |
| 旧模式 | `React.createElement(...)` |
| 新模式 | `jsx(...)` / `jsxs(...)` |

## 为什么 React 要切到新 runtime

核心原因主要有三类：

1. 减少样板代码  
   不再要求每个 JSX 文件都手动 `import React from 'react'`
2. 优化运行时组织方式  
   `jsx-runtime` 可以更明确地区分开发态与生产态调用
3. 为后续渲染模型演进留接口  
   新的 runtime 结构更适合进一步扩展

## 相关运行时模块

- `react/jsx-runtime`
  提供 `jsx` 和 `jsxs`
- `react/jsx-dev-runtime`
  提供开发态用的 `jsxDEV`

这也是为什么现在很多 React 项目里，即使写了 JSX，也不一定再看到显式的 `import React`。

## 为什么这对读 Vue 文档有帮助

因为它能帮你建立一个稳定的对照关系：

- React JSX 最终会变成 React 运行时理解的函数调用
- Vue JSX 最终会变成 Vue 运行时理解的 VNode 创建调用

这说明真正关键的不是“长得像不像 JSX”，而是：

> JSX 最终会被编译到哪个框架的运行时协议上。

## 一句话理解

React 的 `createElement` 和 `jsx` runtime 这段演进，最适合作为理解 Vue JSX 的对照背景：同样都是 JSX，最终服务的却是不同框架的运行时模型。

## 建议继续阅读

如果你是为了理解 Vue 里的 JSX / TSX，建议继续看：

1. [vue jsx/tsx 的本质](./tsx.md)
2. [h 函数的本质](./h.md)
