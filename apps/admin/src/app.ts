import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    return () => {
      return h('div', null, [
        'only vue runtime',
      ])
    }
  },
})
