# Vue 3.5 SSR 与 Hydration

Vue 3.5 在 SSR 方向的改进很实用，核心是两件事：

1. **把 hydration 时机做成可控策略**（Lazy Hydration）
2. **给常见 hydration mismatch 提供更明确的控制手段**

## 一、Lazy Hydration：把“什么时候激活”交给你

在传统 SSR 中，首屏 HTML 很快可见，但 JS 下载后会尽快 hydrate 全部交互节点。  
如果页面很大，或很多组件首屏可见但不需要马上交互，这会让主线程压力变高。

Vue 3.5 提供了按条件激活的策略（与异步组件配合）：

- `hydrateOnIdle`
- `hydrateOnVisible`
- `hydrateOnInteraction`
- `hydrateOnMediaQuery`

示例（仅当组件可见时再 hydrate）：

```ts
import { defineAsyncComponent, hydrateOnVisible } from 'vue'

const ProductReviews = defineAsyncComponent({
  loader: () => import('./ProductReviews.vue'),
  hydrate: hydrateOnVisible(),
})
```

这能把“首屏可见”与“立刻可交互”解耦，减少不必要的早期 hydration 成本。

## 二、Hydration Mismatch：显式允许可预期差异

有些内容天然会在服务端和客户端不一致，比如：

- 时间戳
- 随机数
- 依赖客户端环境的展示

Vue 3.5 提供 `data-allow-mismatch`，用于告诉框架“这里的差异是预期行为，不必警告”。

```html
<span data-allow-mismatch>{{ new Date().toLocaleString() }}</span>
```

注意这不是“掩盖 bug”工具。  
建议只用于确实不可避免的差异，并尽量把范围缩小到最小节点。

## 三、`<Teleport defer>`：延迟挂载目标解析

SSR 与复杂布局下，Teleport 的目标节点可能在组件初始化时还不可用。  
Vue 3.5 的 `defer` 可以把目标解析延后到更安全时机：

```html
<Teleport defer to="#modal-root">
  <MyModal />
</Teleport>
```

这个在流式渲染、嵌套布局和大型应用里很实用，能减少目标未就绪带来的不稳定行为。

## 四、实践建议

1. 先挑“首屏非关键交互”组件接入 `hydrateOnVisible`，观察 TTI 与主线程负载。
2. 对已知的时间/随机差异点，精准使用 `data-allow-mismatch`，不要全局滥用。
3. Teleport 目标可能晚出现的页面，优先评估 `defer`。

## 总结

Vue 3.5 的 SSR 改进不是抽象概念，而是工程可落地的“时机控制”能力：

- 何时 hydrate
- 哪些差异允许存在
- Teleport 目标何时解析

这三点组合起来，能明显提升 SSR 项目在复杂页面下的稳定性与性能上限。
