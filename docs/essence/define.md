# defineXXX 的本质

Vue 里的 `defineXXX` 看起来像一组风格统一的 API，但它们其实并不属于同一类机制。

最重要的判断先说在前面：

> 有些 `defineXXX` 是运行时函数，有些是编译宏。它们长得像一组 API，底层却不在同一层工作。

如果这一点不先分清，后面就很容易把 Vue 的编译期能力和运行时能力混在一起。

## 先学会最重要的判断方法

一个很实用的区分方式是：

### 运行时函数

- 可以在普通 `.js/.ts` 文件中使用
- 需要真实 import
- 会出现在最终运行时代码里

### 编译宏

- 只能在 `<script setup>` 中使用
- 不需要 import
- 编译后会被“擦除”或展开成别的运行时代码

这条判断标准比死记名字更重要。

## 运行时函数

例如：

- `defineComponent`
- `defineAsyncComponent`
- `defineCustomElement`

它们都是真正的运行时函数，可以在任意 `.js/.ts` 文件中使用。

例如：

```js
import { defineComponent, h } from 'vue'

export default defineComponent({
  props: { msg: String },
  setup(props) {
    return () => h('div', props.msg)
  },
})
```

这段代码里：

- `defineComponent` 是真实执行的函数
- 它存在于运行时
- 构建之后也不会凭空消失

源码可参考：

https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/runtime-core/src/apiDefineComponent.ts#L305

## 编译宏函数

下面这些则更接近编译宏，只能在 `<script setup>` 中使用：

| 宏函数 | 作用 | 引入版本 |
| --- | --- | --- |
| `defineProps` | 声明组件 props | 3.0 |
| `defineEmits` | 声明组件事件 | 3.0 |
| `defineExpose` | 声明组件暴露的属性 | 3.0 |
| `defineSlots` | 声明插槽类型 | 3.3 |
| `defineOptions` | 声明组件选项 | 3.3 |
| `defineModel` | 声明双向绑定 model | 3.4 |

这些名字虽然像函数，但更准确地说，它们是编译器认识的“特殊标记”。

源码参考：

- https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/compiler-sfc/src/script/defineEmits.ts
- https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/compiler-sfc/src/script/defineSlots.ts

## 编译宏到底在做什么

它们不是在浏览器里执行“宏逻辑”，而是在 SFC 编译阶段被 Vue 提前识别，然后展开成真正的组件选项或运行时辅助代码。

所以可以这样理解：

- 你写的是 `defineProps()`
- 编译器看到的是“这里在声明 props”
- 最终产物里可能变成 `props` 选项、辅助变量或特定 helper

也正因为如此：

- 它们不需要 import
- 它们不能脱离 `<script setup>` 独立存在

## `defineProps` / `defineEmits` 的本质

这两个是最典型的宏。

它们的作用并不是“在运行时动态注册 props / emits”，而是让你用更接近 JavaScript 的方式，在 `<script setup>` 中声明组件契约。

从本质上说：

- `defineProps` 最终会落到组件的 `props`
- `defineEmits` 最终会落到组件的 `emits`

所以它们更像声明语法，不是普通函数调用。

## `defineExpose` 的本质

`defineExpose` 用来声明组件要对父组件暴露哪些实例能力。

它同样是编译宏，但最终会和组件实例暴露机制接上。

所以它属于“编译期声明，运行时生效”的典型桥梁。

## `defineOptions` 的本质

`defineOptions` 用来在 `<script setup>` 中声明传统组件选项，例如：

- `name`
- `inheritAttrs`
- 自定义选项字段

例如：

```js
defineOptions({
  inheritAttrs: false,
})
```

它的本质，是把原本需要写在组件选项对象里的内容，挪到 `<script setup>` 里声明，再在编译时合并回组件定义。

所以它不是“新增运行时能力”，只是“让 `<script setup>` 能声明原本就在的选项”。

## `defineSlots` 的本质

`defineSlots` 最容易让人误解成运行时 API，其实它主要服务的是类型层。

例如：

```html
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { msg: string }): any
  header(props: { title: string }): any
}>()
</script>
```

它的重点不是改变插槽运行时机制，而是：

- 告诉 TypeScript 这里有哪些 slots
- 每个 slot 的 props 长什么样

所以它更像类型声明宏，而不是运行时插槽 API。

## `defineModel`（Vue 3.4+）

`defineModel` 是这组宏里最容易让人感觉“像黑魔法”的一个，但它本质仍然很朴素：

> 它只是把 `v-model` 对应的 prop + emit 协议样板代码隐藏了。

### 传统写法

```html
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

function updateValue(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <input :value="props.modelValue" @input="updateValue" />
</template>
```

### `defineModel` 写法

```html
<script setup>
const modelValue = defineModel()
</script>

<template>
  <input v-model="modelValue" />
</template>
```

它返回的是一个可读写的 `ref`，但不要被这个表象误导。  
它并不是发明了新的双向绑定机制，而是把既有协议编译展开了。

在当前 Vue 3.5.x 的产物里，它会更接近：

```js
import { useModel as _useModel } from 'vue'

export default {
  props: { modelValue: {}, modelModifiers: {} },
  emits: ['update:modelValue'],
  setup(__props) {
    const modelValue = _useModel(__props, 'modelValue')
    return { modelValue }
  },
}
```

这说明：

- `defineModel` 不是运行时魔法
- 它最终还是回到 props / emits / helper 的组合

支持多个 model：

```html
<script setup lang="ts">
const firstName = defineModel<string>('firstName', { required: true })
const lastName = defineModel<string>('lastName', { default: '' })
</script>
```

## 为什么编译宏不需要 import

因为它们不是运行时从 `vue` 包里取出来执行的普通函数。

编译器在处理 SFC 时，会直接扫描并识别这些特殊调用，然后把它们替换掉。

所以你可以把它理解成：

- 写法上像函数
- 工作方式上更像编译器关键字

## 一句话判断本质

如果一个 `defineXXX` 只能出现在 `<script setup>`，不需要 import，且编译后会被展开成组件选项或 helper，那么它本质上就是编译宏，不是普通运行时函数。

## 总结

| 类型 | 代表 | 本质 |
| --- | --- | --- |
| 运行时函数 | `defineComponent`、`defineAsyncComponent` | 真实运行时 API |
| 编译宏 | `defineProps`、`defineEmits`、`defineSlots`、`defineModel` | 编译期声明语法 |
| `defineModel` | `v-model` 简化写法 | 隐藏 prop + emit 协议样板代码 |
| `defineSlots` | slots 类型声明 | 主要服务类型系统 |
