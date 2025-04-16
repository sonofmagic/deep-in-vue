# only vue rumtime

- [only vue rumtime](#only-vue-rumtime)
  - [介绍](#介绍)
  - [运行环境](#运行环境)
  - [代码目录](#代码目录)
  - [运行方式](#运行方式)
  - [对比工具](#对比工具)
  - [认识 h 函数](#认识-h-函数)
    - [渲染原生元素](#渲染原生元素)
    - [渲染组件](#渲染组件)
  - [h 函数的本质](#h-函数的本质)
  - [插槽的本质](#插槽的本质)
  - [写法对比](#写法对比)
    - [v-for](#v-for)
    - [v-if](#v-if)
    - [v-model](#v-model)
    - [v-on / @xx](#v-on--xx)

## 介绍

本项目是一个 `vue3` `element-plus` 的教学项目，只包含 `vue3` 的运行时，不包含 `vue` 编译器，所以项目中不存在任何的 `vue` 文件和 `jsx` 写法。

这个项目编写的目的为，帮助我们更好的理解 `vue` 的运行机制，以及 `vue` 的编译原理。

在这里，你会体会到:

1. `vue`/`[jt]sx` 文件的本质
2. `script setup` 和 `script` 的区别
3. `.vue` 的编译时到底做了什么
4. 以及何为 `vue` 的编译时优化(本项目直接使用渲染函数来做，所以没有任何的编译器优化)
5. 分辨哪些是编译时指令，什么是运行时指令

## 运行环境

1. Nodejs@LTS(22.x)
2. pnpm@10

## 代码目录

- `apps/admin` 为项目本体

## 运行方式

```bash
# 安装包
pnpm i
# 开发环境
pnpm dev
```

## 对比工具

[`Vue Playground`](https://play.vuejs.org/#eNqdU02P0zAQ/SvGl7bSNlGAU0mrsqgScAAESFxySZNJ411/yR/doij/nbHTlBTtrlZc2njeezNvZuyOvtc6OXqgK5rbyjDtiAXn9aaQTGhlHOmIgYb0pDFKkBlSZxNox2+9c0pecOAgQLql5t4isZCVktYRYQ9kHRLNZx+Bc0V+KcPrV7PFSLCtepBnijMeEMjTwRBawYMDoXnpAE+E5G1GjsugWRc0Sgu66bpYpu/ztM0G2sXetuKsukfyfLHedKGk4pBwdZhnix61WZbl6cgetJYrt6mhKT1He3iIESJLAZinUcqBQSW6DMTzX1TW7Bg/xiQT7Ao940+lPPPTUTD5YlJ7hxMQqgaOUuy7oCRFME8ng8Kjdb85EFspDTVGkj3pQoZKcWVWZM89vCtkH4cdmBt6Qx2yZcMOyZ1VEu9FFBS0UkIzDuardgznV9DVkCpgJa704XOMheXdjPGqher+kfidPYVYQb8ZsGCOUNAL5kpzADfAux9f4ITfFxAb9hzZz4DfAXfrg8eBdutljbYnvOj2U7zCTB5+2t3JgbRjU8FoYPaRX1C88R+eaf2v3TfJ26jDeeIUhyeyFKX+Z44DcJ1ki0VS25YG6sF065y2qzStaolyXDI7mkSCS6UW6YS9DZu2Dm8G/gyhBKxY7oemUTvpe/o2X1BmSr+qw2QNp6TxnCeCyUQ8WST9zyqTdNurfCy83CW2/5IpPa7cvp42EfwH+5fF9X8AQR+3mQ==) 是一个非常好的 `vue` 的教学工具，我们可以在上面尝试编译一些 `vue` 文件，查看编译后的代码

## 认识 h 函数

### 渲染原生元素

```ts
import { h } from 'vue'

// 除了 type 外，其他参数都是可选的
h('div')
h('div', { id: 'foo' })

// attribute 和 property 都可以用于 prop
// Vue 会自动选择正确的方式来分配它
h('div', { class: 'bar', innerHTML: 'hello' })

// class 与 style 可以像在模板中一样
// 用数组或对象的形式书写
h('div', { class: [foo, { bar }], style: { color: 'red' } })

// 事件监听器应以 onXxx 的形式书写
h('div', { onClick: () => {} })

// children 可以是一个字符串
h('div', { id: 'foo' }, 'hello')

// 没有 prop 时可以省略不写
h('div', 'hello')
h('div', [h('span', 'hello')])

// children 数组可以同时包含 vnode 和字符串
h('div', ['hello', h('span', 'hello')])
```

### 渲染组件

```ts
import Foo from './Foo.vue'

// 传递 prop
h(Foo, {
  // 等价于 some-prop="hello"
  someProp: 'hello',
  // 等价于 @update="() => {}"
  onUpdate: () => {}
})

// 传递单个默认插槽
h(Foo, () => 'default slot')

// 传递具名插槽
// 注意，需要使用 `null` 来避免
// 插槽对象被当作是 prop
h(MyComponent, null, {
  default: () => 'default slot',
  foo: () => h('div', 'foo'),
  bar: () => [h('span', 'one'), h('span', 'two')]
})
```

## h 函数的本质

`h` 函数的本质是对 `createVNode` 的二次封装

`createVNode` 也是对 `createBaseVNode` 的二次封装

编译一个 `vue` 文件，会生成一个 `render` 函数，这个函数会调用像是

`toDisplayString` , `createElementVNode` , `vModelText`, `withDirectives` , `Fragment`, `openBlock`, `createElementBlock` 这些非常底层的函数或者标识符

```ts
const Fragment = Symbol.for('v-fgt')
const Text = Symbol.for('v-txt')
const Comment = Symbol.for('v-cmt')
const Static = Symbol.for('v-stc')
```

toDisplayString 是你在 vue 中使用 `{{ obj }}` 还能正常展示的原因，假如一个对象直接 `toString`，会得到 `[object Object]`

createElementVNode 是 createBaseVNode 的别名, 这个只能默认的 h5 元素和一些 vue 自己扩展的元素(比如 `Fragment`)，不像 h 还可以渲染组件

## 插槽的本质

[插槽的本质](https://play.vuejs.org/#eNp9U9tu00AQ/ZXpVqggxQnNhUswldqqSOUBEPDoF8cem03Wu6u9tImqfANfwBsfwffwA/wCs+vGOBHtm+fMmZkzZ9Z37Fzr4Y1HNmepLQzXDiw6r88yyRutjIN3uSw2F945JaEyqoGT4aiHheKTjnx+i1Y1eF30yD3snpyO2lE0hAKHjRa5Q4oA0l7rCABcCl6soEGKMpf2Zz9UkVqdS7BuI/BtxgollJkXm1xm7GzX7AhIBLF2FX3ho7bvwaR01AllA3bgQLBvf49F61ghcmtJRBX4ycIFDSFPm1ihXBgVlmrZ+1OiOXEJ+hx2DeAu1LdLwXFVVW9CvMiLVW2Ul+UcBJeYm6Q2eclRuqeT01mJ9QCOp+Ny8noM49kTCl5MX2JVPWurlSmR2kklMQI6L0su6znM9BpOn+t1RJvc1FxGsFeWhDnezuHVPVx4Y4M4rbh0aAjbxpvHVci7gwcRvDtKEvCWJgIdDhu15LD01kGlDJQUg/ZGK4sWkiS41Jn0+8fPP7++79/GWepc8Xq4tEpS92hYeAeN5gLNR+24kjZj89bKkMuFULfvI+aMx8EOL75hsfoPvrTrgGXsk0GL5gYz1uUcuYSuTV99+YBr+u6SjSq9IPYjyc/kjvBBY0u7oKOS7B4vqr2OfxxZ9tVerR1Ku1sqCA3MbeRnjCy+fGT1f3Inw2mso3ux7V9TJ2PO)

## 写法对比

参考文档: [渲染函数 & JSX](https://cn.vuejs.org/guide/extras/render-function.html#basic-usage)

### v-for

```ts
<div v-for="(item, index) in list" key="item.id">{{item.name}}</div>

list.map((item, index) => {
  return h('div', { key: item.id }, toDisplayString(item.name))
})
```

### v-if

```ts
<div v-if="condition"><span>1</span></div>
<div v-else>2</div>

condition? h('div', null, h('span', '1')) : h('div', null, '2')
```

### v-model

`v-model` 这个指令有些特殊，在绑定在原生元素，比如 `select`,`checkbox`,`textarea`,`input` 等等，会自动的绑定 `value` 和 `onInput` 事件

```ts
function resolveDynamicModel(tagName, type) {
  switch (tagName) {
    case 'SELECT':
      return vModelSelect
    case 'TEXTAREA':
      return vModelText
    default:
      switch (type) {
        case 'checkbox':
          return vModelCheckbox
        case 'radio':
          return vModelRadio
        default:
          return vModelText
      }
  }
}
```

而假如绑定在一个自定义的 Vue 组件上，则行为就是这样的:

```ts
h(SomeComponent, {
  'modelValue': props.modelValue,
  'onUpdate:modelValue': value => emit('update:modelValue', value)
})
```

### v-on / @xx

```ts
h(
  'button',
  {
    onClick(event) {
      /* ... */
    }
  },
  'Click Me'
)
```

[演练场示例](https://play.vuejs.org/#eNp9VMFu2zAM/RXNl6ZAYnfoTlnSdRt66DBsQ7vtEuXg2YyjRpYEUU5TBPn3UZLtuE1RH2KLfCIfycfsk8/GpNsGkmkyw8IK4xiCa8wVV6I22jq2Zw3CbV2DZQe2srpmZ2km/PmMK8a4KrRCxxbCQY1j1pgyd3DrD0s27++OFh689z/0OOEkTBlPvkNuFfvbAE/Gra/UilzOko0Mh2A+ufcHwd9ij8KtWUjwMsAqlxgjcLU854qrVaMKJ7RiTleVDBRHQpWwO4/xB8xHoRg2v+oyh/MioJepT0ClvTsxhnSUi1LOsthN6iMdCGgkBacTY7NGhjd9ScG2k5W2c56M9rG6ceBPdbOWm1AxO0/a+uiZFjJHpFv7Fj10XhdSFBtyntTJkzaxf/ZtQnYguoFNJkUkmAWGs2xAm47onqT/jPWHxjjYuUkJhba57+yUSaFg4tZWN9X6Y9eIcC8ZJ1FQkzo36QNqRZILQXjroAqnXb+9LQzVD3vtnMFpljXKbKq00HWU3/X7i/QivcxKgS5aUglVXjxNAGvK8KnWZSNJWa0KDoGChzmk3L28jSVcQX1o1d1puwfgOpdSP97BqsfQxhCCK9gFTC+tXu7/coR7R71rxRWXBL2FpHOMOAAeYVGJhBvFL3s+kGKIkW5zSfKfd+RHA2u3gzZEpML9y9JS06YtAq5DLFmOMWXsjkM6rET1YjzUcSMk2J/G1/h8TKGOb8HmV7bdQbqzhmLziv0Bd3Govywg2O1x8Umvua3ARffN/Q/S1sDZDfMN5x2glo3nGGFfGlUS7QEusL0NcxWq+o03OwcKu6Ke/+fwhIb89Y3Sj3Qv0w+9xg7/AWfvyMs=)
