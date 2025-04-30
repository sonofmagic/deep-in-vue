# 前言

发现很多前端开发者，虽然写了多年的 `vue`，但是对自己写的 `vue` 在上线之后，到底跑的是什么，不是很清楚。

所以编写了这个项目，来帮助我们更好的理解 `vue` 的运行机制，以及 `vue` 的编译产物。

## 为什么了解 Vue 编译器？

实际上，你想要深入的学习 `vue`，是必须要了解它的编译器的，不然思想上就不能完成闭环，

另外从 `vue` 的编译去理解 `vue` 以及它的运行时，也是一个非常好的角度。

因为模板是开发者写的，渲染函数是浏览器能执行的, 编译器让我们不用手写复杂的 `VNode` 结构，而且很多 `vue` 性能优化很多都“藏”在编译阶段，我们手写 `VNode` 反而会造成性能劣化。

> 手写 h 函数，代码的可维护性非常差，一不小心就漏了一个括号，导致报错，找都要找半天，而且响应式也不直观

## 一些问题

在看这个文档之前，不妨问自己几个问题

1. 一个 `vue` 文件可以定义，和导出多个 `vue` 组件吗?
2. `script setup` 为什么可以和 `script` 共享一个 `js` 作用域?
3. 一个 `vue` 前端项目，可以没有 `.vue` 文件，纯 `js` 就能跑吗?
4. `<style scoped>` 的是怎么做样式隔离的?
5. `v-if` 和 `v-for` 指令的本质是什么，它们我们自定义的指令，例如 `element-plus` 中导出的 `v-loading` 指令有何区别
6. `xxx.vue` 文件到底是什么东西?

假如你对这些问题不了解，请先从这个 [编译演练场例子中](https://play.vuejs.org/#eNqNU82O0zAQfhXjwwbE0ihdTiVbCdBKwAEQIHHxJUomrRfHtmynBFWRQOIlQOL1QLwFY+enScuuVjlkMvPNzDdfZvb0qdaLXQ10RVObG67dmkleaWUc2RMDJWlJaVRFIgRFTPonjUckfnQ2seBqfch9rirdJy5i/+GbYP5YurKb5Vi7gyQ9JlfSOg8gl57B/egFCKHIR2VEcS96cEQgkHBQaZE5QA8hacF367+/fvz++u3Pz++kwA5p7H0huE3I7lGpzCWjnHBJLhhd7wMf8pBw0rZpvE0OdbyBJpe6dpjIS8zz2LMzEjVNxCg6hcoKLjdoVaoA0SEwEndl+t7BHupMgEskEGJBs5NQkqRBHcSk8WROL737IoDYXGko0LPIyN4XypVQZoXSFU+YbINcHogIek4dwmXJN4trqyT+9ZDBaI4duADzRjuO8jO66mr5WIbqf34VfM7UcD748y3kn/7jv7aN9zH61oAFswNGx5jLzAZcF756/xoatMcgTl4LRN8SfAdWidpz7GDPalkg7QkusH0Z1gz/yQd71TiQdhjKE/XINuAZxY3z4t40+oHuxeJxyENFUcVhow9nc3wAt274/IJOl7drPzQ5WsH5fvRLhnErlFtjZf+a7t1sa3rugchdbx6aEBrPcjncZXJyjHMx7j5m4DOZ4+h05iO0/wBs05LJ) 去寻找答案


## 项目

本文源代码 [**deep-in-vue**](https://github.com/sonofmagic/deep-in-vue) 

点不点 `star` 无所谓，但请务必 `fork` / `git clone` 下来运行体验一下里面的示例项目，这样才能对这个项目后续的知识点有更深的体会。

相关的运行时环境，和运行方式详见项目中的 [README.md](https://github.com/sonofmagic/deep-in-vue/blob/main/README.md)

## 使用到的工具

- [play.vuejs.org](https://play.vuejs.org/) - Vue 在线编译器
- [babeljs.io/repl](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=JYWwDg9gTgLgBAJQKYEMDG8BmUIjgcilQ3wChzMBXAOw2AmrgElqATJADwAoBKAb1Jw4RGJSiMAPAD5BcCa2AA3OGgA2KAM4aAcihBIAvACIARgHMAtEVYWArAAZ7RqQEYJAegWKZQofKUq6lq6-sbmVkg2Dk6uHl4-cu5ScKQAvkA&forceAllTransforms=false&modules=false&shippedProposals=false&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=false&targets=&version=7.27.0&externalPlugins=&assumptions=%7B%7D) - Babel在线编译器
- [ast-explorer](https://ast-explorer.dev/) - AST 在线转化预览工具 ([`sxzz`](https://github.com/sxzz) `yyds`! 做的比我之前一直使用的 [astexplorer.net](https://astexplorer.net/) 好太多了， 非常感谢🙏)

推荐把这些网站收藏一下

## 协议

项目中所有的文章遵从 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans) 协议，所有的 `js/ts` 代码遵从 [MIT](https://opensource.org/licenses/MIT) 协议

这意味着你可以免费阅读，共享，演绎这些文章，但是必须署名，且不能用于商业用途。

这是为了防止有人拿去卖（比如掘金小册），我写这些文章和代码的初衷，就是为了免费的把知识共享给大家，假如变成一件买卖的商品，就违背了我做开源的初衷。

## Start!

现在就让我们正式开始吧！
