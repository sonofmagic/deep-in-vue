import { ElMenu, ElMenuItem } from 'element-plus'
import { defineComponent, h } from 'vue'

export const BaseHeader = defineComponent({
  name: 'BaseHeader',
  setup() {
    return () => {
      return h('div', {
        class: 'h-16 border-b border-(--el-menu-border-color)',
      }, [
        'ice-admin',
      ])
    }
  },
})

export const BaseSidebar = defineComponent({
  name: 'BaseSidebar',
  setup() {
    return () => {
      return h('div', {
        class: 'w-64',
      }, [
        h(
          ElMenu,
          {
            router: true,
            class: 'h-full',
          },
          [
            h(ElMenuItem, { index: '/' }, () => 'home'),
            h(ElMenuItem, { index: 'dashborad' }, () => 'dashborad'),
          ],
        ),
      ])
    }
  },
})
