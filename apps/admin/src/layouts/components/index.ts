import { ElCheckbox, ElMenu, ElMenuItem, ElRadioButton, ElRadioGroup } from 'element-plus'
import { defineComponent, h, reactive, vShow, withDirectives } from 'vue'

const sharedState = reactive({
  isCollapse: true,
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
    return () => {
      const menus = [
        {
          label: 'home',
          index: '/',
        },
        {
          label: 'dashborad',
          index: 'dashborad',
        },
      ]

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
              menus.map((x) => {
                return h(ElMenuItem, { index: x.index }, () => x.label)
              }),
              withDirectives(
                h(ElMenuItem, [
                  'isShown',
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
