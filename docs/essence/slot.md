# 插槽的本质

很多人第一次学 Vue 插槽时，会把它理解成“组件里的占位内容”。

这个理解不算错，但还不够底层。更准确的说法是：

> Vue 插槽的本质，是父组件把一段“返回 VNode 的函数”传给子组件，子组件在合适的位置调用这个函数，把内容插入自己的渲染结果里。

所以插槽不是“神秘模板黑盒”，而是一套**函数化的内容分发机制**。

## 先记住一句话

插槽最终都会落到：

- 一个 `slots` 对象
- 对象里的每个 key 对应一个函数
- 调用这个函数时返回 VNode

也就是说：

- 默认插槽：`slots.default()`
- 具名插槽：`slots.header()`
- 作用域插槽：`slots.default(props)`

## 最简单的默认插槽

先看子组件：

```html
<template>
  <div class="box">
    <slot />
  </div>
</template>
```

从编译结果角度理解，它更接近：

```js
export default {
  render() {
    return h('div', { class: 'box' }, this.$slots.default ? this.$slots.default() : [])
  },
}
```

这里已经能看出本质了：

- 子组件没有直接拿到“静态模板字符串”
- 它拿到的是 `this.$slots.default`
- 这是一个函数，调用后才生成要渲染的 VNode

## 父组件到底传了什么

假设父组件这样写：

```html
<Box>
  <p>你好，我是插槽里的内容！</p>
</Box>
```

运行时，Vue 会把这段插槽内容包装成一个函数，再传给 `Box`。

所以站在子组件视角，它收到的并不是一段现成 DOM，而是“如何生成这段内容”的函数。

这也是为什么插槽机制会非常灵活：

- 它可以延迟执行
- 它可以带参数
- 它可以按名字拆分成多个入口

## 具名插槽的本质

### 具名插槽

```html
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

这时本质上不再只是一个 `default` 函数，而是一个由多个函数组成的对象：

- `$slots.header()`
- `$slots.default()`

所以具名插槽本质上不是新机制，而是“把一个内容入口扩展成多个按名称索引的函数入口”。

## 作用域插槽的本质

作用域插槽最容易让人理解模糊，但它的底层其实反而最直白。

子组件：

```html
<template>
  <slot msg="hello from child" />
</template>
```

父组件：

```html
<MyComponent v-slot="slotProps">
  <p>{{ slotProps.msg }}</p>
</MyComponent>
```

它的本质就是：

- 父组件传给子组件一个函数
- 子组件调用这个函数时传入参数
- 父组件拿这些参数来渲染自己的插槽内容

等价理解：

```js
slots.default({ msg: 'hello from child' })
```

所以“作用域插槽”并不是子组件把变量神奇暴露到父组件模板里，而是一次很普通的**函数传参**。

## 插槽类型对照

| 插槽类型 | 本质 |
| --- | --- |
| 默认插槽 | `slots.default()` |
| 具名插槽 | `slots.name()` |
| 作用域插槽 | `slots.name(props)` |

不管表面语法长什么样，最终都绕不开“函数”这件事。

## 手写 render 时更容易看懂

如果完全不用模板，而是直接用 `render()` 写：

```js
import { h } from 'vue'

export default {
  name: 'Box',
  render() {
    const slotContent = this.$slots.default
      ? this.$slots.default()
      : []

    return h('div', { class: 'box' }, slotContent)
  },
}
```

这段代码几乎已经把插槽的本体暴露干净了：

- `this.$slots.default` 是函数
- 调用后得到 VNode
- 再把这些 VNode 放进当前组件树里

## 为什么插槽要设计成函数

因为这样才能自然支持：

- 延迟渲染
- 动态参数
- 更准确的依赖收集边界
- 更灵活的组件组合

如果插槽只是“提前渲好的固定节点”，那它就很难像现在这样支持作用域数据和复杂组合。

## `defineSlots`（Vue 3.3+）

Vue 3.3 引入了 `defineSlots` 编译宏，用于在 `<script setup>` 中声明插槽类型：

```html
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { msg: string }): any
  header(props: { title: string }): any
}>()
</script>
```

它不会产生运行时代码，主要作用是：

- 让 TypeScript 理解插槽结构
- 提供更好的自动补全和类型检查

所以它服务的是“类型层”，不是“运行时实现层”。

## 一句话理解

插槽不是把父组件模板“粘”进子组件，而是父组件把一段生成 VNode 的函数交给子组件，由子组件在指定位置调用。

## 总结

| 特性 | 说明 |
| --- | --- |
| 本质 | 父组件向子组件传入返回 VNode 的函数 |
| 默认插槽 | `slots.default()` |
| 具名插槽 | `slots.name()` |
| 作用域插槽 | `slots.name(props)` |
| `defineSlots` | 只做类型声明，不改变运行时本质 |
