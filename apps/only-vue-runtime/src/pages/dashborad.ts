import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'Dashborad',
  setup() {
    return () => {
      return h('div', [
        h('p', 'dashborad page'),
      ])
    }
  },
})
