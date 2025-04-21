<!-- CardWrapper.vue -->
<script lang="ts">
import { computed, defineEmits, defineProps, ref } from 'vue'

export const helloWorld = 'Hello World!'

export const titleRef = ref(0)

function addCountClick() {
  titleRef.value = titleRef.value + 1
}
</script>

<script setup lang="ts">
// Props
const props = defineProps<{
  title: string
  date?: Date
}>()

// Emits
const emit = defineEmits<{
  (e: 'card-clicked', count: number): void
}>()

console.log(helloWorld)

// 内部响应式状态
const clickCount = ref(0)

// 计算属性
const formattedDate = computed(() => {
  const d = props.date || new Date()
  return d.toLocaleDateString()
})

// 方法
function handleClick() {
  clickCount.value++
  emit('card-clicked', clickCount.value)
}
</script>

<template>
  <div class="card" @click="handleClick">
    <!-- 具名插槽 header -->
    <header class="card-header">
      <slot name="header">
        <h3>{{ title }}</h3>
      </slot>
    </header>

    <!-- 默认插槽 content -->
    <section class="card-body" @click.stop="addCountClick">
      <slot>
        <p>默认内容区域（没有传默认插槽就展示我）</p>
      </slot>
    </section>

    <!-- 作用域插槽 footer，向插槽提供数据 -->
    <footer class="card-footer">
      <slot name="footer" :date="formattedDate" :count="clickCount">
        <small>默认 footer：{{ formattedDate }}</small>
      </slot>
    </footer>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.card-header {
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.card-body {
  margin-bottom: 0.5rem;
}
.card-footer {
  font-size: 0.875rem;
  color: #666;
}
</style>
