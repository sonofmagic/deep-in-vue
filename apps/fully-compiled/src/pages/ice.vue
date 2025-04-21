<script setup lang="ts">
import Icebreaker from '@/components/Icebreaker.vue'
import { ref } from 'vue'

const msg = ref('Hello World')
</script>

<template>
  <div class="grid justify-center items-center text-5xl py-16">
    <Icebreaker v-model:msg="msg">
      <div class="border border-yellow-500">
        <input v-model="msg">
      </div>
    </Icebreaker>
  </div>
</template>

<style scoped>

</style>
