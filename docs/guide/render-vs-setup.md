# render vs setup render 函数

在 Vue 3 中，`render` 函数和 `setup` 中返回的 `render` 函数有着不同的定位和使用场景。

## render 函数（Options API）

`render` 函数是 Vue 组件的核心渲染函数，用于返回虚拟 DOM（VNode）。它通常在 Options API 中定义：

```js
import { h } from 'vue'

const MyComponent = {
  render() {
    return h('div', { class: 'example' }, 'Hello, World!')
  }
}
```

- 位于组件的 Options API 中
- 适合不使用模板语法、需要完全控制渲染过程的场景

## setup 返回的 render 函数（Composition API）

`setup` 是 Vue 3 Composition API 的核心，在组件初始化阶段执行。你可以在 `setup` 中返回一个渲染函数：

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

- `setup` 中可以使用 `ref`、`reactive`、`computed` 等响应式 API
- 返回的渲染函数会自动依赖这些响应式数据，数据变化时自动重新渲染
- 比 Options API 的 `render` 更加模块化

## 主要区别

### 生命周期

- `render` 函数：在组件的 `beforeMount` 阶段被调用，是模板解析后的渲染逻辑
- `setup` 返回的 render：`setup` 在组件初始化阶段执行，比 `render` 更早。`setup` 的返回值直接决定组件的渲染方式

### 使用方式

- `render` 函数：Options API 的一个选项，直接控制渲染逻辑
- `setup` 返回的 render：Composition API 的一部分，可以在 `setup` 中组织响应式数据、计算属性和副作用，然后返回渲染函数

### 模板编译

- `render` 函数：如果使用模板语法，Vue 会自动将模板编译为 `render` 函数
- `setup` 返回的 render：完全通过 JavaScript 控制渲染，不依赖模板编译系统

### 状态和响应性

- `render` 函数：使用组件中的 `data`、`computed` 或 `props` 来渲染视图
- `setup` 返回的 render：使用 `ref`、`reactive`、`computed` 等响应式 API，返回的渲染函数会自动追踪依赖

## 对比总结

| 特性                   | `render` 函数                            | `setup` 返回的 `render` 函数                                          |
| ---------------------- | ---------------------------------------- | --------------------------------------------------------------------- |
| 作用                   | 返回虚拟 DOM（VNode）并控制组件渲染      | `setup` 中的返回值，通常用于组合逻辑后返回渲染函数                    |
| 使用场景               | 使用 Options API 时控制渲染逻辑          | 使用 Composition API 时组织逻辑并返回渲染函数                         |
| 生命周期调用时机       | `beforeMount` 及渲染过程中               | `setup` 执行时，优先于渲染函数                                        |
| 与响应式数据的集成     | 依赖于组件的响应式数据、props            | 在 `setup` 中可使用响应式 API (`ref`, `reactive`)，返回值会响应变化   |
| 模板支持               | 支持模板语法，会被转换为 `render` 函数   | 不使用模板，而是通过 `h` 函数直接创建虚拟 DOM                         |

## 推荐用法

- 日常开发推荐使用 `<script setup>` + `<template>` 模板语法，开发体验最好
- 需要高度动态渲染时，使用 `setup` 返回渲染函数（配合 JSX 更佳）
- Options API 的 `render` 函数更适合 Vue 2 风格的项目或渐进式迁移场景
