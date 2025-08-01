# element-plus (vue3) 构建分析

## 运行环境

- `Node.js LTS` (22)
- `corepack@latest` 用于自动安装切换 `packageManager`

## 前置运行步骤

1. fork `element-plus` 到你自己的仓库里
2. clone 你自己的 `element-plus` 到你本地
3. pnpm i (安装依赖)

## 项目分析

`element-plus` 项目主体本身是一个 `monorepo`，使用 `rollup` 进行构建，使用 `gulp` 进行任务编排的项目

## 目录分析

这里只列举一些核心的文件夹。

```bash
dist # 产物目录
docs # vitepress 文档网站
internal # 重要：内部包，用于核心构建
packages # 重要：源代码目录
patches # 补丁目录，用于直接修改源代码
play # 组件库的 playground
scripts # 直接执行脚本
ssr-testing # ssr 测试
typings # dts
```

其中我们把一些文件夹忽略了之后，重点看一下 `internal` 和 `packages` 目录

## internal

```bash

```

## packages

```bash

```