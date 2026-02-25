# 编译时指令 vs 运行时指令

这篇文档给一个更准确的口径：Vue 模板里的“指令”并不只有两类，很多常见指令同时包含编译期和运行期逻辑。

## 先区分三种机制

1. 结构性编译转换（只在编译期）
2. 编译期转换 + 运行时 patch（最常见）
3. 运行时指令（`withDirectives` / 自定义指令）

## 1) 结构性编译转换（Compile-time only）

典型是 `v-if` / `v-else-if` / `v-else`、`v-for`。

它们会直接改写模板 AST 结构，最终生成不同的渲染分支。运行时不会再“解释 v-if 语法”，而是执行已经生成好的 JS 分支逻辑。

```html
<div v-if="show">visible</div>
```

简化后的编译结果：

```js
return _ctx.show
  ? (_openBlock(), _createElementBlock('div', null, 'visible'))
  : _createCommentVNode('v-if', true)
```

## 2) 编译期转换 + 运行时 patch（Hybrid）

典型是 `v-bind`、`v-on`、组件上的 `v-model`。

这些语法在编译期会被展开成更底层的 `props` / `onXxx` / `modelValue` + `update:modelValue`，然后由运行时 patch 机制去完成真实更新。

- `v-bind:class` 编译成动态 `class` prop
- `@click` 编译成 `onClick`
- 组件 `v-model` 编译成 `modelValue` 与 `onUpdate:modelValue`

所以它们不是“纯运行时指令”。

## 3) 运行时指令（Runtime directives）

典型是：

- `v-show`
- 自定义指令 `v-my-directive`
- 原生元素上的 `v-model`（会用到 `vModelText` 等运行时指令）

这类会生成 `withDirectives(...)`，由运行时指令钩子处理：

```html
<div v-show="show" />
```

```js
return _withDirectives(_createElementVNode('div'), [[_vShow, _ctx.show]])
```

## 对比表（更精确）

| 场景 | 主要阶段 | 示例 |
| --- | --- | --- |
| 结构改写 | 编译期 | `v-if`、`v-for` |
| 语法展开 + patch | 编译期 + 运行期 | `v-bind`、`v-on`、组件 `v-model` |
| 运行时指令钩子 | 运行期 | `v-show`、自定义指令、原生元素 `v-model` |

## 总结

- 不要把所有指令简单分成“编译时”或“运行时”两类。
- Vue 里大量指令是“编译展开 + 运行时执行”的组合。
- 真正意义上的运行时指令，通常能在产物里看到 `withDirectives`。

## 参考

- [v-for transform](https://github.com/vuejs/core/blob/main/packages/compiler-core/src/transforms/vFor.ts)
- [v-if transform](https://github.com/vuejs/core/blob/main/packages/compiler-core/src/transforms/vIf.ts)
- [v-on transform](https://github.com/vuejs/core/blob/main/packages/compiler-core/src/transforms/vOn.ts)
- [v-bind transform](https://github.com/vuejs/core/blob/main/packages/compiler-core/src/transforms/vBind.ts)
