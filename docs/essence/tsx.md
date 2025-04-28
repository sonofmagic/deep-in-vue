# vue jsx/tsx 的本质

不知道你有没有想过，为什么 `jsx` 支持，需要安装包 `@vitejs/plugin-vue-jsx`

实际上，所有的 `jsx/tsx` 都会经过 `babel` 编译，变成最后的 `js` 的

其中 `vue` 编写了 [@vue/babel-plugin-jsx](https://github.com/vuejs/babel-plugin-jsx) 编译插件，作为自定义的编译规则

## 什么是 JSX 文件

JSX 本质上不是浏览器或 JavaScript 原生支持的语法，它是一种**语法糖**，需要通过 Babel 转换成 JavaScript 函数调用才能执行。

例如在 React 中：

```jsx
<div className="greeting">Hello, JSX</div>
```

会被 Babel 转换为：

```js
import { jsx as _jsx } from 'react/jsx-runtime'
/* #__PURE__ */_jsx('div', {
  className: 'greeting',
  children: 'Hello, JSX'
})
```

[babeljs playgroud](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=JYWwDg9gTgLgBAbzgVwM4FMDKMCGN1wC-cAZlBCHAORTo4DGMVA3AFCsnIB2jwEXcAMIUwACgCUCVnDj1-qeAG053GABo4GGMNUBdOAF4UGbHnSiADOLbS4tGMigDRtmQB4ARshgx-cfoIANsD0ANYGCBKGAHya6NoQqqIqXPAA1HAAjOKE0a4ycICdDoDfioBhcogpMMSAhNb5bgD0Xj78eTLWrITsnDwwfAI6qehQUVIyclwKcMqJqRpaAzD6RmhYuPiW7bb2js51Tb4CAcFhEVEGsfMzMMlXcBnZufkyJeUIlTVPcG7C4HBgXBAACboCKebwHaL_IHoBr7FrEOQgCILIbEeqtAqw8EtWztQhAA&forceAllTransforms=false&modules=false&shippedProposals=false&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=false&targets=&version=7.27.0&externalPlugins=&assumptions=%7B%7D)

> 扩展阅读 [React createElement 与 jsx 函数](./react-jsx.md)

在 Vue 中，JSX 也是类似地转换成函数调用，只是调用的是 Vue 的渲染函数 API。

## 为什么 Vue 需要专门的 Babel 插件？

Vue 的 JSX 和 React 的 JSX 看起来很像，但底层实现**完全不同**。Vue 使用的是 `createVNode()` 来描述虚拟 DOM。

因此，如果你直接使用标准的 Babel JSX 插件（如 `@babel/plugin-transform-react-jsx`），会默认把 JSX 编译为 `React.createElement` / `jsx`，这就不兼容 `Vue` 了。

为了解决这个问题，Vue 官方编写了自己的 Babel 插件：[**@vue/babel-plugin-jsx**](https://github.com/vuejs/babel-plugin-jsx)

## @vue/babel-plugin-jsx 做了什么？

这个插件做了非常多底层定制工作，核心功能包括：

### 1. **将 JSX 编译为 Vue 的 `createVNode()` 调用**

```jsx
<div id="foo">bar</div>
```

会变成：

```js
_createVNode('div', {
  id: 'foo'
}, [_createTextVNode('bar')])
```

而 `createVNode` 默认是从当前作用域中引入的 Vue 的 `createVNode()` 函数。

### 2. **支持 Vue 特有语法**

- `v-model` 转换
- `v-show` / `v-html` 等指令
- 插槽（Slots）的识别与转换

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
    'onUpdate:modelValue': $event => modelValue = $event
  }, null), [[_vModelText, modelValue]]),
  _createVNode(_resolveComponent('Comp'), {
    'modelValue': modelValue,
    'onUpdate:modelValue': $event => modelValue = $event
  }, null)
])
```

### 3. **事件绑定语法**

```jsx
<MyComponent onClick={handler} />
```

```js
_createVNode(_resolveComponent('MyComponent'), {
  onClick: handler
}, null)
```

### 4. **自动注入作用域变量（如 `ctx.slots`）**

Vue 组件渲染函数的上下文是通过 `setup()` 中的返回值或 `render()` 中传入的 `ctx` 提供的。插件会自动帮你处理这些作用域引用。

## 为什么使用 Vite 时还需要安装 `@vitejs/plugin-vue-jsx`？

Vite 本身并不自带对 Vue JSX 的支持，它是通过这个插件来集成 Babel 的编译工作（实际上是调用上面的 `@vue/babel-plugin-jsx` 插件）。

这个 Vite 插件做了两件事：

1. 注册 `@vue/babel-plugin-jsx` 供 Babel 使用
2. 确保 JSX 文件正确走过 Vue 的构建流程（热更新、模块分析等）

## 总结：Vue JSX 的本质

1. JSX 是一种语法糖，需要被 Babel 编译
2. Vue 的 `@vue/babel-plugin-jsx` 负责将 JSX 转换为 Vue 的 `createVNode()` 调用，并支持 Vue 特有语法
3. 使用 JSX 并不意味着和 React 有任何运行时耦合，它只是 Vue 渲染函数的**一种书写形式**
4. 在 Vite 中使用 Vue JSX，需要额外安装 `@vitejs/plugin-vue-jsx` 来接入 Babel 插件系统
