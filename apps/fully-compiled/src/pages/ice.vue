<script setup lang="ts">
import { ref } from 'vue'
import LangTsx from '@/components/LangTsx.vue'

const msg = ref('Hello World')
</script>

<template>
  <div class="grid justify-center items-center text-5xl py-16">
    <LangTsx v-model:msg="msg">
      <div class="border border-yellow-500">
        <input v-model="msg">
      </div>
    </LangTsx>
  </div>
</template>
