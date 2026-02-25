# Vue 3 响应式系统的实现原理

> Vue 3 之所以能做到极细粒度依赖追踪，是因为它内部用 Proxy 拦截对象访问，并通过 Effect 系统记录每个响应式数据的具体使用位置，只在真正依赖的数据变化时局部更新。

不像 React（组件级 diff），Vue 是**字段级、精确级**追踪。

## 核心机制一览

Vue 3 响应式核心由四大部分组成：

| 组成                   | 简介                                     |
| :--------------------- | :--------------------------------------- |
| `reactive()` / `ref()` | 把对象/值变成响应式，底层用 Proxy        |
| Proxy 拦截器           | 捕捉 get/set 操作                        |
| `effect()`             | 建立副作用（副作用函数就是你的渲染逻辑） |
| 依赖收集 (Dep Map)     | 记录每个响应式属性被哪些 effect 使用     |

## 详细分解

### 使用 Proxy 实现响应式

```javascript
const state = reactive({ count: 0 })
```

Vue 内部用 Proxy 代理：

```javascript
const proxy = new Proxy(target, {
  get(target, key, receiver) {
    track(target, key) // 依赖收集
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    trigger(target, key) // 依赖触发
    return result
  }
})
```

- `get` 时执行 `track()` 收集依赖
- `set` 时执行 `trigger()` 触发更新

### track() — 依赖收集

当你访问 `state.count` 时，Vue 自动调用 `track`：

- 当前正在执行的 `effect`（比如渲染函数）被记录到 `state.count` 上
- 每个属性都建立一棵自己的依赖集合（Dep）

内部存储结构：

```javascript
// targetMap 结构
{
  state: { // 目标对象
    count: new Set([effect1, effect2]) // 哪些 effect 依赖了 count
  }
}
```

**谁用到谁，就记录谁**，非常精确。

### trigger() — 精准触发更新

当你执行 `state.count++`，Vue 内部调用 `trigger()`：

- 找到 `state.count` 这个 key 对应的所有 effect
- 只重新执行这些 effect（比如更新视图）

不会触发无关的 effect，**只更新用到 count 的地方**。

## Effect 系统

每个响应式副作用（render 函数、watch、computed）在 Vue 内部都是一个 `ReactiveEffect` 实例：

```javascript
effect(() => {
  console.log(state.count)
})
```

这行代码会：

- 生成一个 Effect，标记为当前 active effect
- 执行时 track 到 `state.count`
- 将来 `state.count` 改变时，只重新运行这一个 effect

Effect 系统本质上就是数据（state）和副作用函数（effect）之间建立了精准的依赖关系，这些关系组织成一张**依赖图**，而不是简单的组件树。

### 可视化理解

```javascript
const state = reactive({ count: 0, message: 'hello' })

effect(() => console.log(state.count))   // effect1
effect(() => console.log(state.message)) // effect2
```

依赖关系图：

```
state.count   -->   effect1
state.message -->   effect2
```

改 `count` 只跑 `effect1`，改 `message` 只跑 `effect2`，互不干扰。

## Vue 3.5 响应式系统重构

Vue 3.5 对响应式系统进行了重大重构：

- **内存占用降低 56%**：通过优化内部数据结构，大幅减少了响应式系统的内存开销
- **性能提升**：依赖收集和触发更新的效率进一步提高
- **修复 SSR 问题**：解决了 SSR 场景下 computed 值过期和内存泄漏的问题
- **双向链表结构**：用双向链表替代了之前的 Set 来管理依赖关系，减少了内存分配

## 对比 React

| 项目       | Vue 3                   | React                              |
| :--------- | :---------------------- | :--------------------------------- |
| 响应式粒度 | 字段级                  | 组件级                             |
| 更新触发   | 精确收集依赖并更新      | 通常整个函数组件重新执行           |
| 手动优化   | 基本不需要              | 需要 useMemo, useCallback, memo 等 |
| 底层机制   | Proxy 拦截+Effect系统   | 普通函数执行，diff 整个子树        |

## 总结

> Vue 3 通过 Proxy 拦截访问和修改操作，并用 Effect 系统精确管理依赖关系，实现了字段级、最小代价的高效更新。Vue 3.5 进一步优化了这套系统的内存占用和性能表现。
