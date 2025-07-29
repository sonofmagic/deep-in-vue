import { computed, defineComponent, h, inject, ref, renderSlot, unref } from 'vue'
import { SIZE_INJECTION_KEY } from './ConfigProvider'

export function useGlobalSize() {
  const injectedSize = inject(SIZE_INJECTION_KEY, { size: ref(36) })

  return computed<number>(() => {
    return unref(injectedSize.size) || 36
  })
}

export const IceTag = defineComponent({
  name: 'IceTag',
  setup(_props, { slots }) {
    return () => {
      return h('div', renderSlot(slots, 'default'))
    }
  },
})
