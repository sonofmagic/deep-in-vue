import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'Home',
  setup() {
    return () => {
      return h('div', [
        h('p', 'Home page'),
      ])
    }
  },
})
