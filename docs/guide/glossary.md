# 术语表

这一页不是完整教程，而是整套文档里的“回查页”。

如果你在正文里反复遇到某个词，但一时想不起它在整套体系里的位置，可以先回到这里。

## VNode

虚拟节点（Virtual Node）。

你写的模板、JSX、`h()`，最终都会落到某种 VNode 创建调用上。  
VNode 是 Vue 运行时描述 UI 结构的核心数据形态。

## 渲染函数（render function）

返回 VNode 树的函数。

模板最终会被编译成 render 函数；你也可以手写 render 函数，或者在 `setup` 中返回 render。

## SFC

Single File Component，单文件组件。

通常指 `.vue` 文件这种把模板、脚本、样式组织在同一个文件中的组件形态。

## `<script setup>`

Vue 3 的编译时语法糖。

它会在编译阶段被转换成普通的 `setup()` 逻辑，不是浏览器原生理解的 JavaScript 结构。

## 编译宏

只在编译阶段存在的特殊语法入口，例如：

- `defineProps`
- `defineEmits`
- `defineSlots`
- `defineModel`

它们通常不需要 import，且编译后会被展开或擦除。

## Patch Flag

Vue 编译器在模板编译阶段生成的更新提示标记。

它的作用是告诉运行时：某个节点哪些部分是动态的，从而减少无谓的 diff 成本。

## Block Tree

Vue 3 编译和运行时协作的一种优化结构。

可以简单理解为：编译器会帮运行时收集动态节点，让更新阶段更容易聚焦真正变化的部分。

## scopeId

`<style scoped>` 相关的作用域标识。

通常长成 `data-v-xxxx`，它会同时出现在模板节点和改写后的 CSS 选择器上，用来实现组件级样式隔离。

## effect

响应式系统中的副作用单位。

渲染函数、`watchEffect`、`computed` 等底层都会和 effect 系统有关。  
它的职责是把“响应式数据”和“依赖这些数据的副作用逻辑”连接起来。

## track / trigger

Vue 响应式系统里的两个关键动作：

- `track`：收集依赖
- `trigger`：触发依赖更新

读取数据时通常会 `track`，修改数据时通常会 `trigger`。

## slots

插槽对象。

本质上是一个以插槽名为 key、以返回 VNode 的函数为 value 的对象。例如：

- `slots.default()`
- `slots.header()`

## 作用域插槽

本质上是带参数的插槽函数。

可以理解为：子组件在调用插槽函数时，把数据作为参数传给父组件定义的插槽内容。

## directiveTransforms

Vue 模板编译阶段中，处理“非结构性指令”的转换入口。

常见用于把某种指令语法翻译成 props、helper 或其他节点级描述。

## nodeTransforms

Vue 模板编译阶段中，处理“结构性转换”的入口。

像 `v-if`、`v-for` 这种会改变节点结构的能力，更接近这类转换。

## HMR

Hot Module Replacement，热模块替换。

开发态修改文件后，尽量只更新受影响模块，而不整页刷新。

## Tree Shaking

构建工具在打包时移除未使用代码的能力。

组件库设计时，导出结构和模块边界是否清晰，会直接影响 Tree Shaking 效果。

## Headless / Primitive 组件

更偏行为和结构原语的组件。

它们通常弱化默认视觉表达，把样式和主题能力更多留给应用侧或设计系统来决定。

## 一句话理解

术语表的作用不是替代正文，而是帮你在整套文档里快速重新定位一个概念属于哪一层：编译期、运行期、样式层、组件层还是工程层。

## 建议继续阅读

1. [如何阅读与实验这本书](/guide/how-to-read)
2. [入门导读](/guide/)
3. [本质导读](/essence/)
