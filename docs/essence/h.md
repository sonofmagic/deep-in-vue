# h() 函数的本质

一句话概括，`h()` 函数的本质是 `createVNode` 的封装，让渲染函数更加好用。

源代码见： https://github.com/vuejs/core/blob/main/packages/runtime-core/src/h.ts

## 为什么需要 h 函数

Vue 的模板最终都会被编译成渲染函数，而渲染函数的核心就是创建 VNode（虚拟 DOM 节点）。`h()` 函数提供了一种手动创建 VNode 的方式，让你可以不写模板，直接用 JavaScript 描述 UI。

```js
import { h } from 'vue'

// h(标签/组件, props, children)
const vnode = h('div', { class: 'container' }, [
  h('h1', null, '标题'),
  h('p', null, '内容'),
])
```

## h 函数的签名

`h()` 支持多种调用方式，这也是它比直接用 `createVNode` 方便的地方：

```js
import { h } from 'vue'

// 只传标签
h('div')

// 传标签 + props
h('div', { id: 'foo' })

// 传标签 + 子节点（省略 props）
h('div', ['hello'])
h('div', 'hello')

// 传标签 + props + 子节点
h('div', { class: 'bar' }, 'hello')

// 渲染组件
h(MyComponent, { msg: 'hello' })

// 渲染组件 + 插槽
h(MyComponent, null, {
  default: () => h('span', 'slot content'),
})
```

## h 函数 vs createVNode

`h()` 内部就是调用 `createVNode`，但做了参数的智能判断：

- 自动区分第二个参数是 props 还是 children
- 自动处理 VNode 类型判断（`isVNode`）

而 Vue 编译器生成的代码不会使用 `h()`，而是直接调用更底层的 `createElementVNode`、`createBaseVNode` 等函数，避免 `h()` 的参数判断开销。

## 实际应用场景

`h()` 函数在以下场景特别有用：

- 动态渲染不确定结构的组件
- 编写函数式组件
- 在 `setup()` 中返回渲染函数
- 编写高阶组件（HOC）或 renderless 组件

```js
// 一个简单的函数式组件
function Heading(props, { slots }) {
  return h(`h${props.level}`, {}, slots.default())
}
```

## 总结

> `h()` 是 `createVNode` 的语法糖封装，提供了更灵活的参数传递方式。日常开发中推荐使用模板或 JSX，但理解 `h()` 有助于深入理解 Vue 的渲染机制。
