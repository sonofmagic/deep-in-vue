# vue jsx/tsx 的本质

很多人第一次在 Vue 里用 JSX / TSX，会先问一个问题：

> 为什么 Vue JSX 需要额外安装 `@vitejs/plugin-vue-jsx`？

这个问题背后真正要理解的是：

> Vue 里的 JSX / TSX，本质上不是模板系统本身，而是“用另一种语法书写渲染函数”。

所以它既不是浏览器原生能力，也不是 Vue 默认就能直接执行的语法。它必须先经过编译。

## 先记住一句话

JSX / TSX 的本质是语法糖。

它最终不会直接进入浏览器，而是会先被编译成函数调用，再由 Vue 运行时去创建 VNode。

所以从底层角度看：

- 模板：编译成 render + VNode
- JSX / TSX：编译成 render + VNode
- `h()`：手写 render + VNode

它们的最终目标是一致的，只是输入形式不同。

## 什么是 JSX 文件

JSX 不是浏览器或 JavaScript 原生支持的语法，它需要通过 Babel 或其他编译器转换成普通 JavaScript。

例如在 React 中：

```jsx
<div className="greeting">Hello, JSX</div>
```

会被转换为：

```js
import { jsx as _jsx } from 'react/jsx-runtime'

/* #__PURE__ */_jsx('div', {
  className: 'greeting',
  children: 'Hello, JSX',
})
```

这能说明一件事：

- JSX 不是运行时自己理解的
- JSX 一定要先被编译

相关 Playground：

[babeljs playground](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=JYWwDg9gTgLgBAbzgVwM4FMDKMCGN1wC-cAZlBCHAORTo4DGMVA3AFCsnIB2jwEXcAMIUwACgCUCVnDj1-qeAG053GABo4GGMNUBdOAF4UGbHnSiADOLbS4tGMigDRtmQB4ARshgx-cfoIANsD0ANYGCBKGAHya6NoQqqIqXPAA1HAAjOKE0a4ycICdDoDfioBhcogpMMSAhNb5bgD0Xj78eTLWrITsnDwwfAI6qehQUVIyclwKcMqJqRpaAzD6RmhYuPiW7bb2js51Tb4CAcFhEVEGsfMzMMlXcBnZufkyJeUIlTVPcG7C4HBgXBAACboCKebwHaL_IHoBr7FrEOQgCILIbEeqtAqw8EtWztQhAA&forceAllTransforms=false&modules=false&shippedProposals=false&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=false&targets=&version=7.27.0&externalPlugins=&assumptions=%7B%7D)

扩展阅读：[React createElement 与 jsx 函数](./react-jsx.md)

## Vue JSX 为什么不能直接用 React 的编译规则

虽然 Vue 的 JSX 和 React 的 JSX 看起来很像，但底层运行目标并不一样。

React JSX 默认会被编译成：

- `React.createElement`
- 或 React 的 `jsx/jsxs` runtime

而 Vue 需要的却是：

- `createVNode`
- `withDirectives`
- slots 对象
- Vue 特有的事件、指令和 `v-model` 语义

所以如果你直接套 React 的 JSX 编译规则，最后生成的代码就不会符合 Vue 运行时预期。

## Vue 专门的 Babel 插件做了什么

Vue 官方提供了：

[**@vue/babel-plugin-jsx**](https://github.com/vuejs/babel-plugin-jsx)

它的核心工作，就是把 JSX / TSX 转成 Vue 能消费的渲染函数调用。

## 1. 把 JSX 编译为 Vue 的 VNode 创建调用

例如：

```jsx
<div id="foo">bar</div>
```

会变成近似这样的结果：

```js
_createVNode('div', {
  id: 'foo',
}, [_createTextVNode('bar')])
```

也就是说，Vue JSX 最终仍然会回到 VNode 创建逻辑。

## 2. 支持 Vue 特有语义

这是 Vue JSX 真正和 React JSX 拉开差距的地方。

例如：

- `v-model`
- `v-show`
- `v-html`
- slots
- Vue 风格事件 props

例如：

```jsx
<>
  <input v-model={modelValue} />
  <Comp v-model={modelValue}></Comp>
</>
```

会被编译为：

```js
_createVNode(_Fragment, null, [
  _withDirectives(_createVNode('input', {
    'onUpdate:modelValue': $event => modelValue = $event,
  }, null), [[_vModelText, modelValue]]),
  _createVNode(_resolveComponent('Comp'), {
    modelValue: modelValue,
    'onUpdate:modelValue': $event => modelValue = $event,
  }, null),
])
```

这里非常清楚地体现出 Vue JSX 的本质：

- JSX 只是输入语法
- Vue 特有语义依然会被转换成 Vue 自己的机制

## 3. 事件绑定仍然是 Vue 风格

例如：

```jsx
<MyComponent onClick={handler} />
```

会变成：

```js
_createVNode(_resolveComponent('MyComponent'), {
  onClick: handler,
}, null)
```

所以即便你写的是 JSX，底层仍然在走 Vue 的事件 prop 约定，而不是 React 运行时。

## 4. slots 仍然是函数对象

如果你在 JSX 里写插槽，本质上仍然会被转换成 slots 对象。

也就是说，换成 JSX 之后，插槽机制不会变，只是声明语法变了。

这点非常重要，因为它说明：

- JSX 没有改写 Vue 的组件模型
- 它只是换了一种写 render 的方式

## 为什么 Vite 里还要装 `@vitejs/plugin-vue-jsx`

因为 Vite 本身并不会自动知道“这个 JSX 应该按 Vue 规则编译”。

`@vitejs/plugin-vue-jsx` 的核心作用可以简单理解成两件事：

1. 把 `@vue/babel-plugin-jsx` 接入构建流程
2. 让 JSX 文件正确融入 Vue 项目的 HMR、模块分析和开发体验链路

也就是说，它不是在提供新的 Vue 能力，而是在把 Vue JSX 的编译规则接到 Vite 上。

## JSX / TSX 适合什么场景

更适合：

- 高度动态渲染
- render 函数组织更自然的场景
- 复杂组件组合
- 希望按 JavaScript/TypeScript 思维写视图

不一定适合：

- 模板更直观的业务页面
- 主要依赖模板语法糖和模板可读性的团队

## 一句话理解

Vue JSX / TSX 不是“React 语法搬到 Vue”，而是 Vue 借助 Babel 插件，把 JSX 这种写法翻译成自己的 VNode 创建和组件协议。

## 总结

| 特性 | 说明 |
| --- | --- |
| 本质 | 用 JSX / TSX 书写 Vue 渲染函数 |
| 是否原生 | 不是，必须先编译 |
| 编译目标 | Vue 的 VNode 创建与运行时 helper |
| 特有能力 | 支持 Vue 风格的 `v-model`、指令、slots、事件 |
| Vite 插件作用 | 把 Vue JSX 编译规则接入构建链 |
