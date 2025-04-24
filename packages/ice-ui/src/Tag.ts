import { computed, defineComponent, h, inject, ref, unref } from 'vue'
import { SIZE_INJECTION_KEY } from './ConfigProvider'

export function useGlobalSize() {
  const injectedSize = inject(SIZE_INJECTION_KEY, { size: ref(36) })

  return computed<number>(() => {
    return unref(injectedSize.size) || 36
  })
}

export const IceTag = defineComponent({
  name: 'IceTag',
  setup() {
    return () => {
      return h('div')
    }
  },
})
