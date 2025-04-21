<script lang="ts">
import type { FunctionalComponent } from 'vue'
import { defineComponent, h, withDefaults } from 'vue'

export interface Props {
  msg?: string
}

export const Happy: FunctionalComponent<Props> = ({ msg = 'Happy' }, { emit, slots }) => {
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
    default: 'Happy',
  },
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
</template>

<style scoped></style>
