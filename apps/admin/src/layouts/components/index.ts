import { adminRoutes } from '@/router'
import { ElCheckbox, ElMenu, ElMenuItem, ElRadioButton, ElRadioGroup } from 'element-plus'
import { computed, defineComponent, h, reactive, vShow, withDirectives } from 'vue'

// 最简易的外置状态
export const sharedState = reactive({
  isCollapse: false,
  isShown: false,
})

export const BaseHeader = defineComponent({
  name: 'BaseHeader',
  setup() {
    return () => {
      return h('div', {
        class: 'h-16 border-b border-(--el-menu-border-color) flex items-center justify-between px-4',
      }, [
        h('div', [
          'ice-admin',

        ]),
        h('div', {
          class: 'flex items-center space-x-5',
        }, [
          h('div', [
            h(ElCheckbox, {
              'modelValue': sharedState.isShown,
              'onUpdate:modelValue': val => sharedState.isShown = val as boolean,
            }, [
              'isShown',
            ]),
          ]),

          h('div', { class: 'shrink-0' }, [
            h(
              ElRadioGroup,
              { 'modelValue': sharedState.isCollapse, 'onUpdate:modelValue': val => sharedState.isCollapse = val as boolean },
              [
                h(ElRadioButton, { value: true }, () => 'expand'),
                h(ElRadioButton, { value: false }, () => 'collapse'),
              ],
            ),
          ]),

        ]),
      ])
    }
  },
})

export const BaseSidebar = defineComponent({
  name: 'BaseSidebar',
  setup() {
    const menus = computed(() => {
      return adminRoutes.filter((x) => {
        return x.meta?.hidden !== true
      }).map((x) => {
        return {
          index: x.path === '' ? '/' : x.path,
          label: x.meta?.label,
        }
      })
    })

    return () => {
      // 写在这里和写在上面的 computed 有什么区别?
      // const menus = adminRoutes.filter((x) => {
      //   return x.meta?.hidden !== true
      // }).map((x) => {
      //   return {
      //     index: x.path === '' ? '/' : x.path,
      //     label: x.meta?.label,
      //   }
      // })

      return h('div', {

      }, [
        h(
          ElMenu,
          {
            router: true,
            class: 'h-full w-64',
            collapse: sharedState.isCollapse,
          },
          () => {
            return [
              menus.value.map((x) => {
                return h(ElMenuItem, { index: x.index }, () => x.label)
              }),
              withDirectives(
                h(ElMenuItem, [
                  '隐藏菜单',
                ]),
                [
                  [vShow, sharedState.isShown],
                ],
              ),
            ]
          },

        ),
      ])
    }
  },
})
