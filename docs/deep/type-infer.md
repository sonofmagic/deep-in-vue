# 类型推导与提取

这一篇关注的是一个很容易让人产生“Vue 很神奇”错觉的问题：

> TypeScript 类型在正常编译后不是会被擦掉吗？为什么 `defineProps<{ count: number }>()` 里的类型，最后却能变成真实的运行时 `props` 定义？

答案不是“TypeScript 运行到了浏览器里”，而是：

> Vue 在 SFC 编译阶段主动读取了 TypeScript 类型信息，并把其中一部分转换成了运行时代码。

也就是说，这不是 TS 自己做的，而是 Vue 编译器额外做的工作。

## 先记住核心结论

在普通 TypeScript 工程里：

- 类型主要服务静态检查
- 编译后通常不会留下运行时类型信息

但在 Vue 的 `<script setup>` 场景里：

- 编译器会提前分析 `defineProps<T>()` 这类宏调用
- 读取其中的类型结构
- 再生成对应的运行时 `props` 选项

所以 Vue 能“让类型真正生效”，本质上是因为它把类型信息在编译阶段转译了一遍。

## 最典型的例子

```html
<script setup lang="ts">
interface Props {
  msg: string
  count?: number
}

const props = defineProps<Props>()
</script>
```

编译后会更接近：

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

这就是整件事最值得记住的地方：

- 你写的是 TypeScript 类型
- Vue 读到的是类型 AST
- 最终生成的是运行时 props 描述

## 编译器是怎么做到的

Vue 编译器（`@vue/compiler-sfc`）在处理 `<script setup>` 时，会专门解析宏调用和类型声明。

核心实现可以从这里入手：

[resolveType.ts](https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/compiler-sfc/src/script/resolveType.ts#L24)

可以把这条链路粗略记成四步：

1. 找到 `defineProps` 这类宏调用
2. 解析其泛型参数对应的 TypeScript AST
3. 递归提取可映射的类型结构
4. 生成对应的运行时 `props` 选项

## 它真正提取了什么

Vue 不是“理解了全部 TypeScript”，而是提取其中一部分**可映射到运行时的结构信息**。

例如：

- 字段名
- 是否可选
- 基础类型
- 某些联合类型
- 数组、对象等大类

这也是为什么 Vue 可以生成：

- `required: true / false`
- `type: String / Number / Boolean / Array / Object`

但并不会把 TS 的全部复杂类型系统完整搬到运行时。

## 支持的常见类型映射

| TypeScript 类型 | Vue 运行时类型 |
| --- | --- |
| `string` | `String` |
| `number` | `Number` |
| `boolean` | `Boolean` |
| `string[]` / `Array<T>` | `Array` |
| `object` / `Record<K, V>` | `Object` |
| `Function` | `Function` |
| 联合类型 `A \| B` | `[A, B]` 或更接近联合映射结果 |

这里要注意：  
这张表表达的是“可提取的大方向”，不是“TS 任意复杂类型都能一比一转成运行时精确校验”。

## 为什么这件事只发生在 Vue 编译器里

因为普通的 TypeScript 编译器并不会关心：

- 你是不是在声明组件 props
- 这些类型要不要转成框架运行时配置

而 Vue 编译器知道：

- `defineProps<T>()` 是一个特殊入口
- 这里的类型不只是给 IDE 看
- 它还可以被转成组件契约

所以本质上，这是“框架级编译增强”，不是 TypeScript 自带能力。

## 有什么边界

这是理解这件事时非常重要的一点。

Vue 的类型提取能力很强，但它不是“任意 TS 类型的完整运行时镜像”。

原因很简单：

- TypeScript 类型系统远比运行时 props 描述复杂
- 很多高级类型只在静态层成立
- 到运行时未必有等价表示

所以你应该这样理解：

- Vue 提取的是“足够有用的一部分”
- 目的是让组件契约更一致
- 不是把 TS 编译成完整运行时类型系统

## 为什么这对 Vue 很重要

因为它把三件原本可能分裂的东西尽量统一了：

1. 你写给 TypeScript 的类型信息
2. 你给组件声明的 props 契约
3. 一部分运行时校验与推断能力

这会直接改善：

- 开发体验
- 类型一致性
- 组件 API 的单一事实来源

也就是说，Vue 不是让你“多写一份类型 + 多写一份 props”，而是在尽量把两者合并。

## 如果你想真正看懂这一层

推荐带着下面几个问题去看源码：

1. 编译器如何定位 `defineProps` 的泛型参数
2. 它怎样从 interface / type alias 里递归提取字段
3. 哪些类型能顺利映射到运行时，哪些不能
4. 为什么这件事一定要发生在 SFC 编译阶段

## 本项目里的对应实验

想自己验证一遍这条链路，可以看：

`packages/type-infer`

这里实现了一个简化版的类型推导提取器，能帮助你更直观地理解 Vue 编译器到底是在“读什么、转什么、丢什么”。

## 一句话理解

Vue 让 TypeScript 在组件里“真的生效”，不是因为类型进入了运行时，而是因为 Vue 编译器提前把一部分类型信息翻译成了运行时代码。
