# React 函数组件 vs Vue setup 渲染函数

本文对比 React 的函数式组件与 Vue 3 中 `setup` 返回 render 函数的组件，帮助你理解两者在设计理念和运行机制上的核心差异。

## 定义方式

|          | React 函数组件                               | Vue 3 `setup` 返回 `render`                  |
| :------- | :------------------------------------------- | :------------------------------------------- |
| 写法     | 直接写成一个函数，返回 JSX                   | `setup()` 函数里返回一个 `render` 函数       |
| 示例     | `function App() { return <div>Hello</div> }` | `setup() { return () => h('div', 'Hello') }` |
| JSX 支持 | 直接支持                                     | 需要安装支持插件（如 vue-jsx）               |

## 执行时机

|              | React 函数组件                                           | Vue 3 `setup`                                                                      |
| :----------- | :------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| 什么时候执行 | 每次渲染时重新执行                                       | 初始化时执行一次，返回的 `render` 会多次执行                                       |
| 说明         | 函数组件本体本身就是渲染逻辑，重新执行来产生新的虚拟 DOM | `setup` 只做准备工作（如定义响应式数据），真正每次渲染的是 `setup` 返回的 `render` |

核心区别：

- React 每次渲染 **组件函数整体重新调用**
- Vue `setup` 只在组件创建时调用一次，之后只调用 `setup` 返回的 `render` 函数

## 响应式机制

|          | React 函数组件                                       | Vue 3 `setup`                              |
| :------- | :--------------------------------------------------- | :----------------------------------------- |
| 状态管理 | 必须使用 `useState`, `useReducer` 等 hook 来保存状态 | 使用 Vue 的响应式系统（`ref`, `reactive`） |
| 更新触发 | 显式 setState 才触发更新                             | 依赖追踪，响应式对象变化自动触发更新       |
| 示例     | `const [count, setCount] = useState(0)`              | `const count = ref(0)`                     |

- React 必须通过 hook 返回的 setter 主动更新
- Vue 自动追踪响应式依赖，只要 `.value` 变化就触发渲染

## 返回值

|            | React 函数组件 | Vue 3 `setup`                           |
| :--------- | :------------- | :-------------------------------------- |
| 返回什么   | JSX 虚拟 DOM   | 一个 `render` 函数（返回 VNode 或 JSX） |
| 直接返回？ | 是             | 否，需要从 `setup` 返回 `render`        |

React:

```jsx
function App() {
  return <div>Hello</div>
}
```

Vue:

```javascript
setup() {
  return () => <div>Hello</div>
}
```

注意 Vue 的 `setup` 必须返回一个**函数**（而不是直接 JSX）。

## 更新机制

|          | React 函数组件                                 | Vue 3 `setup` 渲染函数                |
| :------- | :--------------------------------------------- | :------------------------------------ |
| 更新原理 | 改 state → 函数组件重新执行 → 生成新的虚拟 DOM | 响应式 ref 改变 → render 函数重新执行 |
| 性能特点 | 需要比较新的 state/props → 执行整个函数体      | 自动按依赖追踪，细粒度响应式优化      |

Vue 在细粒度依赖追踪上比 React 更精确：`count` 变化只影响它的使用处，而 React 是整个函数重算。

## 终极对比表

| 对比维度     | React 函数组件           | Vue 3 setup 返回 render             |
| :----------- | :----------------------- | :---------------------------------- |
| 定义形式     | 普通函数                 | `setup` 返回一个 `render`           |
| 渲染时执行   | 整个组件函数每次重新执行 | `render` 函数执行，`setup` 只初始化 |
| 响应式模型   | 通过 Hook 手动管理       | 通过 ref/reactive 自动追踪          |
| 更新触发     | 必须手动调用 setState    | 修改响应式数据自动更新              |
| JSX 支持     | Babel 插件               | 需要 Babel 插件或 vite 插件         |
| 生命周期钩子 | Hook 风格（useEffect）   | onMounted/onUpdated 等              |

> **React 函数组件 = 每次渲染重新执行本体。**
> **Vue 3 `setup` + `render` = 用一次 `setup` 做初始化，用 `render` 专门负责渲染。**

---

## 实战对比：计数器

分别用 React 函数组件和 Vue 3 Composition API + setup 返回 render 函数实现一个简单计数器。

### React 版

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>当前计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  )
}

export default Counter
```

- `useState` 创建局部状态
- 点击按钮调用 `setCount`，触发整个 `Counter` 组件重新执行一次
- 每次 render 都重新走一遍 `Counter()` 函数体

### Vue 3 版

```javascript
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    return () => (
      <div>
        <p>当前计数：{count.value}</p>
        <button onClick={() => count.value++}>增加</button>
      </div>
    )
  }
}
```

- `ref` 创建响应式变量
- `setup` 初始化好响应式数据，只执行一次
- `render` 是 `setup` 返回的函数，因为依赖的 `count.value` 变化才重新执行
- Vue 内部做了**依赖追踪**，只要 `count` 有变化才重新渲染

---

## 进阶对比：父子组件通信与渲染优化

需求：父组件维护 `count` 和 `other` 两个状态，子组件接受 `count` 并显示。当只改变 `other` 时，子组件**不应该**重新渲染。

### React 版（未优化）

```jsx
import { useState } from 'react'

function Child({ count }) {
  console.log('子组件渲染了')
  return <p>子组件收到的 count: {count}</p>
}

function App() {
  const [count, setCount] = useState(0)
  const [other, setOther] = useState(0)

  return (
    <div>
      <h1>父组件 count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>增加 count</button>
      <button onClick={() => setOther(other + 1)}>改变 other</button>
      <Child count={count} />
    </div>
  )
}
```

问题：点击 "改变 other" 也会导致 `Child` 重新渲染，因为父组件重新渲染时子组件也跟着渲染了。

### React 版（优化后）

```jsx
import { memo, useState } from 'react'

const Child = memo(({ count }) => {
  console.log('子组件渲染了')
  return <p>子组件收到的 count: {count}</p>
})

function App() {
  const [count, setCount] = useState(0)
  const [other, setOther] = useState(0)

  return (
    <div>
      <h1>父组件 count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>增加 count</button>
      <button onClick={() => setOther(other + 1)}>改变 other</button>
      <Child count={count} />
    </div>
  )
}
```

需要配合 `React.memo` 才能避免无意义渲染。

### Vue 3 版（天然优化）

```jsx
import { ref } from 'vue'

const Child = {
  props: ['count'],
  setup(props) {
    console.log('子组件 setup 执行了')
    return () => <p>子组件收到的 count: {props.count}</p>
  }
}

export default {
  components: { Child },
  setup() {
    const count = ref(0)
    const other = ref(0)

    return () => (
      <div>
        <h1>父组件 count: {count.value}</h1>
        <button onClick={() => count.value++}>增加 count</button>
        <button onClick={() => other.value++}>改变 other</button>
        <Child count={count.value} />
      </div>
    )
  }
}
```

Vue 只在 `count` 变化时重新渲染 `Child`，点击 "改变 other" 不会让 `Child` 重新渲染。这得益于 Vue 的**依赖追踪系统**。

### 对比总结

| 项目             | React                                        | Vue 3                                            |
| :--------------- | :------------------------------------------- | :----------------------------------------------- |
| 父组件重新渲染时 | 默认子组件也重新渲染（需要手动用 memo 优化） | 子组件不会因无关数据变化重新渲染（自动追踪依赖） |
| 手动优化         | 需要 `React.memo`, `useMemo`, `useCallback`  | 不需要                                           |
| 性能优化负担     | 开发者自己承担                               | 框架自动处理                                     |
| 响应式粒度       | 粒度粗（整个函数重算）                       | 粒度细（字段依赖追踪）                           |

---

## 进阶对比：函数 Props 的稳定性

需求：父组件把 `increaseCount` 函数作为 props 传给子组件。

### React 版（未优化）

```jsx
import { useState } from 'react'

function Child({ onClick }) {
  console.log('子组件渲染了')
  return <button onClick={onClick}>子组件按钮</button>
}

function App() {
  const [count, setCount] = useState(0)
  const [other, setOther] = useState(0)

  // 每次 App 渲染都会新建一个函数
  const increaseCount = () => setCount(count + 1)

  return (
    <div>
      <h1>父组件 count: {count}</h1>
      <button onClick={() => setOther(other + 1)}>改变 other</button>
      <Child onClick={increaseCount} />
    </div>
  )
}
```

每次父组件渲染，`increaseCount` 都是新函数（新内存地址），导致 `Child` 被强制重新渲染。

### React 版（useCallback 优化）

```jsx
import { memo, useCallback, useState } from 'react'

const Child = memo(({ onClick }) => {
  console.log('子组件渲染了')
  return <button onClick={onClick}>子组件按钮</button>
})

function App() {
  const [count, setCount] = useState(0)
  const [other, setOther] = useState(0)

  const increaseCount = useCallback(() => {
    setCount(c => c + 1)
  }, [])

  return (
    <div>
      <h1>父组件 count: {count}</h1>
      <button onClick={() => setOther(other + 1)}>改变 other</button>
      <Child onClick={increaseCount} />
    </div>
  )
}
```

必须配合 `React.memo` + `useCallback` 才能避免无意义渲染。

### Vue 3 版

```jsx
import { ref } from 'vue'

const Child = {
  props: ['onClick'],
  setup(props) {
    console.log('子组件 setup 执行了')
    return () => <button onClick={props.onClick}>子组件按钮</button>
  }
}

export default {
  components: { Child },
  setup() {
    const count = ref(0)
    const other = ref(0)

    // 定义一次就好，函数地址天然稳定
    const increaseCount = () => { count.value++ }

    return () => (
      <div>
        <h1>父组件 count: {count.value}</h1>
        <button onClick={() => other.value++}>改变 other</button>
        <Child onClick={increaseCount} />
      </div>
    )
  }
}
```

Vue 里 `increaseCount` 定义好以后，函数地址天然稳定。不需要 `useCallback`，也不用 memo。

### 对比总结

| 对比项         | React                                         | Vue 3                        |
| :------------- | :-------------------------------------------- | :--------------------------- |
| 函数 props     | 每次渲染默认新建，需要手动 `useCallback` 优化 | 函数默认保持稳定，不需要优化 |
| 子组件重新渲染 | 可能无意义重渲染（必须用 memo + useCallback） | 自动避免，只在依赖变化时触发 |
| 开发者负担     | 高，需要自己管理 memo/callback                | 低，框架自动处理             |

---

## 根本原因

- **React 函数组件**是纯函数，每次渲染都重新执行，函数是新创建的对象
- **Vue 的 setup** 只执行一次，setup 里定义的所有对象/函数天然持久且稳定
- React 的渲染模型是**树形重算**（自顶向下），父组件变化默认子组件也重新执行
- Vue 的渲染模型是**依赖追踪**，字段级地追踪变化，只影响必要的地方

## 结论

> **React 是函数重新跑一遍，Vue 是响应式自动追踪变化，只有需要的部分更新。**
>
> React 需要开发者手动优化组件更新（`memo`、`useMemo`、`useCallback`）；Vue 3 自动根据响应式数据依赖追踪，粒度更细，开发者压力更小。
