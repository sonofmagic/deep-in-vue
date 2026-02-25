react 的函数式组件，

对比 vue setup 返回 render 函数的组件

---

# 1. 🏗 定义方式

|          | React 函数组件                               | Vue 3 `setup` 返回 `render`                  |
| :------- | :------------------------------------------- | :------------------------------------------- |
| 写法     | 直接写成一个函数，返回 JSX                   | `setup()` 函数里返回一个 `render` 函数       |
| 示例     | `function App() { return <div>Hello</div> }` | `setup() { return () => h('div', 'Hello') }` |
| JSX 支持 | 直接支持                                     | 需要安装支持插件（如 vue-jsx）               |

---

# 2. ⏳ 执行时机

|              | React 函数组件                                           | Vue 3 `setup`                                                                      |
| :----------- | :------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| 什么时候执行 | 每次渲染时重新执行                                       | 初始化时执行一次，返回的 `render` 会多次执行                                       |
| 说明         | 函数组件本体本身就是渲染逻辑，重新执行来产生新的虚拟 DOM | `setup` 只做准备工作（如定义响应式数据），真正每次渲染的是 `setup` 返回的 `render` |

**重点：**

- React 每次渲染 **组件函数整体重新调用**。
- Vue `setup` 只在组件创建时调用一次，之后只是调用 `setup` 返回的 `render` 函数。

---

# 3. 🧬 响应式机制

|          | React 函数组件                                       | Vue 3 `setup`                              |
| :------- | :--------------------------------------------------- | :----------------------------------------- |
| 状态管理 | 必须使用 `useState`, `useReducer` 等 hook 来保存状态 | 使用 Vue 的响应式系统（`ref`, `reactive`） |
| 更新触发 | 显式 setState 才触发更新                             | 依赖追踪，响应式对象变化自动触发更新       |
| 示例     | `const [count, setCount] = useState(0)`              | `const count = ref(0)`                     |

**总结：**

- React 必须通过 hook 返回的 setter 主动更新。
- Vue 自动追踪响应式依赖，只要 `.value` 变化就触发渲染。

---

# 4. 📤 返回值

|            | React 函数组件 | Vue 3 `setup`                           |
| :--------- | :------------- | :-------------------------------------- |
| 返回什么   | JSX 虚拟 DOM   | 一个 `render` 函数（返回 VNode 或 JSX） |
| 直接返回？ | 是             | 否，需要从 `setup` 返回 `render`        |

小例子 👇

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

---

# 5. 🔄 更新机制

|          | React 函数组件                                 | Vue 3 `setup` 渲染函数                |
| :------- | :--------------------------------------------- | :------------------------------------ |
| 更新原理 | 改 state → 函数组件重新执行 → 生成新的虚拟 DOM | 响应式 ref 改变 → render 函数重新执行 |
| 性能特点 | 需要比较新的 state/props → 执行整个函数体      | 自动按依赖追踪，细粒度响应式优化      |

所以：Vue 在细粒度依赖追踪上比 React 更细致一点，比如 `count` 变化只影响它的使用处，而 React 是整个函数重算。

---

# 📊 一张终极对比表

| 对比维度     | React 函数组件           | Vue 3 setup 返回 render             |
| :----------- | :----------------------- | :---------------------------------- |
| 定义形式     | 普通函数                 | `setup` 返回一个 `render`           |
| 渲染时执行   | 整个组件函数每次重新执行 | `render` 函数执行，`setup` 只初始化 |
| 响应式模型   | 通过 Hook 手动管理       | 通过 ref/reactive 自动追踪          |
| 更新触发     | 必须手动调用 setState    | 修改响应式数据自动更新              |
| JSX 支持     | Babel 插件               | 需要 Babel 插件或 vite 插件         |
| 生命周期钩子 | Hook 风格（useEffect）   | onMounted/onUpdated 等              |

---

# 🧠 直观理解：一句话总结

> **React 函数组件 = 每次渲染重新执行本体。
> Vue 3 `setup` + `render` = 用一次 `setup` 做初始化，用 `render` 专门负责渲染。**

---

**计数器（Counter）对比 demo**，
分别用 **React 函数组件** 和 **Vue 3 Composition API + setup 返回 render 函数** 实现。

---

# 🎯 要实现的功能

- 显示一个数字
- 点击按钮，数字加一

---

# 1. ✅ React 版（函数式组件）

```jsx
// React 18+ 写法
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0) // 用 Hook 保存状态

  return (
    <div>
      <p>
        当前计数：
        {count}
      </p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  )
}

export default Counter
```

**特点**：

- `useState` 创建局部状态
- 点击按钮，调用 `setCount`，触发整个 `Counter` 组件重新执行一次
- 每次 render 都重新走一遍 `Counter()` 函数体

---

# 2. ✅ Vue 3 版（`setup` 返回 `render` 函数）

```javascript
// Vue 3 + JSX 写法（需要启用 vue-jsx 插件）
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0) // 使用 Vue 响应式

    return () => (
      <div>
        <p>
          当前计数：
          {count.value}
        </p>
        <button onClick={() => count.value++}>增加</button>
      </div>
    )
  }
}
```

**特点**：

- `ref` 创建响应式变量
- `setup` 初始化好响应式数据
- `render` 是 `setup` 返回的函数，每次只因为依赖的 `count.value` 变化重新执行
- Vue 内部做了 **依赖追踪**，只要 `count` 有变化才重新渲染

---

# 📸 两个版本执行流程对比

| 项目          | React 函数组件                    | Vue 3 setup render                         |
| :------------ | :-------------------------------- | :----------------------------------------- |
| 点击按钮后    | setCount 触发重新渲染整个函数组件 | ref 的 value 变化，依赖追踪自动触发 render |
| 组件本体      | 每次重新执行整个函数              | setup 只初始化一次，render 函数被反复调用  |
| 响应式管理    | 手动管理（Hook）                  | 自动响应式（Ref系统）                      |
| 是否需要 memo | 经常需要 `React.memo` 优化子组件  | Vue 自动依赖追踪，不需要手动 memo          |

---

# 📢 补充一点小细节

在 React 中，如果组件复杂，状态变化容易导致**不必要的子组件重新渲染**，所以常常需要配合：

- `useMemo`
- `useCallback`
- `React.memo`

来进行手动优化。

而 Vue 由于响应式系统天然可以追踪依赖，所以即使是复杂组件，只要 `count` 变了，只有用到 `count` 的地方重新更新，**性能天然更好**，不需要手动 memo。

---

# 🎉 结论

这个小 Demo 帮助你看到核心差别：

> **React 是函数重新跑一遍，Vue 是响应式自动追踪变化，只有需要的部分更新。**

# 🎯 进阶版：**父子组件通信 + 子组件优化对比**

**需求**：

- 父组件维护一个 `count`
- 子组件接受 `count` 并显示
- 父组件点击按钮增加 `count`
- 子组件本身没有变化时 **应该避免不必要的重新渲染**

---

# 1. ✅ React 版：没有优化 ➔ 有优化（手动 memo）

### React（未优化版）

```jsx
import { useState } from 'react'

function Child({ count }) {
  console.log('👶 子组件渲染了')
  return (
    <p>
      子组件收到的 count:
      {count}
    </p>
  )
}

function App() {
  const [count, setCount] = useState(0)
  const [other, setOther] = useState(0) // 添加另一个状态

  return (
    <div>
      <h1>
        父组件 count:
        {count}
      </h1>
      <button onClick={() => setCount(count + 1)}>增加 count</button>
      <button onClick={() => setOther(other + 1)}>改变 other</button>
      <Child count={count} />
    </div>
  )
}

export default App
```

🔎 **现象**：

- 点击 "改变 other" 也会导致 `Child` 重新渲染（因为父组件重新渲染，子组件也跟着渲染了！）

---

### React（加优化版：`React.memo`）

```jsx
import { memo, useState } from 'react'

const Child = memo(({ count }) => {
  console.log('👶 子组件渲染了')
  return (
    <p>
      子组件收到的 count:
      {count}
    </p>
  )
})

function App() {
  const [count, setCount] = useState(0)
  const [other, setOther] = useState(0)

  return (
    <div>
      <h1>
        父组件 count:
        {count}
      </h1>
      <button onClick={() => setCount(count + 1)}>增加 count</button>
      <button onClick={() => setOther(other + 1)}>改变 other</button>
      <Child count={count} />
    </div>
  )
}

export default App
```

🔎 **现象**：

- 点击 "改变 other" 时，`Child` **不会**重新渲染了！
- 因为 `React.memo` 让 React 只在 `count` 变化时才重新渲染 `Child`。

---

# 2. ✅ Vue 3 版：天然响应式，无需手动 memo

```jsx
import { ref } from 'vue'

const Child = {
  props: ['count'],
  setup(props) {
    console.log('👶 子组件 setup 执行了')
    return () => (
      <p>
        子组件收到的 count:
        {props.count}
      </p>
    )
  }
}

export default {
  components: { Child },
  setup() {
    const count = ref(0)
    const other = ref(0)

    return () => (
      <div>
        <h1>
          父组件 count:
          {count.value}
        </h1>
        <button onClick={() => count.value++}>增加 count</button>
        <button onClick={() => other.value++}>改变 other</button>
        <Child count={count.value} />
      </div>
    )
  }
}
```

🔎 **现象**：

- Vue 只在 `count` 变化时重新渲染 `Child`！
- 点击 "改变 other" 不会让 `Child` 重新渲染。
- 这得益于 Vue 的 **依赖追踪系统**：`Child` 只依赖 `count.value`。

---

# 📊 最直观的总结对比

| 项目             | React                                        | Vue 3                                            |
| :--------------- | :------------------------------------------- | :----------------------------------------------- |
| 父组件重新渲染时 | 默认子组件也重新渲染（需要手动用 memo 优化） | 子组件不会因无关数据变化重新渲染（自动追踪依赖） |
| 手动优化         | 需要 `React.memo`, `useMemo`, `useCallback`  | 不需要                                           |
| 性能优化负担     | 开发者自己承担                               | 框架自动处理                                     |
| 响应式粒度       | 粒度粗（整个函数重算）                       | 粒度细（字段依赖追踪）                           |

---

# 🧠 为什么会这样？

- **React 的渲染模型**：是**树形重算**（自顶向下），一旦父组件变化，默认子组件也跟着重新执行。
- **Vue 的渲染模型**：是**依赖追踪**，**字段级**地追踪变化，只影响必要的地方。
- React 需要通过 `memo`、`useMemo`、`useCallback` 等手动控制更新粒度。
- Vue 天然细粒度响应式，不需要开发者操心什么时候缓存，什么时候更新。

---

# 🚀 最后，用一句话总结

> **React 要手动优化组件更新；Vue 3 自动根据响应式数据依赖追踪，粒度更细，开发者压力更小。**

---

# 🎯 要实现的功能

- 父组件有一个按钮 `increaseCount`
- 父组件把 `increaseCount` 函数 **作为 props** 传给子组件
- 点击子组件内部按钮，触发父组件的方法

---

# 1. ✅ React 版：函数 props 未优化 ➔ useCallback 优化版

### React（未优化版）

```jsx
import { useState } from 'react'

function Child({ onClick }) {
  console.log('👶 子组件渲染了')
  return <button onClick={onClick}>子组件按钮</button>
}

function App() {
  const [count, setCount] = useState(0)
  const [other, setOther] = useState(0)

  // increaseCount 每次 App 渲染都会新建一个函数
  const increaseCount = () => {
    setCount(count + 1)
  }

  return (
    <div>
      <h1>
        父组件 count:
        {count}
      </h1>
      <button onClick={() => setOther(other + 1)}>改变 other</button>
      <Child onClick={increaseCount} />
    </div>
  )
}

export default App
```

🔎 **现象**：

- 每次父组件 `App` 渲染（无论是点击增加 `other` 还是其他操作），
- `increaseCount` 都是一个新的函数（内存新地址）
- 导致 `Child` 即使本身没变化，也被**强制重新渲染**

---

### React（用 `useCallback` 优化版）

```jsx
import { useCallback, useState } from 'react'

const Child = React.memo(({ onClick }) => {
  console.log('👶 子组件渲染了')
  return <button onClick={onClick}>子组件按钮</button>
})

function App() {
  const [count, setCount] = useState(0)
  const [other, setOther] = useState(0)

  // 用 useCallback 缓存 increaseCount，只有 count 改变时才重新生成
  const increaseCount = useCallback(() => {
    setCount(c => c + 1) // 注意这里改成函数式 setState 避免依赖
  }, [])

  return (
    <div>
      <h1>
        父组件 count:
        {count}
      </h1>
      <button onClick={() => setOther(other + 1)}>改变 other</button>
      <Child onClick={increaseCount} />
    </div>
  )
}

export default App
```

🔎 **现象**：

- 点击 "改变 other"，`increaseCount` 地址不变
- 子组件 `Child` 不会重新渲染！
- 必须配合 `React.memo` + `useCallback` 才能真正避免无意义渲染。

---

# 2. ✅ Vue 3 版：天然没问题

```jsx
import { ref } from 'vue'

const Child = {
  props: ['onClick'],
  setup(props) {
    console.log('👶 子组件 setup 执行了')
    return () => <button onClick={props.onClick}>子组件按钮</button>
  }
}

export default {
  components: { Child },
  setup() {
    const count = ref(0)
    const other = ref(0)

    // increaseCount 定义一次就好了
    const increaseCount = () => {
      count.value++
    }

    return () => (
      <div>
        <h1>
          父组件 count:
          {count.value}
        </h1>
        <button onClick={() => other.value++}>改变 other</button>
        <Child onClick={increaseCount} />
      </div>
    )
  }
}
```

🔎 **现象**：

- Vue 里，`increaseCount` 定义好以后，不管父组件有没有重新渲染，函数地址是稳定的。
- Vue 不需要 `useCallback`，也不用 memo。
- 点击 "改变 other"，**子组件 `Child` 完全不会重新 setup 或重新渲染**。

---

# 📊 最直观总结表

| 对比项         | React                                         | Vue 3                        |
| :------------- | :-------------------------------------------- | :--------------------------- |
| 函数 props     | 每次渲染默认新建，需要手动 `useCallback` 优化 | 函数默认保持稳定，不需要优化 |
| 子组件重新渲染 | 可能无意义重渲染（必须用 memo + useCallback） | 自动避免，只在依赖变化时触发 |
| 开发者负担     | 高，需要自己管理 memo/callback                | 低，框架自动处理             |

---

# 🧠 为什么会这样？

- **React 函数组件**是纯函数，每次渲染都重新执行，**函数是新创建的对象**。
- **Vue 的 setup**只执行一次，setup 里定义的所有对象/函数**天然持久且稳定**，不是每次渲染重建。
- Vue 内部还有 Proxy 技术，进一步做到**细粒度依赖追踪**，从源头减少无意义更新。

---

# 🎉 最后一句话总结

> **React 中函数 props 需要手动 `useCallback`，Vue 3 中天然就稳定，无需额外优化。**

---
