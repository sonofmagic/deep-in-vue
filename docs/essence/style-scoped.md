# style scoped 的本质

在 Vue 中，`<style scoped>` 是一种特殊的 `<style>` 标签属性，它用于限定样式的作用范围，使得样式只应用于当前组件的元素，而不会影响到全局样式或者其他组件的元素。`scoped` 的本质是通过编译时处理来将样式作用域限定在当前组件内，并通过特殊的 CSS 选择器来实现这一点。为了理解其本质，我们需要深入探讨 Vue 如何处理样式、如何生成独特的 CSS 选择器以及如何确保样式只作用于当前组件。

## 1. **`scoped` 的功能**

在没有 `scoped` 的情况下，Vue 组件中的样式是全局的，即使它们只写在某个组件的 `<style>` 标签内，仍然会影响到整个应用中的所有元素。为了避免样式污染其他部分的页面，Vue 引入了 `scoped` 属性来限制样式的作用范围。

```html
<!-- 未加 scoped 时，样式会影响到所有页面元素 -->
<style>
  p {
    color: red;
  }
</style>
```

上面的样式会将页面中所有 `<p>` 标签的文本变成红色。

而使用 `scoped` 后，样式只会应用到当前组件的元素：

```html
<!-- 使用 scoped 限制样式作用域 -->
<style scoped>
  p {
    color: red;
  }
</style>
```

在这个例子中，`<p>` 标签的样式只会应用到当前组件中的 `<p>` 元素，不会影响到全局的 `<p>` 元素。

## 2. **编译时的处理**

当你在一个组件中使用 `<style scoped>` 时，Vue 会进行以下操作：

1. **注入作用域标识**：Vue 会为组件生成稳定的作用域标识（如 `data-v-xxxx`），并在渲染元素时注入这个 attribute。
2. **改写 CSS 选择器**：编译阶段会把选择器改写为带 `data-v-xxxx` 的形式，从而只命中当前组件范围内的元素。

### 2.1 **作用域标识生成**

`data-v-xxxx` 不是“类名”，而是一个作用域 attribute。`xxxx` 是由 SFC 计算出的稳定哈希值，通常同一个组件文件在同一次构建里是固定的。

例如，对于以下组件：

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

Vue 编译时会做如下的修改：

- 在渲染节点时注入作用域 attribute（如 `data-v-12345`）。
- 编译样式时把 `p` 选择器改写为带 scope attribute 的选择器：

```js
import { createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, openBlock as _openBlock } from 'vue'

const __sfc__ = { }
function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock('div', null, _cache[0] || (_cache[0] = [
    _createElementVNode('p', null, 'Scoped style example', -1 /* HOISTED */)
  ])))
}
__sfc__.render = render
// 注意这个 __scopeId
__sfc__.__scopeId = 'data-v-7ba5bd90'
__sfc__.__file = 'src/App.vue'
export default __sfc__
```

```css
/* 通过编译处理后的样式 */
p[data-v-7ba5bd90] {
  color: red;
}
```

这样，只有 `<div>` 标签及其内部的 `<p>` 元素会应用该样式，其他组件中的 `p` 标签不会受影响。

### 2.2 **样式的作用域**

通过这种方式，`scoped` 样式的作用域会被自动限制在当前组件内。无论组件中有多少个 `<p>` 元素，都会被正确应用红色样式，而其他组件的 `<p>` 元素不会受到影响。

## 3. **Vue 如何处理 `scoped` 样式的关键点**

### 3.1 **唯一标识符**

Vue 会基于组件的模板内容生成一个唯一的标识符，通常是一个基于组件文件内容生成的哈希值。这个哈希值会被添加到每个选择器上，从而确保该样式只应用于当前组件。

### 3.2 **样式作用范围**

在实际的编译过程中，所有的 CSS 选择器都会被修改，以包含生成的唯一标识符。例如：

```css
/* 编译后的 scoped 样式 */
p[data-v-7ba5bd90] {
  color: red;
}
```

通过这种方式，`scoped` 样式会确保只作用于带有 `data-v-7ba5bd90` attribute 的元素，避免了全局污染。

## 4. **关于 scopeId 的稳定性**

同一个 SFC 的 `data-v-xxxx` 一般是稳定且复用的，不会“每个实例一个不同 id”。样式隔离依赖的是“当前组件模板渲染出的元素都带同一个 scope attribute”，而不是“每个实例不同 id”。

## 5. **`scoped` 样式的局限性**

https://vuejs.org/api/sfc-css-features.html#deep-selectors

尽管 `scoped` 样式可以避免大部分的样式污染，但它并不是完美的。`scoped` 的本质是“选择器改写 + scope attribute 限定”，这有以下一些限制：

- **子组件边界**：`scoped` 默认不会直接作用到子组件内部深层节点。如果需要影响子组件内部样式，通常使用 `:deep()`。

  ```css
  /* 示例：使用 :deep() 选择器影响子组件 */
  :deep(.child-element) {
    color: blue;
  }
  ```

- **全局样式**：如果你需要在组件中引入全局样式（例如，CSS reset），则需要在 `scoped` 样式之外进行处理，或者使用 `global` 样式。

## 6. **SFC CSS 特性（Vue 3）**

Vue 3 的 `<style scoped>` 还提供了几个实用的伪选择器：

### `:deep()` — 深度选择器

影响子组件内部的样式：

```css
.parent :deep(.child-class) {
  color: red;
}
```

编译后：

```css
.parent[data-v-xxxx] .child-class {
  color: red;
}
```

### `:slotted()` — 插槽选择器

选择通过插槽传入的内容：

```css
:slotted(.slot-content) {
  font-weight: bold;
}
```

### `:global()` — 全局选择器

在 scoped 样式中声明全局样式：

```css
:global(.global-class) {
  color: green;
}
```

### `v-bind()` — CSS 中使用响应式数据

Vue 3 支持在 `<style>` 中直接使用 `v-bind()` 绑定响应式数据：

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

`v-bind()` 的本质是通过 CSS 自定义属性（CSS Variables）实现的。编译后，Vue 会在组件根元素上设置 `--xxxx-color: red` 这样的 CSS 变量，然后在样式中引用它。当 `color` 的值变化时，CSS 变量会自动更新，从而实现响应式的样式绑定。

## 7. **总结：`scoped` 样式的本质**

`<style scoped>` 的本质是通过编译时处理，把 CSS 选择器改写为带作用域 attribute（如 `data-v-xxxx`）的形式，并在组件渲染节点时注入同样的 scope attribute。这样样式只在当前组件渲染出的节点上生效，避免全局污染。

这种编译时的作用范围限制使得 Vue 组件的样式更加模块化和可维护，尤其在大型应用中，每个组件都能拥有自己独立的样式，而不需要担心样式冲突或污染。
