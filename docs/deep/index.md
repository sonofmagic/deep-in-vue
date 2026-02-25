# 深入

本章节深入探讨 Vue 的内部实现机制。

## VNode 的创建

Vue 的虚拟 DOM 核心是 VNode（Virtual Node），所有的模板最终都会被编译为 VNode 的创建调用。

VNode 的创建源代码：https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/runtime-core/src/vnode.ts#L282

VNode 包含了节点的类型、props、children 等信息，Vue 通过对比新旧 VNode 树（diff 算法）来计算最小的 DOM 更新操作。

## 本章内容

- [类型推导与提取](./type-infer.md) — Vue 如何在编译时提取 TypeScript 类型信息
- [自定义编译时指令](./custom-compile-directive.md) — 如何编写自己的编译时指令
