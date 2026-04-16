# 自定义编译时指令

这一篇讨论的是 Vue 编译器开放出来的一类很强的能力：

> 你可以不等运行时再处理某个语法，而是直接在编译阶段把它改写掉。

这意味着你能做的不只是“写一个运行时自定义指令”，而是：

- 让某种模板语法在编译阶段就消失
- 直接控制最终生成的渲染函数代码
- 把某些工程规则前置到构建阶段

这就是自定义编译时指令真正有价值的地方。

## 先把它和运行时指令分开

很多人看到“自定义指令”会先想到：

```js
app.directive('focus', { ... })
```

那是运行时指令。

而这里讨论的“自定义编译时指令”是另外一层东西：

- 它工作在模板编译阶段
- 它不一定会在最终产物里留下任何指令痕迹
- 它的产物可能只是 props、节点结构或 helper 调用

所以两者的核心区别是：

- 运行时指令：浏览器执行阶段参与
- 编译时指令：生成代码阶段参与

## Vue 编译器给了哪些扩展点

Vue 编译器主要区分两类转换：

```ts
import type { DirectiveTransform } from '@vue/compiler-core'
import { createStructuralDirectiveTransform } from '@vue/compiler-core'
```

## 1. `nodeTransforms`

用于处理**结构性转换**。

典型代表是：

- `v-if`
- `v-for`

这类转换会直接影响 AST 节点结构，比如：

- 添加分支
- 替换节点
- 重组子节点

所以它们不是“给节点补点属性”这么简单，而是直接动模板结构。

`createStructuralDirectiveTransform` 返回的就是这类转换函数。

## 2. `directiveTransforms`

用于处理**非结构性指令转换**。

典型代表是：

- `v-bind`
- `v-on`
- `v-model`

这类转换不会重写整棵节点结构，而更偏向：

- 解析参数
- 解析修饰符
- 生成 props
- 注入运行时 helper

所以它们更接近“把模板语法翻译成节点属性描述”。

## 为什么结构性指令必须走 `nodeTransforms`

因为结构性指令改变的是“节点关系”本身。

例如 `v-if`：

- 不只是给节点加个标记
- 而是要决定生成哪一个分支

例如 `v-for`：

- 不只是给节点补属性
- 而是要把一个节点模板提升成一组列表渲染逻辑

这类事情已经超出了普通指令转换能处理的范围，所以必须在节点层面做变换。

## 为什么这件事值得你关心

因为它揭示了一个非常重要的判断标准：

> 你想扩展的是“结构”，还是“属性语义”？

如果你只想把某个自定义语法翻译成一组 props，通常 `directiveTransforms` 就够了。

如果你想让某种语法改变模板结构，那就要考虑 `nodeTransforms`。

## 一个简单的 `directiveTransforms` 示例

比如你想定义一个 `v-data-attr`，在编译时把它转成 `data-attr` 属性：

```ts
import type { DirectiveTransform } from '@vue/compiler-core'

export const transformDataAttr: DirectiveTransform = (dir, _node, _context) => {
  return {
    props: [
      {
        type: 'attr',
        name: 'data-attr',
        value: dir.exp,
        key: dir.arg,
        loc: dir.loc,
      },
    ],
  }
}
```

这个例子很好地说明了 `directiveTransforms` 的本质：

- 输入是一个模板指令
- 输出是一组节点 props 描述

它没有重写节点结构，只是把语法翻译成了更底层的属性形态。

## 在 Vite 中怎么接入

可以通过 `@vitejs/plugin-vue` 的 `compilerOptions` 注册：

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { transformDataAttr } from './my-directives'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          directiveTransforms: {
            'data-attr': transformDataAttr,
          },
        },
      },
    }),
  ],
})
```

这里要注意，这不是给 Vue app 注册运行时能力，而是在修改模板编译器的行为。

## 什么样的场景适合自定义编译时指令

更适合：

- 想把某种模板语法糖前置为编译期行为
- 想减少运行时成本
- 想统一某类工程约束
- 想让最终产物更直接、更可控

不太适合：

- 只是想在元素挂载后操作 DOM
- 只是想在运行时拿到元素实例做副作用

后者通常还是运行时自定义指令更自然。

## 为什么它比运行时指令更“硬核”

因为它直接动的是编译器，而不是组件执行结果。

这意味着：

- 灵活度更高
- 风险也更高
- 更要求你理解模板 AST、helper 和产物结构

但一旦用对，它会非常强，因为你是在“定义 Vue 该怎样理解某种语法”。

## 可以从官方哪些实现入手

最好的入口还是先看官方已存在的转换：

- [v-for 编译实现](https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/compiler-core/src/transforms/vFor.ts)
- [v-if 编译实现](https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/compiler-core/src/transforms/vIf.ts)

它们能帮你建立一个很重要的直觉：

- 哪些语法在 AST 层被重写
- 哪些语法只是转成 props / helper

## 本项目里的示例

本项目中实现了一个自定义编译时指令 `v-file`，可以看：

`packages/compile-time-directive`

建议你不要只看结果，而是顺手观察：

1. 输入模板长什么样
2. 转换器拿到了什么 AST 信息
3. 最终生成的渲染代码变成了什么

## 一句话理解

自定义编译时指令的本质，不是在运行时增强元素行为，而是在模板编译阶段重新定义某种语法应当被翻译成什么代码。
