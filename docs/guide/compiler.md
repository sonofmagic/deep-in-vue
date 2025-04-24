# Vue 编译器帮助我们做了什么

相信聪明的你，已经通过演练场，知道 `Vue` 编译器帮助我们做了什么了。

## 为什么了解 Vue 编译器？

模板是开发者写的，渲染函数是浏览器能执行的

编译器让我们不用手写复杂的 VNode 结构

性能优化很多都“藏”在编译阶段

## 依赖项介绍

当我们看 `vue` 的的依赖项时，会注意到它实际上有 `5` 个依赖项，

- `@vue/compiler-dom`
- `@vue/compiler-sfc`
- `@vue/runtime-dom`
- `@vue/server-renderer`
- `@vue/shared`

他们对应的作用，分别为:

- `@vue/compiler-dom`: 负责将 Vue 模板编译成适用于浏览器环境的渲染函数。这是客户端侧渲染的核心部分。
- `@vue/compiler-sfc`: 用于解析和编译 `.vue` 单文件组件，将这些组件转换成可执行的 JavaScript 模块。
- `@vue/runtime-dom`: 包含了在浏览器中运行 Vue 应用所需的核心运行时，包括虚拟 DOM 的实现和组件生命周期的管理。
- `@vue/server-renderer`: 提供了在服务端环境中渲染 Vue 组件的功能，支持服务端渲染 (SSR)。
- `@vue/shared`: 包含了 Vue 项目中使用的共享工具函数和常量，供其他 Vue 包复用。

> https://www.npmjs.com/package/vue?activeTab=dependencies

## 主要作用

- 将模板（Template）编译为渲染函数（Render Function）
- 将样式，预处理语言，再次处理编译成新的样式
- 将 `script` 和 `script setup` 进行组合
- 最终把

编译过程的三个阶段：

1. **解析（Parse）**：将模板字符串转换为抽象语法树（AST）
2. **转换（Transform）**：对 AST 做各种优化与转换
3. **代码生成（Codegen）**：生成最终的渲染函数代码
