import { defineComponent, h } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  name: 'App',
  setup() {
    return () => {
      return h(RouterView)
    }
  },
})
