# Vue 编译本质论

本仓库是一个围绕 Vue 编译器、运行时和工程产物展开的学习项目。

[文档阅读网站](https://deep-in-vue.netlify.app/)

## 介绍

这个项目的目标，是帮助你把“会写 Vue”推进到“能解释 Vue 为什么这样工作”。

文档的主线不是 API 罗列，而是围绕一个核心问题展开：

> 你写下的 `.vue`、模板、`script setup`、指令和 JSX，最终会被编译成什么，又由 Vue 运行时怎样执行？

在这里，你会看到：

1. `.vue`、JSX / TSX 与手写渲染函数的本质区别。
2. `script setup`、`defineProps`、`defineModel` 等编译宏到底做了什么。
3. `v-bind`、`v-on`、`v-model`、`v-if`、`v-for` 在编译后更接近什么。
4. Vue 编译期优化如何与运行时 patch、响应式系统协作。
5. 编译时能力、运行时能力和工程构建能力之间的边界。

## 阅读路径

- 先读 [前言](https://deep-in-vue.netlify.app/) 和 [入门章节](https://deep-in-vue.netlify.app/guide/) 建立整体地图。
- 再读 [本质章节](https://deep-in-vue.netlify.app/essence/) 拆解高频语法糖。
- 需要看真实产物时，进入 [进阶章节](https://deep-in-vue.netlify.app/advanced/)。
- 想继续理解响应式、类型提取和编译扩展时，进入 [深入章节](https://deep-in-vue.netlify.app/deep/)。

## 运行环境

- Node.js 20+
- pnpm 10

## 代码目录

- `apps/only-vue-runtime`：只使用 Vue 运行时 API 的示例。
- `apps/fully-compiled`：使用 Vue + JSX / TSX 的示例。
- `packages/*`：围绕编译、类型和组件库的实验包。
- `docs/`：VitePress 文档站源码。

## 运行方式

```bash
# 安装包
pnpm install

# 启动示例项目
pnpm dev

# 启动文档站
pnpm docs:dev

# 构建文档站
pnpm docs:build
```

## 许可证

本仓库下的文章（所有 `md` 文件）遵循 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans) 协议。

所有代码（`js` / `ts` / `vue` 文件）遵循 [MIT](https://opensource.org/licenses/MIT) 协议。
