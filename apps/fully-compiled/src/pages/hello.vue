<script setup lang="ts">
import { ref } from 'vue'

const msg = ref('hello')
</script>

<template>
  <div>
    {{ msg }}
    <input v-model="msg">
  </div>
</template>

<style scoped>
.hello-msg {
  color: red;
}
</style>
