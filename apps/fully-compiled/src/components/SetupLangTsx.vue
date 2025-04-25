<script setup lang="tsx">
import { defineComponent, h, ref } from 'vue'
import VNodeRenderer from './VNodeRenderer'

// 创建响应式状态
const count = ref(0)

// 事件处理函数
function increment() {
  count.value++
}

function Counter() {
  return (
    <div>
      <h1>
        Counter:
        {count.value}
      </h1>
      <button onClick={increment}>Increment</button>
    </div>
  )
}

function renderCounter() {
  return <Counter />
}

function renderCounter2() {
  return h(Counter)
}

const nodes = h(Counter)

console.log('nodes', nodes)
// https://eslint.vuejs.org/rules/one-component-per-file.html
const RenderNode5 = defineComponent({
  name: 'RenderNode5',
  setup() {
    return () => {
      return nodes
    }
  },
})

const flag = ref(true)
// https://eslint.vuejs.org/rules/one-component-per-file.html
const RenderNode6 = defineComponent({
  name: 'RenderNode6',
  setup() {
    return () => {
      return flag.value ? nodes : <div class={['bg-gray-200']}>RenderNode6 placeholader</div>
    }
  },
})
</script>

<template>
  <div class="grid p-16 gap-4">
    <h1>Counter Component</h1>
    <div class="border border-red-500">
      Counter
      <Counter />
    </div>
    <div class="border border-red-500">
      renderNode
      <VNodeRenderer :children="renderCounter()" />
    </div>
    <div class="border border-red-500">
      renderNode2
      <VNodeRenderer :children="renderCounter2()" />
    </div>
    <div class="border border-red-500">
      renderNode3
      <VNodeRenderer :children="h(Counter)" />
    </div>
    <div class="border border-red-500">
      renderNode4
      <VNodeRenderer :children="nodes" />
    </div>
    <div class="border border-red-500">
      renderNode5
      <RenderNode5 />
    </div>
    <div class="border border-red-500">
      RenderNode6
      <RenderNode6 />
      <button @click="flag = !flag">
        Toggle
      </button>
    </div>
  </div>
</template>
