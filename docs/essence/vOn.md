# v-on 的本质

在 Vue 中，`v-on` 指令用于监听 DOM 事件并执行相应的回调。它的本质是将事件监听器绑定到元素或组件，并在触发事件时调用指定的方法。`v-on` 的工作原理与 Vue 的响应式系统、虚拟 DOM 渲染机制和事件处理机制密切相关。要深入理解 `v-on` 的本质，我们需要从以下几个方面进行解析：

## 1. **编译过程与渲染函数**

在 Vue 中，模板会被编译成渲染函数，这些渲染函数返回的是虚拟 DOM（VNode）。`v-on` 的本质是把事件语法编译成 VNode 的 `onXxx` 属性，再由运行时 patch 到真实 DOM 事件监听上。

假设我们有以下模板：

```html
<button v-on:click="handleClick">Click me</button>
```

## 2. **编译为渲染函数**

Vue 会将模板中的 `v-on:click="handleClick"` 转换成渲染函数中对应的事件绑定代码。在 Vue 3 中，编译结果通常是 `onClick` 这样的 VNode prop，运行时再把它挂到真实元素上。

编译后的渲染函数如下所示：

```javascript
import { createElementBlock as _createElementBlock, openBlock as _openBlock } from 'vue'

function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock('button', {
    onClick: _cache[0] || (_cache[0] = (...args) => (_ctx.handleClick && _ctx.handleClick(...args)))
  }, 'Click me'))
}
```

### 3 **修饰符**

Vue 允许在 `v-on` 上使用修饰符来改变事件的行为，例如 `.stop`、`.prevent` 等。

- **`.stop`**：调用 `event.stopPropagation()` 阻止事件冒泡。
- **`.prevent`**：调用 `event.preventDefault()` 阻止事件的默认行为。

```html
<button @click.stop="handleClick">Click me</button>
<form @submit.prevent="handleSubmit">Submit</form>
```

> 注意：`@click.native` 是 Vue 2 语法，在 Vue 3 已移除。
>
> Vue 3 中，子组件要么显式通过 `emits` 对外抛出事件（`@click` 监听组件事件），要么把未声明事件透传到根元素。

这些修饰符的实现本质上是通过在事件触发时在事件处理函数中插入相应的 `event` 方法调用来完成的。

```js
import { createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, Fragment as _Fragment, openBlock as _openBlock, withModifiers as _withModifiers } from 'vue'

const __sfc__ = { }
function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    _createElementVNode('button', {
      onClick: _cache[0] || (_cache[0] = _withModifiers((...args) => (_ctx.handleClick && _ctx.handleClick(...args)), ['stop']))
    }, 'Click me'),
    _createElementVNode('form', {
      onSubmit: _cache[1] || (_cache[1] = _withModifiers((...args) => (_ctx.handleSubmit && _ctx.handleSubmit(...args)), ['prevent']))
    }, 'Submit', 32 /* NEED_HYDRATION */),
    _createElementVNode('custom-button', {
      onClick: _cache[2] || (_cache[2] = (...args) => (_ctx.handleClick && _ctx.handleClick(...args)))
    }, 'Click me')
  ], 64 /* STABLE_FRAGMENT */))
}
__sfc__.render = render
__sfc__.__file = 'src/App.vue'
export default __sfc__
```

### 4. **事件缓存机制**

注意编译产物中的 `_cache[0] || (_cache[0] = ...)` 模式。Vue 会将事件处理函数缓存起来，避免每次渲染都创建新的函数引用。这是 Vue 编译器的一个重要优化，对比 React 中需要手动使用 `useCallback` 来缓存函数，Vue 在编译阶段就自动完成了。

### 5. **按键修饰符**

Vue 还支持按键修饰符，用于监听特定的键盘事件：

```html
<input @keyup.enter="submit" />
<input @keyup.esc="cancel" />
```

这些修饰符会被编译为对 `event.key` 的判断逻辑。

## 总结

| 特性     | 说明                                                                 |
| -------- | -------------------------------------------------------------------- |
| 编译本质 | `v-on` 被编译为 VNode props 中的 `onXxx` 事件属性                   |
| 修饰符   | `.stop`、`.prevent` 等通过 `withModifiers` 包装实现                  |
| 事件缓存 | 编译器自动缓存事件处理函数（`_cache`），避免不必要的重新渲染         |
| 按键修饰 | `.enter`、`.esc` 等编译为按键判断逻辑                                |
| 缩写语法 | `@click` 等价于 `v-on:click`，纯语法糖，编译产物完全一致            |
