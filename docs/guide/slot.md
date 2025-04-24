## ⚙️ 本质是什么？

Vue 在编译模板时，会把插槽转化成**函数式的内容插入点**。

以一个简单插槽为例，它会被编译成：

```js
// 假设 _ctx.$slots.default 是传进来的 slot 内容
export default {
  render() {
    return h('div', { class: 'box' }, this.$slots.default ? this.$slots.default() : '')
  }
}
```

也就是说：

- 插槽本质是一个函数（VNode 节点的生成器）
- `this.$slots` 是一个对象，key 是插槽名，value 是一个返回 VNode 的函数
- 默认插槽就是 `$slots.default()`，具名插槽就是 `$slots.header()`、`$slots.footer()` 等

---

## 🧠 补充：具名插槽和作用域插槽

### ✅ 具名插槽（Named slots）

```vue
<!-- 子组件 -->
<template>
  <header><slot name="header" /></header>
  <main><slot /></main>
</template>

<!-- 父组件 -->
<MyComponent>
  <template #header>
    <h1>标题</h1>
  </template>
  <p>正文内容</p>
</MyComponent>
```

编译后，Vue 会生成多个 `$slots['xxx']` 函数。

---

### ✅ 作用域插槽（Scoped slots）

允许子组件把数据传给插槽内容：

```vue
<!-- 子组件 -->
<template>
  <slot msg="hello from child" />
</template>

<!-- 父组件 -->
<MyComponent v-slot="slotProps">
  <p>{{ slotProps.msg }}</p>
</MyComponent>
```

> 本质上是：父组件向子组件传入一个函数，子组件调用这个函数时传参数进去，父组件再拿到这些数据来渲染插槽内容。

等价于：

```js
// 父组件传入
slots.default({ msg: 'hello from child' })
```

---

## 📦 小结

| 插槽类型   | 本质                                  |
| ---------- | ------------------------------------- |
| 默认插槽   | 函数：`$slots.default()`              |
| 具名插槽   | 多个函数：`$slots.header()`           |
| 作用域插槽 | 带参数的函数：`$slots.default(props)` |

**最终，插槽都是函数，Vue 在渲染时会调用这些函数，把插槽内容“插”进组件模板中。**

---

想不想我给你用一个真实的 Vue 3 render 函数来手写一个 slot 的例子？会更硬核一点 😂

---

> 好的，更硬核一些

太好了，那我们来个**硬核手写版 Vue 插槽实现**，用 `render` 函数来模拟插槽的真实工作方式！

---

## 🧱 场景设定：

我们模拟一个子组件 `Box`，它可以接收一个插槽内容。

父组件使用方式如下：

```vue
<Box>
  <p>我是父组件传进来的内容</p>
</Box>
```

---

## 💡 手写组件（使用 render 函数）

我们不用 `<template>`，完全用 `render()` 函数来写子组件：

```js
// Box.js
import { h } from 'vue'

export default {
  name: 'Box',
  render() {
    // this.$slots.default 是一个函数
    const slotContent = this.$slots.default
      ? this.$slots.default() // 执行插槽函数，得到 VNode
      : []

    return h('div', { class: 'box' }, slotContent)
  }
}
```

🔍 解释一下：

- `this.$slots.default` 是父组件传入的插槽内容（是个函数）
- 我们调用它来生成 VNode 并渲染进 `<div class="box">` 中

---

## 📤 父组件示例

```vue
<script setup>
import Box from './Box'
</script>

<template>
  <Box>
    <p>你好，我是插槽里的内容！</p>
  </Box>
</template>
```

在运行时，Vue 会把 `<p>你好，我是插槽里的内容！</p>` 包装成函数传进 `Box` 的 `this.$slots.default`，然后在 `Box` 中执行这个函数，插进去。

---

## 🧠 再来个高级点的：**作用域插槽（scoped slot）**

我们扩展一下 `Box`，它向插槽传入一些数据：

```js
// Box.js
import { h } from 'vue'

export default {
  name: 'Box',
  render() {
    const slotContent = this.$slots.default
      ? this.$slots.default({ msg: 'Hello from Box!' }) // 向插槽函数传参
      : []

    return h('div', { class: 'box' }, slotContent)
  }
}
```

然后父组件这样接收：

```vue
<template>
  <Box v-slot="slotProps">
    <p>{{ slotProps.msg }}</p>
  </Box>
</template>
```

背后的机制：

- 父组件注册了一个接收 `msg` 的函数
- 子组件执行 `$slots.default({ msg: '...' })`
- 插槽函数运行，把 `msg` 渲染出来

---

## ✅ 总结一句话

> Vue 插槽的本质就是：**父组件给子组件传入一个返回 VNode 的函数**，子组件在适当的时候调用这个函数插入内容。
