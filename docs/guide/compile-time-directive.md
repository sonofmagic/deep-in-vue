# 编译时指令 vs 运行时指令

这篇文档想给出一个更准确的口径：

> Vue 模板里的“指令”并不只有两类，很多常见指令同时包含编译期和运行期逻辑。

如果只把它们简单分成“编译时指令”和“运行时指令”，很容易越学越混乱。

## 先区分三种机制

从产物角度看，更实用的分类方式是：

1. 结构性编译转换（只在编译期）
2. 编译期转换 + 运行时 patch（最常见）
3. 运行时指令（`withDirectives` / 自定义指令）

这三类的差异，核心不在“写法长得像不像指令”，而在于：

- 它是否会改写模板结构
- 它是否会在产物中保留运行时辅助逻辑
- 它是否会生成真正的指令调用

## 1. 结构性编译转换（Compile-time only）

典型是 `v-if` / `v-else-if` / `v-else`、`v-for`。

它们会直接改写模板 AST 结构，最终生成不同的渲染分支。运行时不会再“解释 v-if 语法”，而是执行已经生成好的 JavaScript 分支逻辑。

```html
<div v-if="show">visible</div>
```

简化后的编译结果：

```js
return _ctx.show
  ? (_openBlock(), _createElementBlock('div', null, 'visible'))
  : _createCommentVNode('v-if', true)
```

这里运行时只是在执行一个条件分支，不是在“读取 v-if 指令”。

### 判断标准

如果一个能力在编译后已经变成普通分支、循环或节点结构差异，而且运行时不再保留对应指令钩子，那它更接近“结构性编译转换”。

## 2. 编译期转换 + 运行时 patch（Hybrid）

典型是 `v-bind`、`v-on`、组件上的 `v-model`。

这些语法在编译期会被展开成更底层的 `props` / `onXxx` / `modelValue` + `update:modelValue`，然后由运行时 patch 机制去完成真实更新。

- `v-bind:class` 编译成动态 `class` prop
- `@click` 编译成 `onClick`
- 组件 `v-model` 编译成 `modelValue` 与 `onUpdate:modelValue`

所以它们不是“纯运行时指令”。

### 为什么这类最容易混淆

因为开发时你写的是模板指令语法，但最终运行时主要处理的是：

- prop 更新
- 事件绑定
- 组件协议

也就是说，**语法是指令风格，执行却更像普通 patch 行为**。

## 3. 运行时指令（Runtime directives）

典型是：

- `v-show`
- 自定义指令 `v-my-directive`
- 原生元素上的 `v-model`（会用到 `vModelText` 等运行时指令）

这类通常会生成 `withDirectives(...)`，由运行时指令钩子处理：

```html
<div v-show="show" />
```

```js
return _withDirectives(_createElementVNode('div'), [[_vShow, _ctx.show]])
```

这时“指令”在运行时仍然真实存在。

## 为什么 `v-model` 会让人误判

`v-model` 本身就是一个非常典型的“不要粗暴二分”的例子。

### 组件上的 `v-model`

更接近“编译展开 + 组件 patch 协议”：

- 编译成 `modelValue`
- 编译成 `onUpdate:modelValue`
- 运行时按组件通信规则处理

### 原生元素上的 `v-model`

更接近“编译展开 + 运行时指令辅助”：

- 会保留像 `vModelText` 这样的运行时 helper
- 最终仍需要运行时去处理 DOM 表单状态同步

所以同样叫 `v-model`，落到不同目标节点时，机制并不完全一样。

## 对比表

| 场景 | 主要阶段 | 常见产物特征 | 示例 |
| --- | --- | --- | --- |
| 结构改写 | 编译期 | 条件分支、循环、节点结构变化 | `v-if`、`v-for` |
| 语法展开 + patch | 编译期 + 运行期 | `props`、`onXxx`、组件协议 | `v-bind`、`v-on`、组件 `v-model` |
| 运行时指令钩子 | 运行期 | `withDirectives(...)`、运行时 helper | `v-show`、自定义指令、原生元素 `v-model` |

## 实战里怎么快速判断

看编译产物时，可以用这套简单判断法：

1. 看到条件分支、循环结构变化，优先想“结构性编译转换”
2. 看到 `props` / `onClick` / `onUpdate:modelValue`，优先想“编译展开 + patch”
3. 看到 `withDirectives`，基本就进入“运行时指令”范畴了

## 总结

- 不要把所有指令简单分成“编译时”或“运行时”两类。
- Vue 里大量指令其实是“编译展开 + 运行时执行”的组合。
- 真正意义上的运行时指令，通常能在产物里看到 `withDirectives` 或对应运行时 helper。

## 参考

- [v-for transform](https://github.com/vuejs/core/blob/main/packages/compiler-core/src/transforms/vFor.ts)
- [v-if transform](https://github.com/vuejs/core/blob/main/packages/compiler-core/src/transforms/vIf.ts)
- [v-on transform](https://github.com/vuejs/core/blob/main/packages/compiler-core/src/transforms/vOn.ts)
- [v-bind transform](https://github.com/vuejs/core/blob/main/packages/compiler-core/src/transforms/vBind.ts)
