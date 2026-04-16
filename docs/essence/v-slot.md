# v-slot 的本质

如果说 [slot 的本质](./slot.md) 解决的是“插槽最终是什么”，那么这一篇要解决的是：

> `v-slot` 这层模板语法，到底在编译时帮我们做了什么？

最短答案是：

> `v-slot` 的本质，是把父组件模板中的插槽内容编译成一个或多个插槽函数，并按约定的名称和参数结构传给子组件。

所以 `v-slot` 不是单独的一套运行时机制，而是**插槽函数的模板声明语法**。

## 先把关系理清

- `slot`：子组件里定义“内容插入点”
- `v-slot` / `#`：父组件里定义“我要传什么内容”

也就是说：

- `slot` 站在子组件视角
- `v-slot` 站在父组件视角

它们是同一机制的两面。

## 最简单的默认插槽

```vue
<ChildComponent v-slot="slotProps">
  <p>{{ slotProps.message }}</p>
</ChildComponent>
```

编译后，大致会变成：

```js
function render() {
  return createVNode(ChildComponent, null, {
    default: (slotProps) => {
      return createVNode('p', null, slotProps.message)
    },
  })
}
```

这个结果已经把本质说明白了：

- `v-slot` 最终会生成一个 `default` 函数
- 这个函数接收子组件传来的 slot props
- 函数返回一段 VNode

所以 `v-slot="slotProps"` 本质上就是在声明：

“请把默认插槽编译成一个接收参数的函数。”

## 具名插槽的本质

```vue
<ChildComponent v-slot:header="slotProps">
  <h1>{{ slotProps.title }}</h1>
</ChildComponent>
```

编译后，大致类似：

```js
function render() {
  return createVNode(ChildComponent, null, {
    header: (slotProps) => {
      return createVNode('h1', null, slotProps.title)
    },
  })
}
```

这里和默认插槽相比，只是把 `default` 换成了 `header`。

也就是说，具名插槽的本质并不复杂：

- 仍然是函数
- 只是这个函数被挂到了不同的 name 上

## 为什么 `v-slot` 看起来像指令

因为它的语法形式确实是指令：

```html
<Child v-slot:header="props" />
```

但从产物角度看，它不是像 `v-show` 那样进入运行时指令系统，而是会直接参与模板编译，生成 slots 对象。

所以它更接近：

- 编译阶段的插槽声明语法
- 而不是运行时指令钩子

## 作用域插槽的本质

这是 `v-slot` 最核心的价值所在。

所谓“作用域插槽”，本质上就是：

- 子组件调用插槽函数时传入参数
- 父组件通过 `v-slot` 声明接收这些参数

例如：

```vue
<ChildComponent v-slot:default="slotProps">
  <p>{{ slotProps.message }}</p>
</ChildComponent>
```

它不是把子组件变量暴露给父组件模板，而是一次非常普通的函数参数传递。

所以你完全可以这样记：

- `slot` 让子组件可以调用一个函数
- `v-slot` 让父组件可以定义这个函数长什么样

## `#` 为什么只是语法糖

下面两种写法等价：

```html
<template v-slot:header>
  <h1>标题</h1>
</template>
```

```html
<template #header>
  <h1>标题</h1>
</template>
```

`#` 只是 `v-slot:` 的缩写，本质没有变化。

## 编译时真正发生了什么

站在编译器角度，`v-slot` 主要做了这些事：

1. 识别插槽名称
2. 识别是否有作用域参数
3. 把插槽内容包装成函数
4. 组装成传给子组件的 `slots` 对象

所以它最终不是“创建 slot 节点”，而是**构造 slots 这个函数对象结构**。

## `withCtx` 为什么会出现

在一些编译产物或源码里，你会看到 `withCtx`。

它的作用可以简单理解为：

- 确保插槽函数在正确的组件渲染上下文中执行
- 避免插槽内容丢失父组件上下文语义

相关源码可参考：

[withCtx](https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/runtime-core/src/componentRenderContext.ts#L70)

所以 `withCtx` 不是插槽的本体，而是插槽函数上下文管理的一部分。

## 一句话理解

`v-slot` 不是“把一段模板塞进去”，而是把父组件模板编译成一个命名明确、可接收参数的插槽函数，再传给子组件。

## 总结

| 特性 | 说明 |
| --- | --- |
| 本质 | 声明并生成插槽函数 |
| 默认插槽 | 生成 `default` 函数 |
| 具名插槽 | 生成命名函数，如 `header` |
| 作用域插槽 | 生成带参数的插槽函数 |
| `#` | `v-slot:` 的语法糖 |
