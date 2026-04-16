# vite dev 和 build 下的 vue 产物

这一篇不只是展示两段代码差异，而是想回答一个更有价值的问题：

> 同一个 `.vue` 文件，为什么在 `vite dev` 和 `vite build` 下看起来像两个完全不同的产物？

答案是：两者服务的目标不同。

- `dev` 优先服务开发体验：按需编译、模块可追踪、HMR 快
- `build` 优先服务线上运行：体积更小、请求更少、资源更稳定

所以你看到的差异，不是“Vue 编译不一致”，而是**同一套能力在不同目标下的不同包装方式**。

## source

先看源代码：

```html
<script setup lang="ts">
  import { ref } from 'vue'

  const msg = ref('hello')
</script>

<template>
  <div>
    {{ msg }}
    <input v-model="msg" />
  </div>
</template>

<style scoped>
  .hello-msg {
    color: red;
  }
</style>
```

这个例子很小，但已经足够观察几件关键事情：

- `script setup` 会怎样落到 `setup()`
- 插值会怎样变成 `toDisplayString`
- 原生元素上的 `v-model` 会怎样引出运行时指令
- `scoped style` 会怎样变成带 `data-v-xxx` 的样式隔离

## dev

开发态下，Vite 会尽量把每个部分拆开，方便浏览器直接按模块加载，也方便 HMR 只更新最小单元。

### js(vue)

```js
import '/src/pages/hello.vue?vue&type=style&index=0&scoped=9e67ff97&lang.css'
import _export_sfc from '/@id/__x00__plugin-vue:export-helper'
import { createHotContext as __vite__createHotContext } from '/@vite/client'
import { createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, createTextVNode as _createTextVNode, defineComponent as _defineComponent, openBlock as _openBlock, toDisplayString as _toDisplayString, vModelText as _vModelText, withDirectives as _withDirectives, ref } from '/node_modules/.vite/deps/vue.js?v=c7e87a01'

import.meta.hot = __vite__createHotContext('/src/pages/hello.vue')
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: 'hello',
  setup(__props, { expose: __expose }) {
    __expose()
    const msg = ref('hello')
    const __returned__ = { msg }
    Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
    return __returned__
  }
})
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return _openBlock(), _createElementBlock('div', null, [
    _createTextVNode(
      `${_toDisplayString($setup.msg)} `,
      1
      /* TEXT */
    ),
    _withDirectives(_createElementVNode(
      'input',
      {
        'onUpdate:modelValue': _cache[0] || (_cache[0] = $event => $setup.msg = $event)
      },
      null,
      512
      /* NEED_PATCH */
    ), [
      [_vModelText, $setup.msg]
    ])
  ])
}
_sfc_main.__hmrId = '9e67ff97'
typeof __VUE_HMR_RUNTIME__ !== 'undefined' && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main)
import.meta.hot.on('file-changed', ({ file }) => {
  __VUE_HMR_RUNTIME__.CHANGED_FILE = file
})
import.meta.hot.accept((mod) => {
  if (!mod) { return }
  const { default: updated, _rerender_only } = mod
  if (_rerender_only) {
    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render)
  }
  else {
    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated)
  }
})
export default /* @__PURE__ */ _export_sfc(_sfc_main, [['render', _sfc_render], ['__scopeId', 'data-v-9e67ff97'], ['__file', '/path/to/your/only-vue-runtime/apps/fully-compiled/src/pages/hello.vue']])
```

### 开发态最值得观察的几点

#### 1. SFC 被拆成多个模块

你能看到样式不是和组件代码糊在一起的，而是通过：

`hello.vue?vue&type=style&index=0&scoped=...`

这种查询参数形式被拆成独立模块。

这正是 Vite 开发态“按块处理”的体现。

#### 2. HMR 代码被显式注入

`import.meta.hot`、`createHotContext`、`rerender`、`reload` 这些都是开发态专用逻辑。

它们的目标不是优化线上体积，而是让你改一个文件后只更新必要部分。

#### 3. `script setup` 被还原成 `setup`

你写的语法糖最终会落到：

- `defineComponent`
- `setup(__props, { expose })`
- 返回顶层绑定

#### 4. 原生元素上的 `v-model` 依然保留运行时辅助

这里可以清楚看到：

- `onUpdate:modelValue`
- `_withDirectives(...)`
- `_vModelText`

这说明原生元素上的 `v-model` 不是纯编译消失，而是“编译展开 + 运行时指令辅助”。

### js(css)

样式模块在开发态也会被包装成 JavaScript：

```js
import { createHotContext as __vite__createHotContext, removeStyle as __vite__removeStyle, updateStyle as __vite__updateStyle } from '/@vite/client'

import.meta.hot = __vite__createHotContext('/src/pages/hello.vue?vue&type=style&index=0&scoped=9e67ff97&lang.css')
const __vite__id = '/path/to/your/only-vue-runtime/apps/fully-compiled/src/pages/hello.vue?vue&type=style&index=0&scoped=9e67ff97&lang.css'
const __vite__css = '\n.hello-msg[data-v-9e67ff97] {\n  color: red;\n}\n'
__vite__updateStyle(__vite__id, __vite__css)
import.meta.hot.accept()
import.meta.hot.prune(() => __vite__removeStyle(__vite__id))
```

### 为什么 CSS 会变成 JS

因为开发态要支持热更新。

最直接的做法，就是把样式也变成一个可热替换的模块，通过运行时注入和移除 `<style>` 标签完成即时更新。

所以你在浏览器里看到“CSS 代码被包成 JS”，不要惊讶，这正是开发体验优先的设计。

## build

生产构建时，目标完全不同：尽量减少运行时开发辅助、压缩资源、拆分共享代码、提取独立 CSS。

### js(vue)

```js
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.js'
import { a as createBaseVNode, c as createElementBlock, e as createTextVNode, d as defineComponent, o as openBlock, f as ref, t as toDisplayString, v as vModelText, w as withDirectives } from './index-DdxCd2hx.js'

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'hello',
  setup(__props) {
    const msg = ref('hello')
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock('div', null, [
        createTextVNode(`${toDisplayString(msg.value)} `, 1),
        withDirectives(createBaseVNode('input', {
          'onUpdate:modelValue': _cache[0] || (_cache[0] = $event => msg.value = $event)
        }, null, 512), [
          [vModelText, msg.value]
        ])
      ])
    }
  }
})
const hello = /* @__PURE__ */ _export_sfc(_sfc_main, [['__scopeId', 'data-v-57a43150']])
export {
  hello as default
}
```

### css

```css
.hello-msg[data-v-57a43150] {
  color: red;
}
```

## 生产态最值得观察的几点

### 1. HMR 相关代码消失了

因为线上不需要热更新，所以 `import.meta.hot` 相关逻辑会被完全移除。

### 2. 共享依赖被抽到 chunk 中

你会看到像 `index-DdxCd2hx.js` 这样的共享 chunk。

这意味着运行时 helper、共享依赖会被复用，而不是每个页面模块都重复内联。

### 3. CSS 被提取成独立文件

开发态为了 HMR 用 JS 注入；生产态为了缓存和加载效率，通常提取成单独 CSS 文件。

### 4. 仍能看出编译本质没有变

虽然包装方式不同，但你依然能看到相同的核心痕迹：

- `defineComponent`
- `ref`
- `toDisplayString`
- `withDirectives`
- `vModelText`
- `data-v-xxx`

也就是说，**变化的是工程包装，不是 Vue 编译本质本身**。

## dev 和 build 的核心差异

| 维度 | `vite dev` | `vite build` |
| --- | --- | --- |
| 目标 | 开发效率、HMR | 线上体积、缓存、加载效率 |
| 模块形态 | 更细粒度、便于追踪 | 更聚合、便于部署 |
| CSS 处理 | JS 注入，支持热更新 | 提取为独立 CSS 文件 |
| 调试信息 | 更完整，保留源映射与文件路径 | 更偏压缩和产物组织 |
| HMR 代码 | 存在 | 移除 |

## 这一篇真正该记住什么

不要把开发态看到的产物当成 Vue 最终本质，也不要把生产态压缩后的 chunk 当成“唯一正确形态”。

更准确的理解是：

1. Vue 先把 SFC 编译成运行时可消费的组件逻辑
2. Vite 再根据开发或生产目标做不同的模块包装
3. 开发态和生产态差异很大，但底层编译结论是一致的

## 建议如何自己验证

你可以自己再做几组实验：

1. 给模板加一个 `v-if`
2. 给组件加一个事件修饰符
3. 把 `v-model` 换成组件上的 `v-model`
4. 再观察 `dev` 和 `build` 产物差异

这样你会更容易把“模板语法”和“最终产物”真正对应起来。
