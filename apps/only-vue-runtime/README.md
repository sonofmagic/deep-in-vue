# 纯运行时示例

这个示例用来观察：如果不写 `.vue` 模板，只使用 Vue 运行时 API，Vue 项目还能怎样工作。

## h 函数的本质

`h()` 的本质是对 `createVNode()` 的开发者友好封装。

`createVNode()` 也是对 `createBaseVNode()` 的进一步封装。它们都服务于同一件事：创建 Vue 运行时可以理解的 VNode。

编译一个 Vue 文件，会生成一个 `render` 函数，这个函数会调用类似下面这些运行时 helper：

- `toDisplayString`
- `createElementVNode`
- `vModelText`
- `withDirectives`
- `Fragment`
- `openBlock`
- `createElementBlock`

```ts
const Fragment = Symbol.for('v-fgt')
const Text = Symbol.for('v-txt')
const Comment = Symbol.for('v-cmt')
const Static = Symbol.for('v-stc')
```

`toDisplayString` 是你在 Vue 中使用 `{{ obj }}` 仍能正常展示的原因。假如一个对象直接调用 `toString()`，通常只会得到 `[object Object]`。

`createElementVNode` 是 `createBaseVNode` 的别名，主要面向原生 HTML 元素和部分 Vue 内置节点（例如 `Fragment`）。它不像 `h()` 那样以开发者体验为目标，也不适合作为日常手写渲染函数的首选入口。

可以在 [play.vuejs.org](https://play.vuejs.org/) 里输入一个最小模板，切到编译结果面板对照这些 helper。
