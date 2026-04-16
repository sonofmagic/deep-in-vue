# h() 函数的本质

一句话概括：

> `h()` 的本质，是 `createVNode` 的一层更好用的开发者封装，让你可以直接用 JavaScript 手写 VNode。

它不是新的渲染系统，也不是模板之外的另一套框架能力。  
它只是 Vue 渲染系统暴露给开发者的一个更顺手的入口。

## 为什么需要 `h()`

Vue 模板最终都会被编译成渲染函数，而渲染函数最终要做的事情，就是创建 VNode。

`h()` 的价值在于：

- 你不写模板时，也能手动描述 UI
- 你不必直接操作更底层的 `createVNode`
- 它对参数做了更友好的判断和整理

例如：

```js
import { h } from 'vue'

const vnode = h('div', { class: 'container' }, [
  h('h1', null, '标题'),
  h('p', null, '内容'),
])
```

这段代码本质上就是在手工构造一棵 VNode 树。

## 它到底返回什么

`h()` 返回的不是 DOM，也不是 HTML 字符串，而是 **VNode**。

也就是说：

- 模板编译产物本质上也是在生成 VNode
- `h()` 只是让你手写这一步

所以模板、JSX、`h()`，最后都会汇聚到同一个底层目标：VNode。

## 常见签名为什么看起来很灵活

`h()` 支持多种调用形式：

```js
h('div')
h('div', { id: 'foo' })
h('div', 'hello')
h('div', ['hello'])
h('div', { class: 'bar' }, 'hello')
h(MyComponent, { msg: 'hello' })
h(MyComponent, null, {
  default: () => h('span', 'slot content'),
})
```

这种灵活性来自于它内部会帮你判断：

- 第二个参数到底是 props 还是 children
- children 是字符串、数组还是 slots 对象

所以 `h()` 的真正价值之一，就是把这些参数归一化细节包起来。

## `h()` 和 `createVNode` 的关系

很多时候可以直接把它们理解成：

- `createVNode` 更底层
- `h()` 更偏开发者友好的封装

源码也可以直接印证这一点：

https://github.com/vuejs/core/blob/main/packages/runtime-core/src/h.ts

所以当你说“我在写 `h()`”，本质上其实是在调用 Vue 的 VNode 创建能力，只是用了更方便的入口。

## 为什么编译器不直接生成 `h()`

这是一个很值得注意的点。

Vue 编译器通常不会生成 `h()`，而会直接生成更底层的函数，比如：

- `createElementVNode`
- `createBaseVNode`
- `createElementBlock`

原因很简单：

- `h()` 适合开发者手写
- 编译器已经知道节点类型和参数结构
- 没必要再走一层参数判断封装

所以：

- 对开发者来说，`h()` 更方便
- 对编译器来说，直接生成底层 helper 更高效

## 在哪些场景下值得手写 `h()`

`h()` 特别适合这些场景：

- 动态渲染结构难以用模板自然表达
- 编写 `render()` 函数
- 在 `setup()` 中返回渲染函数
- 编写函数式组件
- 写高阶组件（HOC）或 renderless 组件

例如：

```js
function Heading(props, { slots }) {
  return h(`h${props.level}`, {}, slots.default())
}
```

这里你能非常直接地按 JavaScript 思维组织 UI，而不用先把逻辑翻译成模板语法。

## 它和 JSX 的关系

如果你用了 JSX，本质上很多 JSX 最后也会被转换成 VNode 创建调用。

所以从底层视角看：

- 模板：编译成 render + VNode
- JSX：编译成 render + VNode
- `h()`：手写 render + VNode

它们的差别主要在输入形式和开发体验，不在最终运行目标。

## 一句话理解

`h()` 不是 Vue 的“另一套渲染方式”，而是 Vue 把“手写 VNode”这件事暴露给开发者的便利入口。

## 总结

| 特性 | 说明 |
| --- | --- |
| 本质 | `createVNode` 的开发者友好封装 |
| 返回值 | VNode |
| 作用 | 让开发者不用模板也能描述 UI |
| 编译器态度 | 编译器通常直接生成更底层 helper，不走 `h()` |
| 常见场景 | render 函数、函数式组件、动态渲染、HOC |
