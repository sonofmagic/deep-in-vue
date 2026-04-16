# style scoped 的本质

`<style scoped>` 是 Vue SFC 里最容易“天天在用，但底层说不清”的能力之一。

最短答案先给出来：

> `<style scoped>` 的本质，不是浏览器原生的样式作用域，而是 Vue 在编译阶段同时改写模板节点和 CSS 选择器，让样式只命中当前组件渲染出来的节点。

所以它本质上是一种**编译期样式隔离方案**。

## 如果不加 scoped 会发生什么

在普通 `<style>` 中，样式默认是全局生效的：

```html
<style>
p {
  color: red;
}
</style>
```

这会影响页面里所有匹配到的 `<p>`。

而加上 `scoped` 之后：

```html
<style scoped>
p {
  color: red;
}
</style>
```

Vue 就会把它限制到当前组件范围内。

## 编译时到底做了什么

可以把 Vue 做的事情概括成两步：

1. 给当前组件渲染出的节点注入一个 scope attribute
2. 把 CSS 选择器改写成带同样 attribute 的形式

例如：

```html
<template>
  <div>
    <p>Scoped style example</p>
  </div>
</template>

<style scoped>
p {
  color: red;
}
</style>
```

编译后会更接近：

```js
__sfc__.__scopeId = 'data-v-7ba5bd90'
```

以及：

```css
p[data-v-7ba5bd90] {
  color: red;
}
```

所以 `<style scoped>` 的关键并不是“生成了特殊 CSS 语法”，而是：

- 模板侧节点被打上 `data-v-xxxx`
- 样式侧选择器也被改写为命中这些节点

## `data-v-xxxx` 是什么

它不是 class，也不是运行时随机值，而是一个 scope attribute。

它通常来自 SFC 相关信息计算出的稳定标识，用来把：

- 当前组件渲染出的节点
- 当前组件编译后的样式

绑定在一起。

所以同一个 SFC 的实例，通常会共享同一个 scope id，而不是“每个组件实例一个新 id”。

## 为什么这是一种编译期能力

因为浏览器本身并不理解：

```html
<style scoped>
```

这不是原生 CSS 特性。  
真正让它成立的是 Vue 的 SFC 编译器。

所以 `<style scoped>` 和很多 Vue 语法糖一样：

- 开发时看起来很自然
- 但底层成立依赖编译器改写

## 它的边界在哪里

`scoped` 很好用，但不是“天然隔离一切”的黑盒。

最重要的边界有两个：

### 1. 默认不会直接深入子组件内部

如果你想影响子组件更深层的内容，通常要用 `:deep()`。

```css
:deep(.child-element) {
  color: blue;
}
```

### 2. 它不是 Shadow DOM

`scoped` 是“选择器改写 + attribute 约束”，不是浏览器原生 Shadow DOM 隔离。

这意味着它的隔离方式更轻量，但语义上也和 Shadow DOM 不完全一样。

## Vue 3 提供的几个相关能力

### `:deep()`

用于影响子组件内部更深层的节点：

```css
.parent :deep(.child-class) {
  color: red;
}
```

### `:slotted()`

用于选择通过插槽传入的内容。

### `:global()`

用于在 scoped 样式中声明全局样式：

```css
:global(.global-class) {
  color: green;
}
```

### `v-bind()` in CSS

用于在 `<style>` 中使用响应式数据：

```html
<script setup>
import { ref } from 'vue'
const color = ref('red')
</script>

<style scoped>
.text {
  color: v-bind(color);
}
</style>
```

它底层更接近通过 CSS Variables 实现，而不是把 JS 值直接塞进静态 CSS 文件。

## 一句话理解

`<style scoped>` 的本质，就是 Vue 编译器同时改写模板节点和 CSS 选择器，用同一个 scope attribute 把它们绑定起来，从而形成组件级样式隔离。

## 建议继续阅读

如果你想把它放回整条 SFC 编译链里看，建议继续读：

1. [`.vue` 文件的本质](./vue.md)
2. [vite dev 和 build 下的 vue 产物](/advanced/vite-dev-build)
3. [Vue 编译器介绍](/guide/compiler)
