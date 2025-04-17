<script lang="ts">
import { defineComponent, h } from 'vue'

export function Happy() {
  return h('div', 'Happy')
}

export const Sad = defineComponent(
  {
    name: 'Sad',
    props: {
      msg: {
        default: 'Sad',
        type: String,
      },
    },
    setup(props) {
      return () => {
        return h('div', props.msg)
      }
    },
  },
)
</script>

<script setup lang="ts">

</script>

<template>
  <div>HelloWorld</div>
</template>

<style scoped></style>
