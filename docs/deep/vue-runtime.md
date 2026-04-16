# Vue 3 响应式系统的实现原理

这一篇讨论的是 Vue 运行时里最核心的一层能力：

> 为什么 Vue 3 能做到“谁依赖谁，就只更新谁”？

最短答案是：

> Vue 通过 Proxy 拦截访问和修改，再用 effect 系统记录依赖关系，让每个响应式字段都能精确知道“谁在用我”。

这也是 Vue 3 和很多“整组件重新执行”的更新模型之间最大的差异之一。

## 先记住一句话

Vue 3 不是靠“整个组件树粗暴重跑”来更新的，而是尽量把依赖关系收集到字段级，再让更新只命中真正相关的副作用。

所以如果你理解了：

- `track`
- `trigger`
- `effect`

你就基本摸到了 Vue 响应式系统的核心骨架。

## 核心机制一览

Vue 3 响应式核心可以先粗略记成四部分：

| 组成 | 简介 |
| :-- | :-- |
| `reactive()` / `ref()` | 把对象或值包装成响应式来源 |
| Proxy 拦截器 | 捕获 `get` / `set` 等访问行为 |
| `effect()` | 把渲染逻辑、watch、computed 等纳入副作用系统 |
| 依赖图（Dep Map） | 记录“哪个 key 被哪些 effect 使用” |

## 1. 使用 Proxy 实现响应式入口

```js
const state = reactive({ count: 0 })
```

Vue 内部不会真的把对象“改写成带 getter/setter 的另一个对象”，而是更接近：

```js
const proxy = new Proxy(target, {
  get(target, key, receiver) {
    track(target, key)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    trigger(target, key)
    return result
  },
})
```

这里的核心分工非常明确：

- `get` 时做依赖收集
- `set` 时做依赖触发

## 2. `track()`：依赖收集

当你读取：

```js
state.count
```

Vue 会把“当前正在执行的 effect”记录到 `count` 这个依赖集合里。

也就是说，它会建立一种关系：

- `state.count` 被谁用到了？
- 当前 effect 应该挂到哪个 key 上？

可以把内部结构粗略理解成：

```js
{
  target: {
    count: Set([effect1, effect2]),
  },
}
```

这就是响应式系统最关键的一步：

> 不是笼统记录“这个组件依赖这个对象”，而是记录“这个 effect 依赖这个对象的这个 key”。

## 3. `trigger()`：精准触发

当你执行：

```js
state.count++
```

Vue 内部会：

1. 找到 `state.count` 对应的依赖集合
2. 只取出依赖这个 key 的 effect
3. 重新调度这些 effect

所以它不会无差别触发所有相关逻辑，而是尽量做到：

- 改 `count`，只影响依赖 `count` 的副作用
- 改 `message`，只影响依赖 `message` 的副作用

这就是 Vue 细粒度更新的根本来源。

## 4. effect 系统是什么

在 Vue 内部，渲染函数、`watchEffect`、`computed` 等都会落到 effect 系统里。

例如：

```js
effect(() => {
  console.log(state.count)
})
```

你可以把 effect 理解成：

- 一段会读取响应式数据的副作用函数
- 执行时会自动完成依赖收集
- 对应数据变化后会被重新执行

所以 effect 系统本质上是在做一件事：

> 把“数据”与“依赖这些数据的副作用”连接起来。

## 5. 用依赖图理解会更直观

```js
const state = reactive({ count: 0, message: 'hello' })

effect(() => console.log(state.count))   // effect1
effect(() => console.log(state.message)) // effect2
```

此时关系更接近：

```txt
state.count   -> effect1
state.message -> effect2
```

所以：

- 改 `count` 只会跑 `effect1`
- 改 `message` 只会跑 `effect2`

而不是“整个东西全重来一遍”。

## 为什么这比“组件级更新”更细

很多框架或模型更偏向：

- 组件函数重新执行
- 再靠 diff 去判断哪些 DOM 真正变化

Vue 当然也有渲染和 diff，但在进入那一步之前，它已经尽量把依赖追踪做得更细了。

所以 Vue 的特点可以概括为：

- 先用响应式系统尽量缩小需要重跑的副作用范围
- 再由渲染系统和 diff 完成最终视图更新

## Vue 3.5 的响应式系统重构

Vue 3.5 对响应式系统做过一轮很重要的重构，重点方向包括：

- 内存占用下降
- 依赖管理效率提升
- SSR 场景的一些问题修复
- 依赖关系内部结构进一步优化

如果只从概念上理解，你可以记成：

> Vue 3.5 不是推翻了响应式原理，而是在不改变外部心智模型的前提下，继续优化了这套依赖图系统的内部实现。

## 和 React 的对照应该怎么理解

很多人喜欢把“Vue 响应式”与“React 重新执行组件”做对比。

这个对比有价值，但更准确的理解应该是：

| 项目 | Vue 3 | React |
| :-- | :-- | :-- |
| 依赖粒度 | 更细，倾向字段级 | 更常见的是组件函数级重新执行 |
| 更新触发 | 谁依赖谁，就触发谁 | 通常组件重跑后再进入 diff |
| 手动优化压力 | 相对更低 | 更依赖 memo、useMemo、useCallback 等 |

这并不意味着谁“绝对更先进”，而是它们把更新成本分配到了不同层。

## 一句话理解

Vue 3 响应式系统的本质，就是通过 Proxy + effect + 依赖图，把“谁读取了什么数据”记录下来，再在数据变化时只重新触发真正相关的副作用。

## 建议继续阅读

如果你想把这篇继续接到编译器层，可以顺着读：

1. [类型推导与提取](./type-infer.md)
2. [自定义编译时指令](./custom-compile-directive.md)

如果你想回到更偏工程视角的对照阅读，可以看：

1. [为什么 React 市占率比 Vue 高](./why-react.md)
2. [vite dev 和 build 下的 vue 产物](/advanced/vite-dev-build)
