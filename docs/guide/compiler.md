# Vue 编译器帮助我们做了什么

相信聪明的你，已经通过 [play.vuejs.org 演练场](https://play.vuejs.org/)，大概了解了一些 `vue` 编译器，到底帮助我们做了什么。

接下来我们来通过源代码，由浅入深的了解一下 `Vue` 的编译器

## 依赖项介绍

当我们看 `vue` 的的依赖项时，会注意到它实际上有 `5` 个依赖项，

- `@vue/compiler-dom`: 负责将 Vue 模板编译成适用于浏览器环境的渲染函数。这是客户端侧渲染的核心部分。
- `@vue/compiler-sfc`: 用于解析和编译 `.vue` 单文件组件，将这些组件转换成可执行的 JavaScript 模块。
- `@vue/runtime-dom`: 包含了在浏览器中运行 Vue 应用所需的核心运行时，包括虚拟 DOM 的实现和组件生命周期的管理, 我们在运行时的代码很多都是从这里面引入的
- `@vue/server-renderer`: 提供了在服务端环境中渲染 Vue 组件的功能，支持服务端渲染 (SSR)。
- `@vue/shared`: 包含了 Vue 项目中使用的共享工具函数和常量，供其他 Vue 包复用。

> https://www.npmjs.com/package/vue?activeTab=dependencies

## 主要作用

这里我们重点介绍 `@vue/compiler-sfc` 的主要作用：

1. 将模板（template）编译为渲染函数（Render Function）
2. 将样式，预处理语言，再次处理编译成新的样式
3. 将 `script` 和 `script setup` 进行编译，并组合再和 `Render Function` 组合

所以可以这样理解，一个 `vue` 文件本质上就是一个 `js`, 也有可能会产生样式文件，取决于是否写了 `<style></style>` 且里面是否有值

## 编译阶段

编译过程的三个阶段：

1. **解析（Parse）**：将模板字符串转换为抽象语法树（AST）
2. **转换（Transform）**：对 AST 做各种优化与转换
3. **代码生成（Codegen）**：生成最终的渲染函数代码

## 跑一跑

`fork` 这个项目, `git clone` 下来之后 `pnpm i`

然后在 `apps/fully-compiled/scripts/index.ts` 中打上断点，

然后启动 `vscode` 调试功能，感受 `vue` 单文件组件的编译过程