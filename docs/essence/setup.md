# script setup 语法糖

> `<script setup>` 是 Vue 3 提供的一种 **编译时语法糖**，它让你以更简洁的方式使用 Composition API，本质上会在**构建阶段**被 Vue 编译成普通的 `setup()` 函数。

换句话说：**你写的不是标准 JS，而是 Vue 编译器"预处理"前的代码。**

> 比如我们经常有个常识 `typescript` 定义的类型在 `js` 产物中会被丢弃，但是你也见过 `defineProps<Props>()` 中定义的 `Props`，的确会在产物中变成实实在在的 `js` 代码

## 举个例子

我们写一个最常见的 `<script setup>` 组件：

```html
<script setup>
  import { ref } from 'vue'

  const count = ref(0)

  function increment() {
    count.value++
  }
</script>

<template>
  <button @click="increment">Count: {{ count }}</button>
</template>
```

## 编译后会变成什么？

产物的效果等价于这样：

```html
<script>
  import { ref } from 'vue'

  export default {
    setup() {
      const count = ref(0)

      function increment() {
        count.value++
      }

      return {
        count,
        increment,
      }
    },
  }
</script>
```

`<script setup>` **自动帮你做了以下事**：

1. 自动放入 `setup()` 作用域中
2. 自动 `return` 所有顶层绑定（变量、函数）用于模板使用
3. 没有多余的 `export default` 或 `return {}`，更清爽

## 本质关键点

| 功能            | 实现机制                                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 编译时语法糖    | 构建时由 Vue 编译器解析（vite）                                                                                                     |
| 自动导出到模板  | 所有顶层变量都默认暴露给 `<template>`                                                                                               |
| 更好的类型推导  | 对于 `TypeScript` 支持非常友好 ，甚至可以使用一些基于 `TypeScript` 类型的编译宏指令，把本来无效的 `ts` 类型，编译成生效的 `js` 代码 |
| 顶层 await 支持 | `<script setup>` 支持直接使用 `await`（比如获取异步数据）                                                                           |

## 编译细节：`<script setup>` + `<template>`

实际上 Vue 会把两个部分合并成类似这样：

```js
// 编译结果（简化版）
export default {
  setup() {
    const count = ref(0)
    function increment() {
      count.value++
    }

    return { count, increment } // 自动推导
  },
  render() {
    // 编译模板为渲染函数，使用 count 和 increment
  }
}
```

---

## 它和普通 `<script>` 的区别

| 对比点         | `<script>`       | `<script setup>`   |
| -------------- | ---------------- | ------------------ |
| 写法           | 手动写 `setup()` | 自动生成 `setup()` |
| 模板访问变量   | 必须 `return`    | 自动暴露顶层变量   |
| 类型推导（TS） | 较麻烦           | 完美推导           |
| 开发体验       | 需要结构重复     | 极简、推荐方式     |

## Vue 3.5+ 新特性：响应式 Props 解构

从 Vue 3.5 开始，`defineProps` 返回的 props 支持**响应式解构**，这意味着你可以直接解构 props 并保持响应性：

```html
<script setup>
  // Vue 3.5 之前，解构会丢失响应性
  // const { count } = defineProps(['count']) ❌ 不响应

  // Vue 3.5+，解构后依然保持响应性 ✅
  const { count = 0, msg = 'hello' } = defineProps<{
    count?: number
    msg?: string
  }>()

  // count 和 msg 在模板和 watch 中都是响应式的
</script>
```

在很多场景下，之前需要 `withDefaults` 来设置默认值；从 Vue 3.5 开始，直接用 JS 解构默认值会更直观：

```html
<script setup lang="ts">
  // Vue 3.5 之前的写法
  const props = withDefaults(defineProps<{ count?: number }>(), {
    count: 0,
  })

  // Vue 3.5+ 的写法，更简洁
  const { count = 0 } = defineProps<{ count?: number }>()
</script>
```

> 补充：`withDefaults` 并没有被废弃，复杂默认值或你希望集中管理默认策略时，它依然有价值。

## Vue 3.5+ 新特性：`useTemplateRef`

Vue 3.5 引入了 `useTemplateRef()` 来获取模板引用，比之前的同名 `ref` 方式更加清晰：

```html
<script setup>
  import { useTemplateRef, onMounted } from 'vue'

  // 通过字符串 key 获取模板引用，不再需要变量名和 ref 属性同名
  const inputRef = useTemplateRef('my-input')

  onMounted(() => {
    inputRef.value?.focus()
  })
</script>

<template>
  <input ref="my-input" />
</template>
```

## Vue 3.5+ 新特性：`useId`

`useId()` 用于生成在同一应用内唯一的 ID，适合用于表单元素和无障碍属性：

```html
<script setup>
  import { useId } from 'vue'

  const id = useId()
</script>

<template>
  <label :for="id">Name:</label>
  <input :id="id" type="text" />
</template>
```

## Vue 3.5+ 新特性：`onWatcherCleanup`

`onWatcherCleanup()` 用于在 `watch` / `watchEffect` 的副作用即将失效时注册清理逻辑。典型场景是请求取消、定时器清理、事件解绑。

```html
<script setup lang="ts">
  import { ref, watch, onWatcherCleanup } from 'vue'

  const id = ref(1)
  const user = ref<any>(null)

  watch(id, async (newId) => {
    const controller = new AbortController()
    onWatcherCleanup(() => controller.abort())

    const resp = await fetch(`/api/user/${newId}`, {
      signal: controller.signal,
    })
    user.value = await resp.json()
  })
</script>
```

相比把清理逻辑散落在外部，`onWatcherCleanup` 能把“本次副作用对应的清理”写在同一块逻辑里，可读性更好，也更不容易漏掉。

## 总结

> `<script setup>` 是 Vue 3 的编译时语法糖，**最终都被编译为标准的 `setup()` 函数和对应的 `render()`**，它让 Composition API 写法更自然、简洁、类型友好，是 Vue 3 推荐的组件书写方式。
>
> Vue 3.5 进一步增强了 `<script setup>` 的开发体验：响应式 Props 解构让 props 处理更简洁，`useTemplateRef` 让模板引用更清晰，`useId` 简化了无障碍开发，`onWatcherCleanup` 让副作用清理更可控。
