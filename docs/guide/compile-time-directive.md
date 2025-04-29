# 编译时指令 vs 运行时指令

Vue 中的 **编译时指令** 和 **运行时指令** 主要区别在于它们的执行时机、处理方式以及使用场景。这两类指令是 Vue 在处理模板时使用的核心机制，下面是它们的对比。

## 编译时指令 (Compile-time Directives)

**编译时指令** 是 Vue 在模板编译阶段处理的指令，这些指令在编译过程中被转换成 JavaScript 代码，并在页面渲染时执行。这些指令的功能通常是与模板的结构、数据绑定或组件的初始化有关。

- **执行时机**: 编译阶段，模板编译时就会转换成 JavaScript 代码。
- **特点**:

  - 在 Vue 编译模板时，指令会被编译成对应的 JavaScript 代码。
  - 这些指令的行为是确定的，并且通常不依赖于浏览器或运行时环境。
  - 它们会直接影响虚拟 DOM 树的创建。

- **示例**:

  - `v-if`、`v-for`、`v-bind`、`v-model` 等常见指令。
  - 它们会在 Vue 模板编译阶段解析，生成相应的渲染函数和逻辑。

- **实现过程**:
  - Vue 的编译器在编译模板时，会把这些指令转化为 JavaScript 代码，并插入到渲染函数中。最终这些指令会在 DOM 更新时执行，并根据数据的变化来重新渲染。

**示例**:

```html
<div v-if="show">This is a conditionally rendered element.</div>
```

编译后，`v-if` 会被转换为类似以下的代码：

```js
import { createCommentVNode as _createCommentVNode, createElementBlock as _createElementBlock, openBlock as _openBlock } from 'vue'

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_ctx.show)
    ? (_openBlock(), _createElementBlock('div', { key: 0 }, 'This is a conditionally rendered element.'))
    : _createCommentVNode('v-if', true)
}
```

## 运行时指令 (Runtime Directives)

**运行时指令** 是在 Vue 应用的运行时进行解析和处理的指令。它们在页面加载并渲染之后，指令的功能会被动态地执行，通常用于在已生成的虚拟 DOM 上添加额外的行为或动态操作。

- **执行时机**: 运行时，Vue 需要在页面渲染后对 DOM 或虚拟 DOM 执行相关操作。
- **特点**:

  - 在模板编译后，运行时指令会动态地绑定和执行。
  - 它们通常涉及到 DOM 操作或事件监听，并且需要依赖于组件实例或全局状态。
  - 这些指令的功能通常更加灵活，可以直接对 DOM 进行操作。

- **示例**:

  - `v-on`（事件监听指令）和 `v-bind`（动态属性绑定指令）等。
  - 这些指令在运行时会绑定事件、修改属性等，处理动态行为。

- **实现过程**:
  - 运行时指令通常通过 Vue 的 `vnode`（虚拟节点）来动态绑定事件、设置属性或指令等。例如，当绑定一个事件时，`v-on` 会在 Vue 运行时将事件监听器附加到目标元素。

**示例**:

```html
<div v-show="show">This is a conditionally rendered element.</div>
```

```js
import { createElementBlock as _createElementBlock, openBlock as _openBlock, vShow as _vShow, withDirectives as _withDirectives } from 'vue'

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return _withDirectives((_openBlock(), _createElementBlock('div', null, 'This is a conditionally rendered element.', 512 /* NEED_PATCH */)), [
    [_vShow, _ctx.show]
  ])
}
```

## 编译时指令 vs 运行时指令对比

| 特性         | 编译时指令                                     | 运行时指令                                        |
| ------------ | ---------------------------------------------- | ------------------------------------------------- |
| **执行时机** | 模板编译阶段                                   | 页面渲染后，运行时阶段                            |
| **主要作用** | 生成虚拟 DOM 和 JavaScript 代码，影响 DOM 结构 | 绑定事件、操作 DOM，或进行动态交互                |
| **实现方式** | 在 Vue 编译器中直接编译模板，转换成 JavaScript | 运行时解析并应用指令，通常依赖于浏览器的 DOM 操作 |
| **功能依赖** | 指令的行为通常在编译阶段就确定                 | 指令的行为通常依赖于组件的状态和生命周期          |
| **示例**     | `v-if`, `v-for`, `v-bind`, `v-model`(编译时)   | `v-show`,`v-model`(运行时) 还有你定义的指令 等    |
| **动态性**   | 通常是静态的（例如模板中条件判断）             | 动态的，可以响应事件和用户交互                    |
| **操作**     | 影响虚拟 DOM 树的生成和更新                    | 执行事件处理、属性绑定、DOM 操作等                |

## 总结

- **编译时指令** 在 Vue 模板编译阶段就已经处理，决定了如何生成虚拟 DOM。
- **运行时指令** 则在应用运行时被处理，通常涉及到动态行为，如事件监听、动态属性绑定等。

两者的结合使得 Vue 能够提供高效、动态的模板编译和渲染过程，同时也使开发者能够灵活地控制界面交互和数据变化。

## 编译时指令以及如何自定义

- [v-for](https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/compiler-core/src/transforms/vFor.ts)
- [v-if](https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/compiler-core/src/transforms/vIf.ts)
- 自定义编译时指令 `v-file`
