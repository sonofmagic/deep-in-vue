# 本质

如果说“入门”章节是在建立 Vue 的整体地图，那么这一章是在拆掉表象。

这里会围绕日常最常见的语法和文件形态，回答一个核心问题：

> 你平时写下的这些 Vue 代码，最终到底会被转换成什么？

## 为什么这一章重要

很多开发者对 Vue 很熟，但这种熟悉往往停留在“知道怎么用”：

- 知道 `v-model` 会双向绑定
- 知道 `slot` 能做内容分发
- 知道 `<style scoped>` 能做样式隔离
- 知道 `script setup` 写起来很方便

但如果继续问“它具体怎么实现”，很多结论就会变得模糊。

这一章就是把这些高频能力一个个还原成更接近编译产物和运行时行为的形态。

## 推荐阅读顺序

### 第一组：先理解 SFC 和语法糖

1. [script setup 的本质](/essence/setup)
2. [defineXXX 的本质](/essence/define)
3. [.vue 文件的本质](/essence/vue)

### 第二组：再理解模板指令

1. [v-bind 的本质](/essence/vBind)
2. [v-on 的本质](/essence/vOn)
3. [v-model 的本质](/essence/vModel)
4. [v-if 的本质](/essence/vIf)
5. [v-for 的本质](/essence/vFor)

### 第三组：最后理解内容组织与渲染形式

1. [slot 的本质](/essence/slot)
2. [v-slot 的本质](/essence/v-slot)
3. [style scoped 的本质](/essence/style-scoped)
4. [h 函数的本质](/essence/h)
5. [vue jsx/tsx 的本质](/essence/tsx)

## 阅读这一章时建议关注什么

- 这项能力属于编译期、运行期，还是两者都有参与？
- 开发时的语法糖，最终对应到哪种 JavaScript 结构？
- 是否有与 React、JSX、原生 DOM API 更容易对照的实现方式？
- 这项能力会不会影响性能、类型推导或工程组织方式？

## 这一章适合怎样读

不建议从头到尾机械通读。更好的方式是：

1. 先挑你平时最常用、但最没把握解释的主题
2. 对照 `play.vuejs.org` 看编译结果
3. 再回到项目源码里找对应实现

如果你已经能把这些高频语法糖和最终产物联系起来，下一步就可以进入 [进阶章节](/advanced/)，把认知推进到实际构建产物和 SSR 工程场景。
