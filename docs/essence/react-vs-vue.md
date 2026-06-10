# React 与 Vue 的真实差异

这页不再只谈运行时更新。

那种对比不是错，但太像面试题。影响生态格局的，更多是两边对“怎么描述 UI”的选择。

## 一句话版本

> React 把 UI 变成普通 JavaScript 里的 JSX 表达；Vue 把 UI 放进 SFC、模板、编译宏和响应式系统组成的框架语言里。

这比“谁性能更好”“谁语法更优雅”更有解释力。

## React：UI as JavaScript

React 最重要的贡献不是某个 API，而是它把这套心智推成了主流：

- 组件是函数
- UI 是状态的结果
- JSX 是 JavaScript 表达式
- 组合靠函数、对象、闭包和模块系统完成
- 渲染目标可以不只是 DOM

所以 React 的组件表达很容易被别的东西拿去用。

Ink 用它写终端 UI，React Three Fiber 用它写 Three.js 场景，React Native 把它接到原生平台。它们不是在复刻 React DOM，而是在复用 React 的组件写法和 JSX。

## Vue：框架内的高层表达

Vue 走的是另一条路：

- SFC 给文件组织一个明确边界
- 模板给业务 UI 一个稳定、可分析的结构
- 编译器把模板降级成 render、VNode 和 patch 提示
- 响应式系统负责追踪依赖和触发更新
- 编译宏把类型、props、model、slots 等常见样板前置处理

Vue 更像一个完整的应用开发体系。它不是单纯让你用 JavaScript 写 UI，而是把模板、指令、SFC、宏、响应式和编译器放到一起。

这让 Vue 写业务很顺。代价也清楚：外部工具要深度理解 Vue，不能只懂 JavaScript AST，还要懂 SFC、模板 AST 和 Vue 编译规则。

## JSX 为什么改变生态位置

JSX 已经是事实标准。

新的 bundler、formatter、linter、编译器、测试工具、文档工具，通常都能很快支持 JSX。原因很现实：

- JSX 已经被 TypeScript、Babel、SWC、ESLint、Prettier、IDE 广泛处理
- JSX 的语法和 JavaScript 处在同一个文件、同一套 AST 处理链路里
- React 生态已经沉淀了大量规则、类型、插件和工程约定
- 支持 JSX 往往就等于支持最大的一批现代 UI 项目

所以 React 很容易拿到生态默认位。

Vue 当然也支持 JSX，但主线还是 SFC 模板。Vue JSX 更像 Vue render 的另一种写法，不是整个 Vue 生态的公共入口。

## 对比表

| 维度 | React | Vue |
| :-- | :-- | :-- |
| UI 表达 | JSX 是主线 | SFC 模板是主线，JSX 是补充 |
| 工具入口 | JS/TS/JSX 通用链路 | SFC + 模板编译链路 |
| 框架友好度 | 容易被上层框架和新渲染器复用 | 框架内能力更完整 |
| 运行环境 | DOM、Native、CLI、3D 等生态非常自然 | 主要围绕 Vue 应用与 Vue 编译器生态展开 |
| 优化方式 | 更多依赖运行时调度和开发者边界控制 | 编译器能利用模板静态信息给运行时提示 |
| 开发体验 | JavaScript 一致性强 | 业务表达、语法糖和响应式体验强 |

## 原来的性能对比怎么看

React 函数组件每次渲染重新执行。Vue `setup` 通常初始化一次，后面由 render effect 和响应式依赖驱动更新。

这个差异成立，但它只是运行时模型的一部分。

如果只盯着它，很容易得到一个过时结论：

> 谁默认少写优化 API，谁就更先进。

更稳的说法是：

> React 把更多表达放在 JavaScript 和生态工具里，Vue 把更多能力收进框架编译链和响应式系统里。

这样才能解释为什么 React 在跨工具、跨平台和新框架适配上更强，也能解释为什么 Vue 的 SFC 业务开发体验更完整。

## 什么时候该关注哪边

如果你在做这些事，React 的优势会更明显：

- 写跨平台 UI 抽象
- 做新渲染器或 DSL
- 做通用代码分析、格式化、lint、编译工具
- 做设计系统、文档系统、工程框架
- 需要最大化复用 JS/TS/JSX 生态能力

如果你在做这些事，Vue 的优势会更明显：

- 业务页面和后台系统
- 以 SFC 为中心的组件库
- 依赖模板静态分析的优化
- 希望框架帮你收敛常见样板和约定
- 希望响应式和模板语法降低日常开发负担

## 小结

React 通过 JSX 和函数组件，把 UI 表达放进了通用 JavaScript 生态里。它当然是框架，但很多时候也像一种可迁移的 UI 写法。

Vue 则把模板、SFC、编译器、响应式和宏组织在一起，框架内体验更完整。

所以差异不在“谁更优雅”，而在：

> React 更开放、更像生态协议；Vue 更完整、更像框架语言。

## 接着读

1. [为什么 React 更容易成为生态默认项](/deep/why-react)
2. [React createElement 与 JSX runtime](./react-jsx.md)
3. [Vue JSX / TSX 的本质](./tsx.md)
