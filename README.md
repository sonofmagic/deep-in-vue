# deep in vue

本仓库是一个基于 `vue` 的学习项目

[文档阅读网站](https://deep-in-vue.netlify.app/)

## 介绍

这个项目编写的目的为，帮助我们更好的理解 `vue` 的运行机制，以及 `vue` 的编译原理。

在这里，你会体会到:

1. `vue`/`[jt]sx` 文件的本质
2. `script setup` 和 `script` 的区别
3. `.vue` 的编译时到底做了什么
4. 以及何为 `vue` 的编译时优化(本项目直接使用渲染函数来做，所以没有任何的编译器优化)
5. 分辨哪些是编译时指令，什么是运行时指令

## 运行环境

1. `Nodejs@LTS`(22.x)
2. `pnpm@10`

## 代码目录

- `apps/only-vue-runtime` 为纯运行时版本
- `apps/fully-compiled` 为全编译器版本
- `packages/*` 一些实验性的包

## 运行方式

```bash
# 安装包
pnpm i
# 开发环境
pnpm dev
```

## 许可证

本仓库下的文章(所有的 `md` 文件) 为 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)

所有的代码 (`js/ts` 文件) 为 [MIT](https://opensource.org/licenses/MIT)
