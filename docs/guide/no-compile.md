# 只使用 vue 运行时 api 构造的 vue 项目

实际上，你完全可以不写任何一个 `.vue` 文件，只单独使用 `vuejs` 中的运行时渲染函数，去构建一个项目

## vue 底层渲染函数

首先，我们先简单介绍一下他们

详见 https://cn.vuejs.org/api/render-function.html#h

当然，这篇文章并不是简单的 api 介绍，我们从 [编译演练场例子中](https://play.vuejs.org/#eNqNU82O0zAQfhXjwwbE0ihdTiVbCdBKwAEQIHHxJUomrRfHtmynBFWRQOIlQOL1QLwFY+enScuuVjlkMvPNzDdfZvb0qdaLXQ10RVObG67dmkleaWUc2RMDJWlJaVRFIgRFTPonjUckfnQ2seBqfch9rirdJy5i/+GbYP5YurKb5Vi7gyQ9JlfSOg8gl57B/egFCKHIR2VEcS96cEQgkHBQaZE5QA8hacF367+/fvz++u3Pz++kwA5p7H0huE3I7lGpzCWjnHBJLhhd7wMf8pBw0rZpvE0OdbyBJpe6dpjIS8zz2LMzEjVNxCg6hcoKLjdoVaoA0SEwEndl+t7BHupMgEskEGJBs5NQkqRBHcSk8WROL737IoDYXGko0LPIyN4XypVQZoXSFU+YbINcHogIek4dwmXJN4trqyT+9ZDBaI4duADzRjuO8jO66mr5WIbqf34VfM7UcD748y3kn/7jv7aN9zH61oAFswNGx5jLzAZcF756/xoatMcgTl4LRN8SfAdWidpz7GDPalkg7QkusH0Z1gz/yQd71TiQdhjKE/XINuAZxY3z4t40+oHuxeJxyENFUcVhow9nc3wAt274/IJOl7drPzQ5WsH5fvRLhnErlFtjZf+a7t1sa3rugchdbx6aEBrPcjncZXJyjHMx7j5m4DOZ4+h05iO0/wBs05LJ) 获取他们在编译时候的使用到的地方

## 更多的底层的函数

实际上还有更多更底层的函数, 它们从 `@vue/runtime-core` 和 `@vue/runtime-dom` 中导出

`vue` 编译器会把它们编译到 `vue` 文件的产物中去，我们一般情况下不会去调用它们。

这里简单列举一些

### `createVNode` / `createElementVNode` / `createBaseVNode` / `createElementBlock` / `createCommentVNode` / `createTextVNode`

用于创建一个虚拟 DOM 节点 (VNode)，它是 Vue 中的核心构建块。你可以用它来创建元素节点、组件节点、文本节点等。`createVNode` 是 Vue 的基础渲染 API。

之前上面的 `h` 函数的本质实际上就是 `createVNode` + `isVNode` 的二次封装，方便我们去使用的。

而 `vue` 编译器没有必要都去使用 `h` 函数这个二次封装，白白浪费性能，所以它编译的时候会转化成上面那些更加底层的方法。

### `renderList`

`v-for` 循环渲染指令的产物，用于渲染一个列表或数组，将每个列表项作为一个单独的 VNode 创建，并进行渲染。

### `renderSlot`

`<slot></slot>` 插槽的产物，用于渲染插槽，将插槽内容作为单独的 VNode 创建，并进行渲染。

### `Fragment`

是一个容器，用于包裹多个 VNode 节点而不增加额外的 DOM 元素。Vue 3 引入了 Fragment，这样我们可以返回多个根元素，而不需要额外的包裹元素（如 div）。

这就是 `vue3` `<template>` 里面无需像 `vue2` 那样，强制一个根节点的原因

### `openBlock`

标记一个渲染块的开始，用于优化。Vue 在渲染过程中会把一些不常变化的元素分组成块，使用 `openBlock` 和 `closeBlock` 来标记这些块的开始和结束。它对渲染性能有优化作用。

### `toDisplayString`

将一个表达式或值转换为字符串并进行转义，用于插值表达式 (例如 `{{ message }}`) 中的文本显示。这是 `Vue` 内部处理插值显示的一部分。

### `vModelText`

用于在 Vue 3 中创建文本输入框（`<input>`、`<textarea>`）的 v-model 双向绑定。它是 v-model 的低级实现，专门用于处理文本输入的绑定。

### `withCtx`

用于传递上下文对象，通常用于组合式 API 中的功能，确保正确地绑定和传递 `this` 上下文。它通常用于函数式组件或者模板编译时，确保上下文能够在渲染函数中正确应用。

## 阅读源代码

我们来看一个不到任何 `vue` 编译功能的 `vue` 页面, 到底代码长什么样:

> 技术栈: `vue3` + `service worker` + `indexedDB` + `tailwindcss@4`

源代码详见 [apps/only-vue-runtime](https://github.com/sonofmagic/only-vue-runtime/tree/main/apps/only-vue-runtime)

线上地址: https://only-vue-runtime.netlify.app/

## 思考环节

`vuejs` 定义的 `vue` `sfc` 单文件中的 `template`，或者 `jsx` 等等，到底帮助我们少写了多少的代码？

<!-- https://only-vue-runtime.netlify.app/
https://fully-compiled.netlify.app/
https://only-runtime.netlify.app/ -->
