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

1. **自动添加唯一的类名**：在渲染时，Vue 会为每个组件的根元素自动生成一个唯一的类名，并将该类名应用于根元素和所有子元素。
2. **修改 CSS 选择器**：在编译阶段，Vue 会修改组件中的 CSS 选择器，使得这些样式只作用于带有该类名的元素。这样，样式就不会污染到其他组件或全局的元素。

### 2.1 **类名生成**

Vue 会为每个组件的根元素生成一个唯一的 `data-v-xxxx` 类名，`xxxx` 是一个基于组件的哈希值。这个类名会在 `<style scoped>` 内的选择器前面加上，从而确保样式只会影响当前组件。

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

- 为组件的根元素（`<div>`）添加一个唯一的类名，比如 `data-v-12345`。
- 修改样式，给 `p` 标签的选择器加上这个类名：

```js
const __sfc__ = {  };
import { createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"
function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("div", null, _cache[0] || (_cache[0] = [
    _createElementVNode("p", null, "Scoped style example", -1 /* HOISTED */)
  ])))
}
__sfc__.render = render
// 注意这个 __scopeId
__sfc__.__scopeId = "data-v-7ba5bd90"
__sfc__.__file = "src/App.vue"
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

通过这种方式，`scoped` 样式会确保只作用于带有 `data-v-7ba5bd90` 类的元素，避免了全局污染。

## 4. **动态生成的类名**

由于 Vue 会自动生成唯一的类名，所以如果你在同一个页面中多次使用同一个组件，Vue 会保证每个组件实例的样式不会相互干扰。例如，在页面中有多个相同组件时，每个组件会有不同的 `data-v-xxxx` 类名，从而保持样式的独立性。

## 5. **`scoped` 样式的局限性**

https://vuejs.org/api/sfc-css-features.html#deep-selectors

尽管 `scoped` 样式可以避免大部分的样式污染，但它并不是完美的。`scoped` 样式的本质仍然是在样式选择器中添加一个类名，以确保样式只作用于当前组件。然而，这有以下一些限制：

- **嵌套选择器**：`scoped` 不能够影响深层嵌套的元素。例如，如果一个组件的样式嵌套层级很深，Vue 会将 `scoped` 限制到根元素，并不会自动在子组件的样式中加上类名。如果想要影响子组件的样式，可能需要使用深度选择器（`:deep()`）。
  
  ```css
  /* 示例：使用 :deep() 选择器影响子组件 */
  :deep(.child-element)  {
    color: blue;
  }
  ```

- **全局样式**：如果你需要在组件中引入全局样式（例如，CSS reset），则需要在 `scoped` 样式之外进行处理，或者使用 `global` 样式。

## 6. **总结：`scoped` 样式的本质**

`<style scoped>` 的本质是通过编译时处理，为组件的根元素和所有相关的样式选择器生成一个唯一的类名（如 `data-v-xxxx`），并将该类名添加到样式规则中，从而限定样式的作用范围，仅在当前组件的元素中生效，避免样式的全局污染。Vue 通过这种机制确保了组件样式的封装性，使得每个组件的样式都能独立而不干扰其他组件。

这种编译时的作用范围限制使得 Vue 组件的样式更加模块化和可维护，尤其在大型应用中，每个组件都能拥有自己独立的样式，而不需要担心样式冲突或污染。