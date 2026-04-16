# 前言

很多前端开发者写了很多年 `Vue`，但对“自己写的模板最后在浏览器里到底变成了什么”并不清楚。

这个项目想补上的，就是这块认知断层：

- `.vue` 文件是什么
- 模板为什么能变成渲染函数
- 编译器帮我们做了哪些优化
- 运行时到底在执行什么
- 为什么有些能力只能在编译阶段实现

如果这些问题没有串起来，你对 Vue 的理解通常会停留在 API 使用层，难以形成完整闭环。

## 为什么值得理解 Vue 编译器

Vue 不是一个“只有运行时”的框架。

你平时写的模板、`<script setup>`、`defineProps`、`v-model`、`<style scoped>`，很多都不是浏览器原生能力，而是 Vue 在**编译阶段**帮你转换后的结果。

换句话说：

- 开发者写的是模板和语法糖
- 浏览器执行的是 JavaScript 渲染逻辑
- Vue 编译器负责把前者变成后者

这也是 Vue 性能优化的重要来源。很多优化都发生在编译阶段，例如静态提升、Patch Flag、Block Tree、事件缓存。只看运行时，很容易只看到“结果”，却不知道“为什么会这样”。

> 手写 `h()` 可以工作，但在大多数场景里，编译器生成的代码更稳定、可维护性更高，也更容易获得框架级优化。

## 阅读前先问自己

在开始之前，不妨先试着回答下面这些问题：

1. 一个 `.vue` 文件到底是不是标准 JavaScript 模块？
2. `script setup` 为什么能自动暴露顶层变量给模板？
3. 一个 Vue 项目能不能完全不写 `.vue` 文件，只靠纯 `js/ts` 跑起来？
4. `<style scoped>` 的样式隔离是如何实现的？
5. `v-if`、`v-for`、`v-model` 这些语法在编译后长什么样？
6. 编译时指令和运行时指令的边界到底在哪里？
7. `defineModel` 为什么能减少样板代码？
8. Vue 3.5 的 props 解构为什么还能保持响应性？
9. 为什么 Vue 3.5 推荐在 `watch` 中配合 `onWatcherCleanup` 清理副作用？
10. SSR Lazy Hydration 到底解决了什么工程问题？

如果这些问题你还没有稳定答案，可以先从这个 [Vue 演练场示例](https://play.vuejs.org/#eNqNU82O0zAQfhXjwwbE0ihdTiVbCdBKwAEQIHHxJUomrRfHtmynBFWRQOIlQOL1QLwFY+enScuuVjlkMvPNzDdfZvb0qdaLXQ10RVObG67dmkleaWUc2RMDJWlJaVRFIgRFTPonjUckfnQ2seBqfch9rirdJy5i/+GbYP5YurKb5Vi7gyQ9JlfSOg8gl57B/egFCKHIR2VEcS96cEQgkHBQaZE5QA8hacF367+/fvz++u3Pz++kwA5p7H0huE3I7lGpzCWjnHBJLhhd7wMf8pBw0rZpvE0OdbyBJpe6dpjIS8zz2LMzEjVNxCg6hcoKLjdoVaoA0SEwEndl+t7BHupMgEskEGJBs5NQkqRBHcSk8WROL737IoDYXGko0LPIyN4XypVQZoXSFU+YbINcHogIek4dwmXJN4trqyT+9ZDBaI4duADzRjuO8jO66mr5WIbqf34VfM7UcD748y3kn/7jv7aN9zH61oAFswNGx5jLzAZcF756/xoatMcgTl4LRN8SfAdWidpz7GDPalkg7QkusH0Z1gz/yQd71TiQdhjKE/XINuAZxY3z4t40+oHuxeJxyENFUcVhow9nc3wAt274/IJOl7drPzQ5WsH5fvRLhnErlFtjZf+a7t1sa3rugchdbx6aEBrPcjncZXJyjHMx7j5m4DOZ4+h05iO0/wBs05LJ) 开始，边看编译结果边带着问题往下读。

## 这套文档适合谁

适合：

- 想深入理解 Vue 编译与运行机制的前端开发者
- 用了很多年 Vue，但希望补齐底层认知的人
- 正在写组件库、框架插件或构建工具的人
- 面试、分享或技术写作中需要更准确表达 Vue 内部机制的人

不太适合：

- 只想快速上手基本语法、暂时不关心原理的新手
- 希望把本文当成 Vue 官方 API 手册来查阅的人

## 推荐阅读路径

### 路线一：先建立整体认知

1. [入门：如何阅读与实验这本书](/guide/how-to-read)
2. [入门：术语表](/guide/glossary)
3. [入门：Vue 编译器介绍](/guide/)
4. [本质：`.vue` 文件的本质](/essence/vue)
5. [进阶：vite dev 和 build 下的 vue 产物](/advanced/vite-dev-build)

这条路线适合先把“写什么”和“跑什么”对应起来。

### 路线二：从常用语法糖切入

1. [script setup 的本质](/essence/setup)
2. [v-bind 的本质](/essence/vBind)
3. [v-on 的本质](/essence/vOn)
4. [v-model 的本质](/essence/vModel)
5. [style scoped 的本质](/essence/style-scoped)

这条路线适合日常业务开发者。

### 路线三：从工程和框架实现切入

1. [纯运行时项目](/advanced/no-compile)
2. [vue+jsx 全编译项目](/advanced/fully-compiled)
3. [Vue 3.5 SSR 与 Hydration](/advanced/ssr-hydration-3.5)
4. [深入章节](/deep/)

这条路线更适合组件库、构建工具和性能方向的读者。

## 按问题阅读

如果你不是想从头读到尾，而是带着具体问题来，可以直接按下面的入口跳：

- 想弄清 `.vue` 文件到底是什么：
  先看 [`.vue` 文件的本质](/essence/vue)，再看 [vite dev 和 build 下的 vue 产物](/advanced/vite-dev-build)
- 想理解常见语法糖最终会变成什么：
  从 [本质章节](/essence/) 开始，优先看 `script setup`、`v-bind`、`v-on`、`v-model`
- 想理解为什么有些能力只能发生在编译阶段：
  先看 [编译时指令 vs 运行时指令](/guide/compile-time-directive)，再看 [自定义编译时指令](/deep/custom-compile-directive)
- 想理解 Vue 3.5 新能力：
  优先看 [script setup 的本质](/essence/setup) 和 [Vue 3.5 SSR 与 Hydration](/advanced/ssr-hydration-3.5)
- 想往组件库工程走：
  从 [构建组件库](/ui/) 进入，按“编写 -> 构建 -> 测试 -> 发布 -> 使用”顺序阅读
- 想看更偏底层的实现：
  直接进入 [深入章节](/deep/)，优先看 [Vue 3 响应式系统的实现原理](/deep/vue-runtime) 和 [类型推导与提取](/deep/type-infer)

## 章节地图

- [入门](/guide/)
  说明 Vue 编译器、编译时指令与运行时指令、`render` 与 `setup` 返回渲染函数之间的关系。
- [本质](/essence/)
  聚焦日常最常用能力的底层形态，例如 `script setup`、`v-model`、`slot`、`.vue`、`tsx` 等。
- [进阶](/advanced/)
  连接“概念”和“工程结果”，展示不同构建模式、不同产物形态和 SSR/Hydration 新能力。
- [深入](/deep/)
  继续往 Vue 内部实现延展，例如类型推导、自定义编译时指令等。
- [构建组件库](/ui/)
  从“理解 Vue”进一步走到“组织 Vue 工程”，包括组件开发、构建、测试、发布与生态分析。

## 如何配合源码阅读

这份文档最好的阅读方式，不是只看文字，而是同时打开项目源码一起对照。

建议你：

1. `git clone` 项目并跑起来
2. 对照 `apps/only-vue-runtime` 和 `apps/fully-compiled`
3. 在浏览器 DevTools 里看实际请求到的模块
4. 在 [play.vuejs.org](https://play.vuejs.org/) 里直接观察模板编译结果
5. 带着“源代码如何映射到产物”的问题反复验证

项目源码地址：[**deep-in-vue**](https://github.com/sonofmagic/deep-in-vue)

运行方式详见仓库中的 [README.md](https://github.com/sonofmagic/deep-in-vue/blob/main/README.md)。

## 使用到的工具

- [play.vuejs.org](https://play.vuejs.org/)：Vue 在线编译器，最适合快速观察模板和 `<script setup>` 的编译结果
- [babeljs.io/repl](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=JYWwDg9gTgLgBAJQKYEMDG8BmUIjgcilQ3wChzMBXAOw2AmrgElqATJADwAoBKAb1Jw4RGJSiMAPAD5BcCa2AA3OGgA2KAM4aAcihBIAvACIARgHMAtEVYWArAAZ7RqQEYJAegWKZQofKUq6lq6-sbmVkg2Dk6uHl4-cu5ScKQAvkA&forceAllTransforms=false&modules=false&shippedProposals=false&evaluate=false&fileSize=false&timeTravel=true&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=false&targets=&version=7.27.0&externalPlugins=&assumptions=%7B%7D)：辅助理解编译与语法转换
- [ast-explorer](https://ast-explorer.dev/)：观察 AST 结构与转换结果

推荐把这些站点收藏下来，后续很多章节都会反复用到。

## 协议

项目中的文章遵从 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans) 协议，所有 `js/ts` 代码遵从 [MIT](https://opensource.org/licenses/MIT) 协议。

这意味着你可以免费阅读、共享、演绎这些文章，但必须署名，且不能用于商业用途。

这样做的目的很直接：希望知识可以被传播、被引用、被继续加工，但不要被重新包装成付费商品。

## Start

如果你准备好了，就先从 [入门章节](/guide/) 开始。

如果你已经对日常 API 足够熟悉，也可以直接跳到 [本质章节](/essence/) 或 [进阶章节](/advanced/)。
