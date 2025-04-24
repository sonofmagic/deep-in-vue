# 只使用 vue 运行时构造的 vue 项目

首先，我们先介绍一下 `vue` 的一些渲染函数

## vue 底层渲染函数

### h()

创建虚拟节点（VNode）

<!-- `createElementVNode`

`renderList` `v-for` -->

### cloneVNode(vnode, props)

cloneVNode() 用于克隆一个虚拟节点，并可以修改其属性或事件等。

### resolveComponent()

resolveComponent() 用于解析一个组件，返回该组件的构造函数或实例。

### resolveDirective()

resolveDirective() 用于解析 Vue 指令，返回指令的定义对象。类似于 resolveComponent，但用于 Vue 指令。

### withDirectives()

withDirectives() 用于在虚拟节点上添加指令，它允许将指令附加到特定的虚拟节点上。这通常用于处理在渲染函数中使用的指令。

### withModifiers()

withModifiers() 用于向事件处理函数添加修饰符。比如 `click` 事件的 `.prevent`,`.stop` 等等

[编译演练场例子中](https://play.vuejs.org/#eNqNU82O0zAQfhXjwwbE0ihdTiVbCdBKwAEQIHHxJUomrRfHtmynBFWRQOIlQOL1QLwFY+enScuuVjlkMvPNzDdfZvb0qdaLXQ10RVObG67dmkleaWUc2RMDJWlJaVRFIgRFTPonjUckfnQ2seBqfch9rirdJy5i/+GbYP5YurKb5Vi7gyQ9JlfSOg8gl57B/egFCKHIR2VEcS96cEQgkHBQaZE5QA8hacF367+/fvz++u3Pz++kwA5p7H0huE3I7lGpzCWjnHBJLhhd7wMf8pBw0rZpvE0OdbyBJpe6dpjIS8zz2LMzEjVNxCg6hcoKLjdoVaoA0SEwEndl+t7BHupMgEskEGJBs5NQkqRBHcSk8WROL737IoDYXGko0LPIyN4XypVQZoXSFU+YbINcHogIek4dwmXJN4trqyT+9ZDBaI4duADzRjuO8jO66mr5WIbqf34VfM7UcD748y3kn/7jv7aN9zH61oAFswNGx5jLzAZcF756/xoatMcgTl4LRN8SfAdWidpz7GDPalkg7QkusH0Z1gz/yQd71TiQdhjKE/XINuAZxY3z4t40+oHuxeJxyENFUcVhow9nc3wAt274/IJOl7drPzQ5WsH5fvRLhnErlFtjZf+a7t1sa3rugchdbx6aEBrPcjncZXJyjHMx7j5m4DOZ4+h05iO0/wBs05LJ)

### 实际上还有更多更底层的函数，从 `@vue/runtime-core` 中导出

### `createElementVNode`

用于创建一个虚拟 DOM 节点 (VNode)，这是 Vue 渲染过程中表示 DOM 元素的核心结构。该函数用于创建一个 HTML 元素或组件的虚拟表示，并且是 Vue 渲染的基础。

### `renderList`

用于渲染一个列表或数组，将每个列表项作为一个单独的 VNode 创建，并进行渲染。这是 Vue 中进行循环渲染（如 v-for 指令）的底层实现。

### `Fragment`

是一个容器，用于包裹多个 VNode 节点而不增加额外的 DOM 元素。Vue 3 引入了 Fragment，这样我们可以返回多个根元素，而不需要额外的包裹元素（如 div）。

### `openBlock`

标记一个渲染块的开始，用于优化。Vue 在渲染过程中会把一些不常变化的元素分组成块，使用 openBlock 和 closeBlock 来标记这些块的开始和结束。它对渲染性能有优化作用。

### `createElementBlock`

用于创建一个 VNode 元素块。与 createElementVNode 类似，createElementBlock 主要用于渲染元素，并且在 openBlock 和 closeBlock 的配合下提供性能优化。

### `toDisplayString`

将一个表达式或值转换为字符串并进行转义，用于插值表达式 (例如 `{{ message }}`) 中的文本显示。这是 Vue 内部处理插值显示的一部分。

### `vModelText`

用于在 Vue 3 中创建文本输入框（`<input>`、`<textarea>`）的 v-model 双向绑定。它是 v-model 的低级实现，专门用于处理文本输入的绑定。

### `createCommentVNode`

用于创建一个注释节点。这是 Vue 内部的一种表示方法，通常用于在模板编译过程中插入注释，以便优化或调试。

### `createTextVNode`

用于创建文本节点。这个方法会创建一个包含文本内容的 VNode，并被渲染到最终的 DOM 中。

### `withCtx`

用于传递上下文对象，通常用于组合式 API 中的功能，确保正确地绑定和传递 this 上下文。它通常用于函数式组件或者模板编译时，确保上下文能够在渲染函数中正确应用。

### `createVNode`

用于创建一个虚拟 DOM 节点 (VNode)，它是 Vue 中的核心构建块。你可以用它来创建元素节点、组件节点、文本节点等。createVNode 是 Vue 的基础渲染 API。

## 阅读代码

我们来看一个不到任何 `vue` 编译功能的 `vue` 项目, 到底代码长什么样:

线上地址: https://only-vue-runtime.netlify.app/

源代码详见 [apps/only-vue-runtime](https://github.com/sonofmagic/only-vue-runtime/tree/main/apps/only-vue-runtime)

## 思考环节

`vuejs` 定义的 `template`/`jsx` 等等，到底帮助我们少写了多少的代码？

<!-- https://only-vue-runtime.netlify.app/
https://fully-compiled.netlify.app/
https://only-runtime.netlify.app/ -->
