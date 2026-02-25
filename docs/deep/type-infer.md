# 类型推导与提取

## 什么是类型推导提取

你有没有感到好奇，当你将 TypeScript 代码编译为 JavaScript 时，类型信息会被移除，因为 JavaScript 本身并不支持类型检查。

但是为什么 Vue 里面，写类型却可以真正的生效?

比如 `defineProps<{ count: number }>()` 中的 TypeScript 类型，会在编译后变成真实的 `props` 运行时校验代码。

[看这个示例](https://play.vuejs.org/#eNp9UstOwzAQ/JXFl4IErRCcolAECAk4AAIkDphDmmyCi7O2bKcURfl31q76OKBeouzOjD07616cWTtedCgykfvSKRvAY+gs6IKaCymCl2IqSbXWuAA9OKxhgNqZFkYsG0mSVBryAVrfwEXED0d3qLWBd+N0dTA6ipTwaxHuA7ZM6SUBFBn44BQ1x7GaZUBdO0MnaeDLKKCrixLh2RnrN4I1hfmXa3msygxmxmgs+CKAag19fMYSs5UeoN49AaDZPWJINlSWPEYh25BUYa0Ik4k8faeHaRpJ+WQVFkfDBWusLgJyBZB/nU77PsUxDPmEq9RVZLsAi5PWVKg5WMalgAmD+WRHL445cg60Vs147g3xXpJ9KUrTWqXRPdmgOHApNoNJUXDePw+pF1yHaZik+cLy+5/+3C9jT4pnhx7dAqXYYKFwDYYVfPv6iEv+34DsvtPM3gO+oDe6ix5XtOuOKra9w0tu79OL4vjf/O0yIPn1UNHodiVS8Cu72TP61u7Z+DzpeHli+AO/BfIx)

## 编译器如何做到的

Vue 编译器（`@vue/compiler-sfc`）在编译 `<script setup>` 时，会解析 TypeScript 的类型声明，提取出类型信息，然后将其转换为运行时的 props 定义。

核心源代码：[resolveType.ts](https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/compiler-sfc/src/script/resolveType.ts#L24)

例如：

```html
<script setup lang="ts">
  interface Props {
    msg: string
    count?: number
  }
  const props = defineProps<Props>()
</script>
```

编译后会变成：

```js
export default {
  props: {
    msg: { type: String, required: true },
    count: { type: Number, required: false },
  },
  setup(props) {
    // ...
  },
}
```

编译器做了以下工作：

1. 解析 TypeScript AST，找到 `defineProps` 的泛型参数
2. 递归解析类型（支持 interface、type alias、交叉类型等）
3. 将 TypeScript 类型映射为 Vue 的运行时 prop 类型（`String`、`Number`、`Boolean` 等）
4. 生成带有 `required` 和 `type` 的 props 选项

## 支持的类型

Vue 编译器支持解析以下 TypeScript 类型：

| TypeScript 类型          | Vue 运行时类型 |
| ------------------------ | -------------- |
| `string`                 | `String`       |
| `number`                 | `Number`       |
| `boolean`                | `Boolean`      |
| `string[]` / `Array<T>`  | `Array`        |
| `object` / `Record<K,V>` | `Object`       |
| `Function`               | `Function`     |
| 联合类型 `A \| B`        | `[A, B]`       |

## 让我们一起来实现一下吧

见 `packages/type-infer` 项目，里面实现了一个简化版的类型推导提取器，帮助你理解 Vue 编译器是如何从 TypeScript 类型中提取运行时信息的。
