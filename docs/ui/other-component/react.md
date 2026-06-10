# React 组件生态速览

这里不是要把 React 组件库写法搬进 Vue。更值得看的是，React 生态为什么总能很快接住新工具和新组件范式。

React 组件库多只是结果。原因更实际：它把“组件表达”做得足够通用。

## 最值得观察的点

React 生态里，这几类能力很值得看：

- JSX 作为事实标准 UI 语法
- Headless / Primitive / Design System 的清晰分层
- 受控 / 非受控组件模式
- Hooks 驱动的逻辑复用
- CSS-in-JS、原子化 CSS、Design Tokens 等多种样式路线
- 文档、测试、可访问性和设计工具的默认适配

这些东西放在一起，React 组件库就很容易被上层框架、文档系统和设计系统拿去用。

## 框架友好度

React 的组件模型足够通用，很多宿主环境都愿意围绕它做抽象：

- Web 应用框架：Next.js、Remix
- 原生应用：React Native
- 终端 UI：Ink
- 3D 场景：React Three Fiber
- 内容系统：MDX
- 设计系统与 headless 组件：Radix UI、React Aria 等

所以 React 的影响力很容易外溢。它不只绑定浏览器 DOM。

## 对 Vue 组件库的启发

Vue 不需要照抄 React API。

更值得借鉴的是这些工程判断：

- 组件库要区分视觉组件、无样式能力组件和底层 primitive
- API 设计要优先保证组合能力，而不是只追求少写几行代码
- 样式系统、可访问性、状态控制和文档示例应该一起设计
- 面向生态时，要降低工具、类型、测试和构建接入成本

Vue 的优势在 SFC、模板、响应式和编译器。React 的经验提醒我们：组件库不能只停在“组件怎么写”，还要考虑它能不能被更多工程形态稳定消费。

## 小结

React 组件生态成熟，不只是因为组件库数量多。JSX 和组件写法已经成了很多工具、框架默认会照顾的接口。

Vue 做组件库时，可以继续坚持 Vue 的表达方式，但需要补上同样重要的工程面：分层、可组合性、类型、文档、测试和跨工具消费体验。

## 接着读

1. [为什么 React 更容易成为生态默认项](/deep/why-react)
2. [React 与 Vue 的真实差异](/essence/react-vs-vue)
3. [组件的使用](/ui/component/4.usage)
