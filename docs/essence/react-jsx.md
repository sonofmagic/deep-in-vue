# React createElement 与 JSX runtime

这里借 React 讲 JSX，不展开 React API。先把一件事说清楚：

> JSX 已经从 React 的语法糖，变成了现代前端工具链默认理解的 UI 表达格式。

先理解这一点，再看 Vue JSX / TSX，就不会只停在 `createElement` 和 `h()` 的表面对照上。

## JSX 不是 React 专属语法

JSX 从来不是浏览器原生语法，它必须先被编译。

早期 React JSX 通常会变成：

```jsx
const element = <h1>Hello</h1>
```

```js
const element = React.createElement('h1', null, 'Hello')
```

React 17 之后的新 JSX Transform 会更接近：

```js
import { jsx } from 'react/jsx-runtime'

const element = jsx('h1', { children: 'Hello' })
```

所以 JSX 不是“React 能直接运行 XML”。它只是一个输入：

> 一种会被编译到目标运行时的 UI 语法。

目标运行时可以是 React，也可以是 Vue、Preact、Solid、MDX 或其他 JSX runtime。

## React 为什么吃到了最大红利

React 推 JSX 推得早，也推得彻底。

后来工具链围着 JSX 补齐了很多东西：

- TypeScript 支持 JSX/TSX 类型检查
- Babel、SWC、esbuild 能转换 JSX
- ESLint、Prettier、编辑器能分析和格式化 JSX
- 组件库、设计系统、文档站和测试工具默认支持 JSX
- 大量框架把 React JSX 当作第一适配目标

这就是 React 经常成为默认适配目标的原因之一。

新工具不一定要理解 React 的全部运行时细节。很多时候，先处理好 JavaScript + JSX，就能覆盖一大批 UI 项目。

## 新 JSX runtime 的意义

新 JSX runtime 不再要求每个 JSX 文件都显式写：

```js
import React from 'react'
```

它把 JSX 的编译入口变成更明确的 runtime 模块：

- `react/jsx-runtime`：生产环境常用入口，提供 `jsx` / `jsxs`
- `react/jsx-dev-runtime`：开发环境入口，提供 `jsxDEV`

这个变化让 JSX 更像一个编译入口：

> JSX 语法负责描述结构，runtime 模块负责决定它最后变成什么对象。

## 这对 Vue 的意义

Vue JSX 不是 React JSX 的复制品。

同样一段 JSX，在 React 里会编译到 React 的 element 协议；在 Vue 里会编译到 Vue 的 VNode、slots、指令和事件约定。

区别在这里：

- JSX 是共同输入格式
- 编译目标由对应框架的 JSX runtime / Babel 插件决定
- 运行时协议仍然属于各自框架

所以你在 Vue 里写 JSX，本质上是用 JSX 书写 Vue render 函数，而不是把 React 的组件模型搬进 Vue。

## 小结

React 的 JSX runtime 演进，把 JSX 从“语法糖”推成了工具链入口。类型系统、编辑器、格式化和框架生态都愿意围着它做适配。

这也是 React 框架友好度高的原因之一。

## 接着读

1. [Vue JSX / TSX 的本质](./tsx.md)
2. [React 与 Vue 的真实差异](./react-vs-vue.md)
