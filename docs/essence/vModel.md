# v-model 的本质

在 Vue 3 中，`v-model` 指令的本质是**语法糖**：它将 prop 绑定和事件监听合并为一个简洁的写法，实现父子组件之间的双向数据绑定。

## 原生元素上的 v-model

在原生 `<input>` 上使用 `v-model`：

```html
<input v-model="msg" />
```

编译后等价于：

```js
import { vModelText as _vModelText, withDirectives as _withDirectives } from 'vue'

// v-model 在原生元素上会编译为运行时指令 vModelText
_withDirectives(
  _createElementVNode('input', {
    'onUpdate:modelValue': ($event) => (_ctx.msg = $event),
  }),
  [[_vModelText, _ctx.msg]]
)
```

注意：原生元素上的 `v-model` 使用的是**运行时指令**（`vModelText`），而不是纯编译时转换。

## 组件上的 v-model

在自定义组件上使用 `v-model`：

```html
<CustomInput v-model="text" />
```

编译后等价于：

```html
<CustomInput :modelValue="text" @update:modelValue="val => text = val" />
```

也就是说，`v-model` 在组件上是纯粹的**编译时语法糖**，展开为：

- 绑定 `modelValue` prop
- 监听 `update:modelValue` 事件

## 子组件的实现

### 传统写法（手动 prop + emit）

```html
<script setup>
  const props = defineProps(['modelValue'])
  const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

### Vue 3.4+ 写法：defineModel

Vue 3.4 引入了 `defineModel` 编译宏，极大简化了 `v-model` 的实现：

```html
<script setup>
  // 返回一个可读写的 ref，自动处理 prop 和 emit
  const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>
```

`defineModel()` 返回的是一个 `ref`，读取时获取父组件传入的值，写入时自动触发 `update:modelValue` 事件。编译器帮你处理了所有样板代码。

## 多个 v-model 绑定

Vue 3 支持在同一个组件上使用多个 `v-model`：

```html
<!-- 父组件 -->
<UserForm v-model:firstName="first" v-model:lastName="last" />
```

子组件使用 `defineModel` 实现：

```html
<script setup>
  const firstName = defineModel('firstName')
  const lastName = defineModel('lastName')
</script>

<template>
  <input v-model="firstName" placeholder="First Name" />
  <input v-model="lastName" placeholder="Last Name" />
</template>
```

编译后，`v-model:firstName="first"` 展开为：

```html
<UserForm
  :firstName="first"
  @update:firstName="val => first = val"
  :lastName="last"
  @update:lastName="val => last = val"
/>
```

## v-model 修饰符

`v-model` 支持内置修饰符和自定义修饰符：

```html
<!-- 内置修饰符 -->
<input v-model.trim="msg" />
<input v-model.number="age" />
<input v-model.lazy="msg" />

<!-- 自定义修饰符 -->
<CustomInput v-model.capitalize="text" />
```

在子组件中可以通过 `defineModel` 的第二个参数访问修饰符：

```html
<script setup>
  const [model, modifiers] = defineModel({
    set(value) {
      if (modifiers.capitalize) {
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
      return value
    },
  })
</script>
```

## 总结

| 场景         | v-model 的本质                                                |
| ------------ | ------------------------------------------------------------- |
| 原生元素     | 编译为运行时指令（`vModelText` 等）+ `onUpdate:modelValue`    |
| 自定义组件   | 编译时语法糖，展开为 `:modelValue` + `@update:modelValue`     |
| 多个 v-model | 通过 `v-model:propName` 指定不同的 prop 和对应的 update 事件  |
| defineModel  | Vue 3.4+ 编译宏，返回可读写 ref，自动处理 prop 和 emit       |
