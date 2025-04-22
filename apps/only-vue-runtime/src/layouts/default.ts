import { defineComponent, h } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

export default defineComponent({
  name: 'Layout',
  setup() {
    return () => {
      return h('div', [
        h('div', [
          h('div', [
            h(RouterLink, { to: '/' }, () => 'Home'),
            h(RouterLink, { to: '/dashborad' }, () => 'Dashborad'),
            h(RouterLink, { to: '/login' }, () => 'Login'),
          ]),
        ]),
        h(RouterView),
      ])
    }
  },
})
