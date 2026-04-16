# v-bind 的本质

`v-bind` 是 Vue 模板里最常见的语法之一。

表面上看，它只是“把一个值绑定到属性上”；但如果往底层再走一步，更准确的说法是：

> `v-bind` 的本质，是把模板里的动态属性语法编译成 VNode 的 props 描述，再由运行时 patch 到真实 DOM 或组件实例上。

它不是浏览器原生理解的模板能力，而是 Vue 在编译阶段帮你完成的语法展开。

## 先看最基础的写法

```html
<img v-bind:src="imageUrl" alt="Image" />
```

缩写写法：

```html
<img :src="imageUrl" alt="Image" />
```

这里的核心含义很简单：

- `alt="Image"` 是静态属性
- `:src="imageUrl"` 是动态属性

Vue 需要在编译时把两者区分开，才能在运行时做正确更新。

## 编译后的本质

假设有下面的模板：

```html
<img :src="imageUrl" alt="Image" />
```

编译后的渲染函数大致会变成：

```js
function render() {
  return h('img', {
    src: this.imageUrl,
    alt: 'Image',
  })
}
```

这里最关键的一点是：

- `v-bind:src="imageUrl"` 不会在运行时继续以“指令字符串”存在
- 它已经在编译阶段被展开成了普通的 prop 描述

所以 `v-bind` 更接近“编译展开 + 运行时 patch”，而不是“纯运行时指令”。

## 为什么它和响应式系统有关

`v-bind` 本身不负责“让数据变响应式”，响应式系统本来就存在。

它做的事情是：

1. 在渲染函数中读取响应式数据
2. 把读取结果放进 VNode props
3. 当这些响应式数据变化时，组件重新渲染
4. 运行时比较新旧 props，再更新真实 DOM 或组件

所以你可以把它理解为：

- 响应式系统负责“发现值变了”
- `v-bind` 负责“把这个值接到视图属性上”

## style / class 为什么很常见

下面这种写法你会经常看到：

```html
<button :style="buttonStyle">Click me</button>
```

如果 `buttonStyle` 是响应式对象：

```js
data() {
  return {
    buttonStyle: {
      color: 'red',
      fontSize: '20px',
    },
  }
}
```

编译后本质上仍然只是：

```js
function render() {
  return h('button', {
    style: this.buttonStyle,
  }, 'Click me!')
}
```

也就是说，`v-bind:style`、`v-bind:class` 并没有神秘机制，它们依旧是在生成 VNode props，只是这些 props 在运行时会有专门的 patch 策略。

## 单个属性和对象展开

### 绑定单个属性

```html
<img :src="imageUrl" />
```

这就是最直接的“动态 prop”。

### 绑定多个属性

```html
<button v-bind="buttonProps">Click me</button>
```

如果 `buttonProps` 是：

```js
{
  class: 'btn',
  disabled: true,
}
```

那么它本质上相当于把对象里的多个键值对一起合并进 props。

所以这类写法的重点不是“多了一个新能力”，而是 Vue 帮你做了一次 props 对象展开。

## 动态参数

`v-bind` 还支持动态参数：

```html
<button v-bind:[dynamicProp]="value">Click me</button>
```

这意味着属性名本身也是运行期计算出来的。

从本质上说，它仍然是在生成 props，只不过这次连 prop key 都不是静态写死的了。

所以它比普通 `:src="imageUrl"` 更动态，也意味着编译器可做的静态分析会更少一些。

## 同名简写（Vue 3.4+）

Vue 3.4 起支持：

```html
<img :src :alt :id />
```

等价于：

```html
<img :src="src" :alt="alt" :id="id" />
```

这只是模板层的进一步缩写，底层本质没有变化，编译后仍然会变成普通 prop 绑定。

## 它为什么不是“运行时指令”

如果你已经读过 `v-on`、`v-model` 或“编译时指令 vs 运行时指令”那篇，就能更清楚地对比：

- `v-bind` 通常不会生成 `withDirectives(...)`
- 它更常见的结果是普通 prop 对象
- 运行时主要做的事情是 patch props

所以 `v-bind` 的位置非常清楚：

> 模板语法糖在编译期展开，运行时按普通属性更新机制执行。

## 一句话理解

`v-bind` 不是在 DOM 上“挂了一个指令再解释”，而是 Vue 先把模板里的动态属性写法翻译成 VNode props，然后再让运行时去更新真实目标。

## 总结

| 特性 | 说明 |
| --- | --- |
| 编译本质 | `v-bind` 被展开为 VNode props |
| 主要机制 | 编译展开 + 运行时 patch |
| 常见目标 | DOM 属性、DOM prop、组件 prop、`class`、`style` |
| 对象语法 | 本质是一次 props 对象展开 |
| 动态参数 | prop key 也可在运行时决定 |
