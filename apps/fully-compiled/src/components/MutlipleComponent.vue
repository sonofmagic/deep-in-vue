<script lang="ts">
import type { FunctionalComponent } from 'vue'
import { defineComponent, h, withDefaults } from 'vue'

export interface Props {
  msg?: string
}

export const Happy: FunctionalComponent<Props> = ({ msg }, { emit, slots }) => {
  return h('div', {
    class: 'border border-red-500',
    onClick: (e: MouseEvent) => {
      emit('click', e)
    },
  }, [msg, slots.default?.()])
}

Happy.inheritAttrs = false
Happy.emits = ['click']
Happy.props = {
  msg: {
    type: String,
    default: '我是 MutlipleComponent 内定义的组件 Happy',
  },
}

export const Sad = defineComponent(
  {
    name: 'Sad',
    props: {
      msg: {
        default: '我是 MutlipleComponent 内定义的组件 Sad',
        type: String,
      },
    },
    emits: ['click'],
    setup(props, { emit, slots }) {
      return () => {
        return h('div', { class: 'border border-blue-500', onClick: (e) => {
          emit('click', e)
        } }, [props.msg, slots.default?.()])
      }
    },
  },
)
</script>

<script setup lang="ts">
withDefaults(
  defineProps<Props>(),
  {
    msg: 'Hello World',
  },
)
defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <div class="border border-green-500" @click="$emit('click', $event)">
    {{ msg }}
    <slot />
  </div>
  <Happy />
  <Sad />
</template>

<style scoped></style>
