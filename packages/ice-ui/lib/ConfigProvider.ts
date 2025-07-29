import type { InjectionKey, PropType, Ref } from 'vue'
import { defu } from 'defu'
import { computed, defineComponent, provide, renderSlot } from 'vue'

export interface SizeContext {
  size: Ref<number>
}

export const SIZE_INJECTION_KEY: InjectionKey<SizeContext> = Symbol('size')

export const IceConfigProvider = defineComponent({
  name: 'IceConfigProvider',
  props: {
    size: {
      type: Number as PropType<number>,
      default: 36,
    },
  },
  setup(props, { slots }) {
    const config = computed(() => {
      return defu({
        size: 36,
      }, props)
    })

    provide(SIZE_INJECTION_KEY, {
      size: computed(() => config.value.size),
    })
    return () => {
      return renderSlot(slots, 'default', { config: config.value })
    }
  },
})
