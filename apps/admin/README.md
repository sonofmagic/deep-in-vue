# h 函数的本质

h 函数的本质是对 createVNode 的二次封装

createVNode 也是对 createBaseVNode 的二次封装

编译一个 vue 文件，会生成一个 render 函数，这个函数会调用像是

toDisplayString , createElementVNode , vModelText, withDirectives , Fragment, openBlock, createElementBlock 这些非常底层的函数或者标识符

```ts
const Fragment = Symbol.for('v-fgt')
const Text = Symbol.for('v-txt')
const Comment = Symbol.for('v-cmt')
const Static = Symbol.for('v-stc')
```

toDisplayString 是你在 vue 中使用 `{{ obj }}` 还能正常展示的原因，假如一个对象直接 `toString`，会得到 `[object Object]`

createElementVNode 是 createBaseVNode 的别名, 这个只能默认的 h5 元素和一些 vue 自己扩展的元素(比如 `Fragment`)，不像 h 还可以渲染组件
