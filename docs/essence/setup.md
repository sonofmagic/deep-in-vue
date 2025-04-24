# script setup 语法糖

> `<script setup>` 是 Vue 3 提供的一种 **编译时语法糖**，它让你以更简洁的方式使用 Composition API，本质上会在**构建阶段**被 Vue 编译成普通的 `setup()` 函数。

换句话说：**你写的不是标准 JS，而是 Vue 编译器“预处理”过的代码。**

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
  <button @click="increment">
    Count: {{ count }}
  </button>
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



## 总结

> `<script setup>` 是 Vue 3 的编译时语法糖，**最终都被编译为标准的 `setup()` 函数和对应的 `render()`**，它让 Composition API 写法更自然、简洁、类型友好，是 Vue 3 推荐的组件书写方式。
