# v-model 的本质

在 Vue 3 中，`v-model` 的本质是语法糖。

但只说“语法糖”还不够准确，因为它在不同目标上，机制并不完全一样。

更完整的说法应该是：

> `v-model` 会把“双向绑定”拆成更底层的 prop 绑定、事件监听和必要的运行时辅助；在原生元素和自定义组件上，它的落地方式并不相同。

## 为什么 `v-model` 容易让人误解

因为它表面上只有一个写法：

```html
<input v-model="msg" />
<CustomInput v-model="text" />
```

但这两种写法的底层实现并不一样。

## 原生元素上的 v-model

```html
<input v-model="msg" />
```

编译后大致等价于：

```js
import { vModelText as _vModelText, withDirectives as _withDirectives } from 'vue'

_withDirectives(
  _createElementVNode('input', {
    'onUpdate:modelValue': ($event) => (_ctx.msg = $event),
  }),
  [[_vModelText, _ctx.msg]]
)
```

这里最关键的是：

- 有 `onUpdate:modelValue`
- 也有运行时指令 `vModelText`
- 还会通过 `withDirectives(...)` 包装

这说明原生元素上的 `v-model` 不是纯编译后就结束了，而是**编译展开 + 运行时指令辅助**。

原因也很直接：DOM 表单元素的值同步，本来就需要运行时参与。

## 组件上的 v-model

```html
<CustomInput v-model="text" />
```

编译后等价于：

```html
<CustomInput
  :modelValue="text"
  @update:modelValue="val => text = val"
/>
```

也就是说，组件上的 `v-model` 更接近纯粹的编译期语法糖，它会展开为：

- 绑定 `modelValue` prop
- 监听 `update:modelValue` 事件

这时运行时的核心不再是 DOM 指令处理，而是组件通信协议。

## 所以 `v-model` 的本质到底是什么

可以分成两层理解：

### 表层理解

它让“prop + event”这种双向同步协议写起来更短。

### 底层理解

它把一个统一的模板语法，映射到两类不同目标：

- 原生元素：依赖运行时指令和 DOM 同步逻辑
- 自定义组件：依赖 `modelValue` / `update:modelValue` 协议

## 子组件的传统实现

### 手动 prop + emit

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

这已经把 `v-model` 的本质暴露得很清楚了：

- 父组件传值
- 子组件通过事件把新值抛回去

双向绑定并不神秘，本质上就是**单向下发 + 事件上抛**。

## Vue 3.4+：`defineModel`

Vue 3.4 引入了 `defineModel` 编译宏，用来减少上面的样板代码：

```html
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>
```

`defineModel()` 返回一个可读写的 `ref`：

- 读取时拿到父组件传入值
- 写入时自动触发 `update:modelValue`

也就是说，它不是绕开了 `v-model` 协议，而是编译器替你把协议代码藏起来了。

> 注意：如果你给 `defineModel` 设置了 `default`，而父组件没有传对应 `v-model` 值，子组件内部会先拿到默认值，这可能与父组件的 `undefined` 形成初始不一致。组件库设计时需要明确说明这个行为。

## 多个 v-model

Vue 3 支持在同一个组件上使用多个 `v-model`：

```html
<UserForm v-model:firstName="first" v-model:lastName="last" />
```

子组件可以这样实现：

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

编译后，本质上还是变成不同 prop / event 对：

```html
<UserForm
  :firstName="first"
  @update:firstName="val => first = val"
  :lastName="last"
  @update:lastName="val => last = val"
/>
```

所以“多个 `v-model`”并不是新机制，只是把这套协议推广到多个字段。

## v-model 修饰符

`v-model` 支持内置修饰符和自定义修饰符：

```html
<input v-model.trim="msg" />
<input v-model.number="age" />
<input v-model.lazy="msg" />

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

修饰符本质上也是编译器与运行时协作的一部分：  
它们不是“附加魔法”，而是对数据读写时机或值转换策略的补充。

## 一句话理解

`v-model` 并不是“真正的双向魔法绑定”，而是 Vue 把一套很常见的同步协议缩写成了统一语法。

所以你越理解它编译后展开成什么，就越不会被它表面的简洁写法误导。

## 总结

| 场景 | `v-model` 的本质 |
| --- | --- |
| 原生元素 | 编译展开 + 运行时指令（如 `vModelText`）+ 值同步 |
| 自定义组件 | 编译期语法糖，展开为 `prop + update 事件` |
| 多个 `v-model` | 同一协议映射到多个 prop / event 对 |
| `defineModel` | 编译宏，帮你隐藏样板代码，但不改变底层协议 |
