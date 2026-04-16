# 只使用 vue 运行时 API 构造的 vue 项目

实际上，你完全可以不写任何一个 `.vue` 文件，只单独使用 `Vue` 的运行时渲染函数去构建一个项目。

这篇文章的价值不在于推荐你日常都这么写，而在于它能帮你把一个问题看得非常清楚：

> 如果把模板、SFC、编译宏这些“开发期便利层”全部拿掉，Vue 最终还剩下什么？

答案是：Vue 依然可以工作，因为它的核心不是 `.vue` 文件本身，而是**响应式系统 + 组件模型 + 渲染器**。

## 为什么这一篇值得看

很多人第一次接触 Vue 时，会把这些东西默认绑在一起：

- `.vue`
- `<template>`
- `<script setup>`
- `v-if` / `v-for` / `v-model`

但这些并不是 Vue 唯一的存在方式。  
它们更多是 Vue 在开发体验层提供的高级表达形式。

一旦回到运行时 API，你就能更直接地看到：

- VNode 是怎样被创建的
- 渲染逻辑怎样手工组织
- 模板语法到底替你省掉了多少重复代码

## vue 底层渲染函数

先从最熟悉的入口看起：

https://cn.vuejs.org/api/render-function.html#h

不过这篇文章不是简单做 API 列表，而是建议你先结合 [编译演练场例子](https://play.vuejs.org/#eNqNU82O0zAQfhXjwwbE0ihdTiVbCdBKwAEQIHHxJUomrRfHtmynBFWRQOIlQOL1QLwFY+enScuuVjlkMvPNzDdfZvb0qdaLXQ10RVObG67dmkleaWUc2RMDJWlJaVRFIgRFTPonjUckfnQ2seBqfch9rirdJy5i/+GbYP5YurKb5Vi7gyQ9JlfSOg8gl57B/egFCKHIR2VEcS96cEQgkHBQaZE5QA8hacF367+/fvz++u3Pz++kwA5p7H0huE3I7lGpzCWjnHBJLhhd7wMf8pBw0rZpvE0OdbyBJpe6dpjIS8zz2LMzEjVNxCg6hcoKLjdoVaoA0SEwEndl+t7BHupMgEskEGJBs5NQkqRBHcSk8WROL737IoDYXGko0LPIyN4XypVQZoXSFU+YbINcHogIek4dwmXJN4trqyT+9ZDBaI4duADzRjuO8jO66mr5WIbqf34VfM7UcD748y3kn/7jv7aN9zH61oAFswNGx5jLzAZcF756/xoatMcgTl4LRN8SfAdWidpz7GDPalkg7QkusH0Z1gz/yQd71TiQdhjKE/XINuAZxY3z4t40+oHuxeJxyENFUcVhow9nc3wAt274/IJOl7drPzQ5WsH5fvRLhnErlFtjZf+a7t1sa3rugchdbx6aEBrPcjncZXJyjHMx7j5m4DOZ4+h05iO0/wBs05LJ) 一起看，观察这些底层函数在编译产物里的实际位置。

## 更多底层函数

实际上还有更多更底层的函数，它们从 `@vue/runtime-core` 和 `@vue/runtime-dom` 中导出。

Vue 编译器会把它们编译进 `.vue` 文件产物里，我们平时一般不会直接手写调用，但它们是理解运行时的关键。

### `createVNode` / `createElementVNode` / `createBaseVNode` / `createElementBlock` / `createCommentVNode` / `createTextVNode`

用于创建虚拟 DOM 节点（VNode），它是 Vue 渲染系统最基础的构建块。

之前上面提到的 `h`，本质上就是对更底层 VNode 创建逻辑的二次封装，让开发者写起来更顺手。

而 Vue 编译器没有必要每次都走 `h` 这层便利封装，所以会尽量生成更直接的底层调用。

### `renderList`

`v-for` 的常见产物，用于列表渲染。

### `renderSlot`

`<slot>` 的常见产物，用于插槽渲染。

### `Fragment`

一个不会额外生成 DOM 的容器。Vue 3 支持多根节点，本质上就和它密切相关。

### `openBlock`

用于标记 Block 的开始，配合动态节点收集做渲染优化。

### `toDisplayString`

把表达式值安全转换成可展示字符串，常见于插值表达式 `{{ message }}` 的编译结果中。

### `vModelText`

原生表单元素上 `v-model` 的常见运行时实现之一。

### `withCtx`

常见于插槽、上下文绑定等场景，用来确保渲染函数拿到正确的组件上下文。

## 这种写法的意义，不是“更好”，而是“更裸”

纯运行时写法通常不是为了替代模板，而是为了让你更直接地看到 Vue 底层真实在做什么。

它的优点：

- 更贴近底层执行模型
- 更容易理解模板编译结果
- 对复杂动态场景有更强控制力

它的代价：

- 样板代码明显增加
- 可读性更依赖团队经验
- 很多本来由编译器自动做的优化和展开，需要你自己理解

## 阅读源代码

我们来看一个不依赖 `.vue` 编译能力的页面，代码到底长什么样。

> 技术栈：`vue3` + `service worker` + `indexedDB` + `tailwindcss@4`

源代码详见 [apps/only-vue-runtime](https://github.com/sonofmagic/deep-in-vue/tree/main/apps/only-vue-runtime)

线上地址：https://only-vue-runtime.netlify.app/

## 建议带着这些问题去看

1. 如果不用模板，哪些逻辑会变成显式代码？
2. `v-if`、`v-for`、`slot` 这些能力手写时分别对应什么结构？
3. 你平时写的模板，到底替你隐藏了多少 VNode 细节？
4. 编译器在日常项目里，到底帮你减少了多少重复劳动？

## 思考环节

`Vue` 定义的 SFC 模板、`jsx` 等写法，到底帮我们少写了多少代码？

如果你把这一篇和 [vue + jsx 全编译项目](/advanced/fully-compiled) 对照着看，会更容易理解：

- 模板是高级输入形式
- JSX 是另一种输入形式
- 运行时 API 才是这些输入最终汇聚到的底层执行面
