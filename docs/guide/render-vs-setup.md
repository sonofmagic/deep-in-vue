# render 函数 vs setup 返回 render 函数

在 Vue 3 中，`render` 函数和 `setup` 中返回的渲染函数有着不同的定位和使用场景。

它们都能生成 VNode，但组织方式不同，背后的心智模型也不同。

## 先说结论

如果只想抓住最核心差别，可以记这句：

> `render` 是组件定义上的渲染入口，`setup` 返回的 render 则是把“状态组织”和“渲染表达”放进了同一个闭包里。

两者最后都会进入 Vue 渲染流程，但前者更像 Options API 时代的组件声明方式，后者更像 Composition API 风格下的函数式组织方式。

## render 函数（Options API）

`render` 函数是 Vue 组件的核心渲染入口，用于返回虚拟 DOM（VNode）。它通常在 Options API 中定义：

```js
import { h } from 'vue'

const MyComponent = {
  render() {
    return h('div', { class: 'example' }, 'Hello, World!')
  }
}
```

特点：

- 位于组件选项对象中
- 适合不使用模板语法、需要直接控制渲染过程的场景
- 更贴近传统 Options API 风格

## setup 返回的 render 函数（Composition API）

`setup` 是 Vue 3 Composition API 的核心。你可以在 `setup` 中组织状态和逻辑，然后直接返回一个渲染函数：

```js
import { h, ref } from 'vue'

const MyComponent = {
  setup() {
    const count = ref(0)

    return () => h('div', { class: 'example' }, [
      h('span', `Count: ${count.value}`),
      h('button', { onClick: () => count.value++ }, '增加'),
    ])
  }
}
```

特点：

- `setup` 中可以直接使用 `ref`、`reactive`、`computed` 等响应式 API
- 返回的渲染函数天然形成闭包，直接访问这些状态
- 更适合把组合逻辑和渲染逻辑放在一起组织

## 两者的真正区别

### 1. 组织方式不同

- `render`：把渲染逻辑挂在组件定义对象上
- `setup` 返回 render：先组织状态，再返回渲染逻辑

### 2. 心智模型不同

- `render` 更像“组件有一个 render 入口”
- `setup` 返回 render 更像“组件初始化后，返回一个带状态闭包的渲染函数”

### 3. 与 Composition API 的贴合程度不同

- `render` 可以用 Composition API，但风格上没那么自然
- `setup` 返回 render 与 Composition API 的组合方式更一致

## 生命周期视角

- `setup` 在组件初始化阶段执行，比真正渲染更早
- `render` 会在挂载和后续更新时反复执行

如果是 `setup` 返回 render，那么可以理解为：

1. 先执行 `setup`
2. 在 `setup` 里建立状态和闭包
3. 再由返回的 render 函数参与后续渲染更新

## 和模板编译的关系

如果你写模板，Vue 最终也会把模板编译成 `render` 函数。

所以无论你是：

- 写 `<template>`
- 写组件选项里的 `render`
- 在 `setup` 里返回 render

最终都会落到“渲染函数 + 运行时”这条链路上。

区别只在于：这个 render 是你手写的，还是编译器帮你生成的；状态与渲染又是怎样被组织到一起的。

## 对比总结

| 特性 | `render` 函数 | `setup` 返回的 render 函数 |
| --- | --- | --- |
| 作用 | 返回 VNode 并控制组件渲染 | 在 `setup` 中组织逻辑后返回渲染函数 |
| 风格 | 更偏 Options API | 更偏 Composition API |
| 状态访问 | 通过组件上下文或返回值组织 | 直接闭包访问响应式状态 |
| 模板关系 | 模板最终也会编译到这里 | 不依赖模板，完全手写渲染 |
| 适用场景 | 历史项目、显式组件定义 | 高动态渲染、函数式组织、JSX 场景 |

## 实战里怎么选

### 优先推荐

日常业务开发仍然优先推荐：

- `<script setup>`
- `<template>`

因为开发体验最好，编译器优化也最充分。

### 更适合用 `setup` 返回 render 的场景

- 高度动态界面
- 逻辑和渲染强耦合
- 需要与 JSX / TSX 搭配
- 希望按 Composition API 方式组织组件

### 更适合保留 `render` 选项的场景

- Options API 历史项目
- 渐进式迁移代码
- 需要沿用旧组件组织方式

## 一句话理解

`render` 和 `setup` 返回 render 不是两个完全不同的渲染系统，而是两种不同的组件组织方式。

如果你把 Vue 看成“状态 + 渲染函数 + 运行时”，这两者的关系就会清晰很多。
