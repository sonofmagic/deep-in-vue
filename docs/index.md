# 前言

发现很多前端开发者，写了多年的 `vue`，但是对自己写的 `vue` 到底是什么不是很明白

所以编写了这个项目，来帮助我们更好的理解 `vue` 的运行机制，以及 `vue` 的编译原理。

## 问题

在看这个文档之前，不妨问自己几个问题

1. 一个 `vue` 文件可以定义，和导出多个 `vue` 组件吗?
1. `script setup` 的本质是什么，为什么它可以和 `script` 共享一个 `js` 作用域?
1. 一个 `vue` 前端项目，可以没有 `.vue` 文件，纯 `js` 就能跑吗?
1. `<style scoped>` 的本质是什么?
1. `v-if` 和 `v-for` 指令的本质是什么，它们和 `v-model` 还有我们自定义的 `v-loading` 这样的指令有何区别
1. `.vue` 文件到底是什么东西?

这块请从我为你提供的 [编译演练场例子中](https://play.vuejs.org/#eNqNU82O0zAQfhXjwwbE0ihdTiVbCdBKwAEQIHHxJUomrRfHtmynBFWRQOIlQOL1QLwFY+enScuuVjlkMvPNzDdfZvb0qdaLXQ10RVObG67dmkleaWUc2RMDJWlJaVRFIgRFTPonjUckfnQ2seBqfch9rirdJy5i/+GbYP5YurKb5Vi7gyQ9JlfSOg8gl57B/egFCKHIR2VEcS96cEQgkHBQaZE5QA8hacF367+/fvz++u3Pz++kwA5p7H0huE3I7lGpzCWjnHBJLhhd7wMf8pBw0rZpvE0OdbyBJpe6dpjIS8zz2LMzEjVNxCg6hcoKLjdoVaoA0SEwEndl+t7BHupMgEskEGJBs5NQkqRBHcSk8WROL737IoDYXGko0LPIyN4XypVQZoXSFU+YbINcHogIek4dwmXJN4trqyT+9ZDBaI4duADzRjuO8jO66mr5WIbqf34VfM7UcD748y3kn/7jv7aN9zH61oAFswNGx5jLzAZcF756/xoatMcgTl4LRN8SfAdWidpz7GDPalkg7QkusH0Z1gz/yQd71TiQdhjKE/XINuAZxY3z4t40+oHuxeJxyENFUcVhow9nc3wAt274/IJOl7drPzQ5WsH5fvRLhnErlFtjZf+a7t1sa3rugchdbx6aEBrPcjncZXJyjHMx7j5m4DOZ4+h05iO0/wBs05LJ) 去寻找答案
