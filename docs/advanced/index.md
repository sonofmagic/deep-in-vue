# 进阶

这一章讨论的不是“Vue 能不能这么写”，而是“这样写之后，工程上到底会发生什么”。

当你已经理解了模板、SFC、指令和渲染函数之间的关系，接下来最自然的问题就是：

- 纯运行时项目和带编译器项目有什么区别？
- `vite dev` 和 `vite build` 下的产物为什么差异这么大？
- SSR / Hydration 到底是怎样接入到这套体系里的？

这一章就是把这些问题落到真实工程结果上。

## 本章适合谁

- 想把“Vue 原理”连接到实际构建结果的人
- 正在排查编译产物、样式注入、Hydration 问题的人
- 想理解不同运行模式和构建模式差异的人

## 本章内容

- [纯运行时项目](/advanced/no-compile)
  理解一个 Vue 项目在没有模板编译参与时是什么样子。
- [vue+jsx 全编译项目](/advanced/fully-compiled)
  从另一种输入形式观察编译和构建的边界。
- [vite dev 和 build 下的 vue 产物](/advanced/vite-dev-build)
  直接对照开发态与生产态产物差异，理解 HMR、样式注入、代码组织方式的变化。
- [Vue 3.5 SSR 与 Hydration](/advanced/ssr-hydration-3.5)
  进入服务端渲染场景，理解新的 Hydration 策略和常见问题控制手段。

## 建议阅读方式

### 如果你偏工程实践

优先看 [vite dev 和 build 下的 vue 产物](/advanced/vite-dev-build)，再看 SSR 一文。

### 如果你偏原理验证

先从 [纯运行时项目](/advanced/no-compile) 和 [vue+jsx 全编译项目](/advanced/fully-compiled) 开始，对照不同输入形式。

## 按场景切入

- 想看“没有 SFC 模板时 Vue 还剩什么”：
  从 [纯运行时项目](/advanced/no-compile) 开始
- 想看 JSX / `h()` 和模板写法之间的关系：
  先看 [vue+jsx 全编译项目](/advanced/fully-compiled)，再回看 [h 函数的本质](/essence/h)
- 想排查开发态和生产态产物差异：
  直接看 [vite dev 和 build 下的 vue 产物](/advanced/vite-dev-build)
- 想理解 Vue 3.5 在 SSR 方向到底改进了什么：
  直接看 [Vue 3.5 SSR 与 Hydration](/advanced/ssr-hydration-3.5)

## 读完这一章后，你应该能回答

- 为什么开发态会出现大量带查询参数的模块请求
- 为什么生产构建后的代码组织方式完全不同
- 样式在开发态和生产态分别怎样注入与产出
- 哪些 SSR 问题是渲染问题，哪些是 Hydration 时机问题

如果你希望继续往 Vue 更内部的实现机制走，可以进入 [深入章节](/deep/)。

如果你发现自己在读这一章时经常搞混“编译本质”和“日常语法”，建议回到 [本质章节](/essence/) 补一轮高频语法糖。

## 本章小结

这一章最重要的价值，是把“编译原理”真正接到了“工程产物”上：

- 开发态为什么长这样
- 生产态为什么又完全不同
- 运行时、构建器、SSR 各自扮演什么角色

如果这一层打通，很多构建现象就不会再只是“看起来很复杂”的黑盒。

## 下一章建议

接下来建议进入 [深入章节](/deep/)，把视角继续推进到响应式系统、类型提取和编译扩展。
