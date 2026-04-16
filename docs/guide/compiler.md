# Vue 编译器帮助我们做了什么

相信聪明的你，已经通过 [play.vuejs.org 演练场](https://play.vuejs.org/) 大概了解了一些 `Vue` 编译器到底帮助我们做了什么。

接下来我们通过源代码，由浅入深地了解一下 `Vue` 的编译器。

## 先记住一个核心结论

Vue 编译器不是一个“可有可无”的附属品，而是把开发者写的高层语法转成浏览器可执行代码的关键桥梁。

如果只看运行时，你能看到 Vue 最后怎么执行；如果把编译阶段一起看进来，你才知道 Vue 为什么能提供这些写法，以及为什么它能做这些优化。

## 依赖项介绍

当我们看 `vue` 的依赖项时，会注意到它实际上有 `5` 个核心部分：

- `@vue/compiler-dom`：负责将 Vue 模板编译成适用于浏览器环境的渲染函数。这是客户端侧渲染的核心部分。
- `@vue/compiler-sfc`：用于解析和编译 `.vue` 单文件组件，将这些组件转换成可执行的 JavaScript 模块。
- `@vue/runtime-dom`：包含浏览器运行时能力，包括虚拟 DOM、组件生命周期和 DOM 操作。
- `@vue/server-renderer`：提供服务端渲染（SSR）能力。
- `@vue/shared`：包含多个 Vue 包共享的工具函数和常量。

> https://www.npmjs.com/package/vue?activeTab=dependencies

## 主要作用

这里我们重点介绍 `@vue/compiler-sfc` 的主要作用：

1. 将模板（template）编译为渲染函数（Render Function）
2. 将样式和预处理语言再次处理，编译成新的样式结果
3. 将 `script` 和 `script setup` 编译、组合，再与 `Render Function` 拼装

所以可以这样理解，一个 `vue` 文件最终通常会被拆解并转换成：

- 一个组件逻辑模块
- 一个渲染函数模块
- 零个或多个样式模块

最后再由构建工具把这些内容重新组织成浏览器能够消费的模块图。

## 编译阶段

编译过程的三个阶段：

1. **解析（Parse）**：将模板字符串转换为抽象语法树（AST）
2. **转换（Transform）**：对 AST 做各种优化与转换（如静态提升、PatchFlag 标记、编译时指令处理等）
3. **代码生成（Codegen）**：生成最终的渲染函数代码

其中**转换阶段**是 Vue 编译器最核心的部分，大量的编译优化都发生在这里：

- **静态提升（Static Hoisting）**：将不会变化的 VNode 提升到渲染函数外部，避免每次渲染都重新创建
- **PatchFlag**：为动态节点标记变化类型（文本、class、style 等），让运行时 diff 可以跳过静态部分
- **Block Tree**：通过 `openBlock` / `createElementBlock` 将动态节点收集到 block 中，实现扁平化 diff
- **事件缓存**：将事件处理函数缓存起来，避免每次渲染创建新函数

这些优化是 Vue 模板相比手写 `h()` 函数的重要优势。编译器能自动分析模板结构，生成比手写更高效的代码。

## 可以把 Vue 编译链路粗略记成三层

### 第一层：SFC 解析

先把 `.vue` 文件拆成 `template`、`script`、`style` 等块。

### 第二层：模板编译

把模板 AST 转成渲染函数代码，并在这个阶段加入各种优化信息。

### 第三层：运行时消费

最终由 `runtime-dom` / `runtime-core` 去执行渲染函数、创建 VNode、挂载 DOM、处理更新。

把这三层分清楚，再去看 `script setup`、`v-model`、`scoped style`、SSR，就不容易混乱。

## 跑一跑

`fork` 这个项目，`git clone` 下来之后执行 `pnpm i`。

然后在 `apps/fully-compiled/scripts/index.ts` 中打上断点，再启动 `vscode` 调试功能，感受 `Vue` 单文件组件的编译过程。

## 阅读建议

看这一篇时，不要只记住名词，更建议你顺手验证三件事：

1. 一个简单 `.vue` 文件会被拆成哪些请求或产物
2. 一个模板表达式最终会落成怎样的渲染函数
3. 一个看似普通的语法糖，究竟属于哪一层处理

如果这三件事能逐步看清，后面的章节会顺很多。
