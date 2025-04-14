import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'Login',
  setup() {
    return () => {
      return h('div', [
        h('p', 'login page'),
      ])
    }
  },
})
