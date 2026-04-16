# v-on 的本质

在 Vue 中，`v-on` 用于监听 DOM 事件或组件事件并执行回调。

如果只看表面，它像是在模板里“绑定事件”；但更准确的说法是：

> `v-on` 的本质，是把模板事件语法编译成 VNode 上的事件相关 props，再由运行时把这些 props patch 到真实 DOM 或组件事件协议上。

它不是一个“神秘指令系统”，而是 Vue 把事件语法糖映射到渲染系统的一种方式。

## 先看最基础的形态

```html
<button v-on:click="handleClick">Click me</button>
```

等价缩写：

```html
<button @click="handleClick">Click me</button>
```

## 编译后的本质

Vue 会把 `v-on:click="handleClick"` 转换成渲染函数中的 `onClick`：

```js
import { createElementBlock as _createElementBlock, openBlock as _openBlock } from 'vue'

function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock('button', {
    onClick: _cache[0] || (_cache[0] = (...args) => (_ctx.handleClick && _ctx.handleClick(...args)))
  }, 'Click me'))
}
```

这说明两件事：

1. `v-on` 首先是编译期语法展开
2. 运行时真正处理的是 `onClick` 这种事件 prop

## 为什么说它不是“纯运行时指令”

因为在大多数场景里，`v-on` 不会像 `v-show` 那样生成 `withDirectives(...)`。

它更像：

- 编译期把 `@click` 展开成 `onClick`
- 运行时根据这个 prop 去绑定或更新事件监听器

所以它属于典型的“编译展开 + 运行时 patch”。

## DOM 事件和组件事件的区别

### 原生元素上

```html
<button @click="handleClick" />
```

这里最终会落到真实 DOM 事件监听。

### 组件上

```html
<CustomButton @click="handleClick" />
```

这里监听的未必是原生 DOM 的 `click`，而是组件通过 `emit('click')` 抛出的组件事件。

也就是说，同样写成 `@click`，语义可能不同：

- 在原生元素上是 DOM 事件
- 在组件上是组件事件协议

这也是 Vue 模板语法“统一表面、区分底层目标”的一个典型例子。

> `@click.native` 是 Vue 2 语法，在 Vue 3 已移除。
>
> Vue 3 中，子组件要么显式通过 `emits` 对外抛出事件，要么把未声明事件透传给根元素。

## 修饰符的本质

Vue 允许在 `v-on` 上使用修饰符，例如 `.stop`、`.prevent`：

```html
<button @click.stop="handleClick">Click me</button>
<form @submit.prevent="handleSubmit">Submit</form>
```

这些修饰符并不是浏览器原生语法，而是 Vue 在编译后通过辅助函数包装事件处理器实现的。

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
  ], 64 /* STABLE_FRAGMENT */))
}
```

这意味着修饰符的本质是：

- 编译期识别语法
- 运行时通过包装函数补上行为

## 事件缓存机制

注意编译产物中的这类模式：

```js
_cache[0] || (_cache[0] = (...args) => ...)
```

Vue 会缓存事件处理函数，避免每次渲染都重新创建新函数引用。

这是一个很重要的编译优化点。  
也就是说，很多时候你写模板事件，Vue 编译器已经顺手帮你做了稳定引用处理。

## 按键修饰符

Vue 还支持按键修饰符：

```html
<input @keyup.enter="submit" />
<input @keyup.esc="cancel" />
```

这些语法会被编译成对 `event.key` 或相关条件的判断逻辑。

所以它们依然不是浏览器“直接理解”的模板能力，而是 Vue 在编译后生成的判断代码。

## 这一篇最该记住什么

`v-on` 不是“运行时拿到一段指令字符串再解释”。

更准确的过程是：

1. 编译器先把事件语法展开
2. 修饰符会被包装成辅助逻辑
3. 运行时根据 `onXxx` prop 去完成绑定、更新或组件事件监听

## 总结

| 特性 | 说明 |
| --- | --- |
| 编译本质 | `v-on` 被编译为 VNode props 中的 `onXxx` |
| 主要机制 | 编译展开 + 运行时 patch |
| 修饰符 | 通过 `withModifiers` 等包装实现 |
| 事件缓存 | 编译器自动缓存事件处理函数 |
| 缩写语法 | `@click` 等价于 `v-on:click` |

如果你把 `v-on` 放回“模板语法糖 -> 渲染函数 -> patch”这条链路里看，它就会非常清晰。
