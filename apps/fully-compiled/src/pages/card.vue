<script setup lang="ts">
import CardWrapper, { helloWorld, titleRef } from '@/demo/CardWrapper.vue'

function handleCardClick(count: number) {
  console.log(`卡片被点击了 ${count} 次`)
  console.log(helloWorld, titleRef.value)
}
</script>

<template>
  <CardWrapper
    title="系统通知"
    :date="new Date()"
    @card-clicked="handleCardClick"
  >
    <!-- 具名 header 插槽 -->
    <template #header>
      <h2>📝 自定义标题</h2>
    </template>

    <!-- 默认插槽内容 -->
    <p>这里是通知内容的正文部分。</p>

    <!-- 具名作用域插槽 footer -->
    <template #footer="{ date, count }">
      <small>📅 日期: {{ date }} | 🔁 点击次数: {{ count }}</small>
    </template>
  </CardWrapper>
</template>
