# 📖 之前：`React.createElement`

在 **React 17 及以前版本**，JSX 语法最终编译（比如通过 Babel 编译）出来的是类似这样的代码：

```jsx
const element = <h1>Hello, world!</h1>
```

编译后实际上是：

```javascript
const element = React.createElement('h1', null, 'Hello, world!')
```

所以 JSX 其实是一个 **语法糖**，背后调用的是 `React.createElement` 方法来创建虚拟 DOM。

---

# 🚀 变化：引入了 `jsx` 函数

从 **React 17** 开始，React 引入了一个新的编译方式 —— 叫做 **新的 JSX 转换（New JSX Transform）**，但 **真正默认启用是在 React 18 时代** 配合新版的 Babel。

新的 JSX 编译，会直接编译成调用一个新的 `jsx` 函数，而不是 `React.createElement`。比如：

```jsx
const element = <h1>Hello, world!</h1>
```

经过新版 Babel（@babel/preset-react 7.9.0+）编译后，会变成：

```javascript
import { jsx } from 'react/jsx-runtime'

const element = jsx('h1', { children: 'Hello, world!' })
```

也就是说：

| React 版本          | JSX 编译后                                 |
| :------------------ | :----------------------------------------- |
| React 16 及以前     | `React.createElement(...)`                 |
| React 17 引入新方案 | 可以使用新的 `jsx(...)` 函数（兼容老方案） |
| React 18            | 完全推荐使用 `jsx(...)`                    |

---

# 🧠 为什么要这么做？

1. **减少打包体积**：使用 `jsx` 以后，不再需要在每个文件都 `import React from 'react'`，因为 `jsx` 函数是直接引入的，不依赖 React 全局变量。

2. **优化性能**：`jsx` 函数生成的虚拟节点更轻量，可以有更高效的构建和运行时表现。

3. **更灵活**：比如未来支持 Server Components、新的渲染模型，都可以通过 `jsx-runtime` 模块灵活地切换。

---

# 🏗️ 相关的两个运行时模块

- `react/jsx-runtime`
  → 提供 `jsx` 和 `jsxs`（多个 children）函数。
- `react/jsx-dev-runtime`
  → 开发环境下用的，提供带额外 debug 信息的 `jsxDEV` 函数。

这也是为什么新版 React 工程中，很多情况下**不需要手动 import React**了，比如：

```jsx
// React 18 中，默认可以这样写
export default function App() {
  return <div>Hello</div>
}
```

背后是引入了 `jsx` 运行时，而不是 `React.createElement`。

---

# 📝 总结

| 项目                    | 旧模式                  | 新模式                           |
| :---------------------- | :---------------------- | :------------------------------- |
| JSX 编译方式            | `React.createElement`   | `jsx` 函数 (`react/jsx-runtime`) |
| 变更引入版本            | React 17 引入（非强制） | React 18 推荐默认                |
| 是否需要 `import React` | 必须                    | 可选（取决于 Babel 设置）        |
| 优势                    | 无                      | 体积更小、性能更优               |

---

要不要我顺便给你写一个小 demo，让你直观对比一下 `React.createElement` 和 `jsx` 的区别？要的话告诉我～
💬（顺便还能教你怎么在项目里切换使用新旧 JSX Transform！）
