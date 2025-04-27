# 前言

发现很多前端开发者，虽然写了多年的 `vue`，但是对自己写的 `vue` 到底是什么不是很清楚

所以编写了这个项目，来帮助我们更好的理解 `vue` 的运行机制，以及 `vue` 的编译产物。

## 问题

在看这个文档之前，不妨问自己几个问题

1. 一个 `vue` 文件可以定义，和导出多个 `vue` 组件吗?
2. `script setup` 为什么可以和 `script` 共享一个 `js` 作用域?
3. 一个 `vue` 前端项目，可以没有 `.vue` 文件，纯 `js` 就能跑吗?
4. `<style scoped>` 的是怎么做样式隔离的?
5. `v-if` 和 `v-for` 指令的本质是什么，它们和 `v-model` 还有我们自定义的 `v-loading` 这样的指令有何区别
6. `.vue` 文件到底是什么东西?

这块请从这个 [编译演练场例子中](https://play.vuejs.org/#eNqNU82O0zAQfhXjwwbE0ihdTiVbCdBKwAEQIHHxJUomrRfHtmynBFWRQOIlQOL1QLwFY+enScuuVjlkMvPNzDdfZvb0qdaLXQ10RVObG67dmkleaWUc2RMDJWlJaVRFIgRFTPonjUckfnQ2seBqfch9rirdJy5i/+GbYP5YurKb5Vi7gyQ9JlfSOg8gl57B/egFCKHIR2VEcS96cEQgkHBQaZE5QA8hacF367+/fvz++u3Pz++kwA5p7H0huE3I7lGpzCWjnHBJLhhd7wMf8pBw0rZpvE0OdbyBJpe6dpjIS8zz2LMzEjVNxCg6hcoKLjdoVaoA0SEwEndl+t7BHupMgEskEGJBs5NQkqRBHcSk8WROL737IoDYXGko0LPIyN4XypVQZoXSFU+YbINcHogIek4dwmXJN4trqyT+9ZDBaI4duADzRjuO8jO66mr5WIbqf34VfM7UcD748y3kn/7jv7aN9zH61oAFswNGx5jLzAZcF756/xoatMcgTl4LRN8SfAdWidpz7GDPalkg7QkusH0Z1gz/yQd71TiQdhjKE/XINuAZxY3z4t40+oHuxeJxyENFUcVhow9nc3wAt274/IJOl7drPzQ5WsH5fvRLhnErlFtjZf+a7t1sa3rugchdbx6aEBrPcjncZXJyjHMx7j5m4DOZ4+h05iO0/wBs05LJ) 去寻找答案

## 项目

本文附带项目 [**deep-in-vue**](https://github.com/sonofmagic/deep-in-vue) 

请务必 `git clone` 下来运行体验一下，不然很可能体会不到这个项目后续的知识点

## 运行环境

1. Nodejs@LTS(22.x)
2. pnpm@10

## 代码目录

- `apps/only-vue-runtime` 为项目本体
- `apps/fully-compiled` 为全编译器版本
- `packages/type-infer` 为提取 `Type` 定义实现代码

## 运行方式

```bash
# 安装包
pnpm i
# 开发环境
pnpm dev
```

## 推荐工具

- [play.vuejs.org](https://play.vuejs.org/)
- [babeljs.io/repl](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=JYWwDg9gTgLgBAJQKYEMDG8BmUIjgcilQ3wChzMBXAOw2AmrgElqATJADwAoBKAb1Jw4RGJSiMAPAD5BcCa2AA3OGgA2KAM4aAcihBIAvACIARgHMAtEVYWArAAZ7RqQEYJAegWKZQofKUq6lq6-sbmVkg2Dk6uHl4-cu5ScKQAvkA&forceAllTransforms=false&modules=false&shippedProposals=false&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=false&targets=&version=7.27.0&externalPlugins=&assumptions=%7B%7D)
- [ast-explorer](https://ast-explorer.dev/) 