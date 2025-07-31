<script setup lang="ts">
import { computed } from 'vue'

export interface Props {
  label?: string
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'default'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false,
  label: '',
  size: 'md',
  variant: 'default',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const sizes = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
  default: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
}

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center font-medium rounded transition duration-150',
  sizes[props.size],
  variants[props.variant],
  (props.disabled || props.loading) && 'opacity-50 cursor-not-allowed',
])

function handleClick(e: MouseEvent) {
  if (props.disabled || props.loading) {
    return
  }
  emit('click', e)
}
</script>

<template>
  <button
    :class="buttonClasses" :disabled="disabled || loading" role="button" :aria-disabled="disabled || loading"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<style scoped>
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.6);
}
</style>
