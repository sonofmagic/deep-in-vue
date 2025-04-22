import { ElConfigProvider } from 'element-plus'
import { defineComponent, h } from 'vue'
import { RouterView } from 'vue-router'
import { BaseHeader, BaseSidebar } from './components'

export default defineComponent({
  name: 'AdminLayout',
  setup() {
    return () => {
      return h('div', [
        h(ElConfigProvider, [
          h(BaseHeader),
          h('div', { class: 'flex h-(--main-container-height)' }, [
            h(BaseSidebar),
            h('div', { class: 'w-full p-4' }, [
              h(RouterView),
            ]),
          ]),
        ]),
      ])
    }
  },
})
