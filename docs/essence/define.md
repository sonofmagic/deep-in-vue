# defineXXX 的本质

实际上 `defineXXX` 函数，有些是编译宏函数，有些是运行时函数。

## 如何辨别编译/运行时函数

看他们是否是在任意的 `js/ts` 中可以定义，还是只能在 `vue` 中 `script setup` 代码块定义的。

另外，编译时函数在产物中是被干掉的，是不可见的。原因在于他们的运行是在 `nodejs` 部分，被直接覆盖掉。

## 运行时函数

`defineComponent` / `defineAsyncComponent` / `defineCustomElement` 是运行时函数，可以在任意 `.js/.ts` 文件中使用：

源代码：https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/runtime-core/src/apiDefineComponent.ts#L305

```js
import { defineComponent, h } from 'vue'

// 可以在任意 .ts 文件中使用
export default defineComponent({
  props: { msg: String },
  setup(props) {
    return () => h('div', props.msg)
  },
})
```

## 编译宏函数

以下函数本质上是编译宏，只能在 `<script setup>` 中使用，编译后会被替换为实际的运行时代码：

| 宏函数          | 作用                     | 引入版本 |
| --------------- | ------------------------ | -------- |
| `defineProps`   | 声明组件 props           | 3.0      |
| `defineEmits`   | 声明组件事件             | 3.0      |
| `defineExpose`  | 声明组件暴露的属性       | 3.0      |
| `defineSlots`   | 声明插槽类型（仅类型）   | 3.3      |
| `defineOptions` | 声明组件选项（如 name）  | 3.3      |
| `defineModel`   | 声明双向绑定的 model     | 3.4      |

源代码参考：

- https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/compiler-sfc/src/script/defineEmits.ts
- https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/compiler-sfc/src/script/defineSlots.ts

## defineModel（Vue 3.4+）

`defineModel` 是 Vue 3.4 引入的编译宏，极大简化了组件的 `v-model` 双向绑定。

之前实现 `v-model` 需要手动声明 prop + emit：

```html
<script setup>
  // 之前的写法：需要手动管理 prop 和 emit
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

使用 `defineModel` 后，一行搞定：

```html
<script setup>
  // Vue 3.4+ 的写法：直接返回一个可读写的 ref
  const modelValue = defineModel()
</script>

<template>
  <input v-model="modelValue" />
</template>
```

`defineModel` 返回的是一个 `ref`，可以直接读写，编译器会自动帮你处理 prop 声明和 emit 触发。

支持多个 model 和类型声明：

```html
<script setup lang="ts">
  const firstName = defineModel<string>('firstName', { required: true })
  const lastName = defineModel<string>('lastName', { default: '' })
</script>
```

## defineSlots 示例

[`defineSlots`](https://play.vuejs.org/#eNq1UsFu1DAQ/ZXBl2ylshGCU5SuBKgScABEkbj4EiWzqYsztuzJErTKvzN2uu12BXuiOc3Me895Y7+9euv9ejeiqpQmTXVsg/EMEXn0YBvqr7TiqNVGkxm8Cwx7CLiFGbbBDVCItEjC1lFkGGIPVwlfFR/QWgc/XLDdi+LikRKt4yikDreG8CZ19V4TpEEzWl754Hys5DdyWAWRg6Ee5osKGvqtad6s5LC6XHyKK2kYB28bRukA6ttXm30WwzzXpXR5asiPDLuXg+vQyk6CawWlgHV5pFeXsq0Y3Zp+fRcdybVkc1q1bvDGYvji2cgiWonFhCSskVV/fcozDiNeHubtLbY//zK/i1OaafU1YMSwQ60eMG5Cj7zA1zefcZL6ART3oxX2GfAbRmfH5HGhvRupE9tHvOz2Y35Mudrv8XpipHhYKhlNzDnztZIHfn9m9Ue7r9dvsk7eSG4xae5zdcjUP9K0BCHxHSHxSbJwyrT7cJySV9kHNQNWUEzyiWJ+mo/nS/R/zPNpoo89b86FvTO7XEiZjORAS10u86fRnv8ALJNXIw==) 用于声明插槽的类型，帮助 TypeScript 推导插槽 props：

```html
<script setup lang="ts">
  const slots = defineSlots<{
    default(props: { msg: string }): any
    header(props: { title: string }): any
  }>()
</script>
```

## 编译宏的本质

所有编译宏在编译后都会被"擦除"，替换为对应的运行时代码。比如 `defineProps` 会变成组件选项中的 `props` 字段，`defineEmits` 会变成 `emits` 字段。

这就是为什么编译宏不需要 `import`，也不能在 `<script setup>` 之外使用——它们只存在于编译阶段。
