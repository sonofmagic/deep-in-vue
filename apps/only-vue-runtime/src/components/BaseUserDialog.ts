import type { User } from '@/types'
import type { FunctionalComponent } from 'vue'
import { ElDialog, ElMessage } from 'element-plus'
import { cloneDeep } from 'es-toolkit'
import { cloneVNode, h } from 'vue'

export const BaseUserDialog: FunctionalComponent<{
  'modelValue': boolean
  'user'?: User
  'onUpdate:modelValue'?: (val: boolean) => void
  'zIndex'?: number
}> = (
  props,
  {
    slots,
    // eslint-disable-next-line ts/no-unused-vars
    emit,
  },
) => {
  // 切断引用
  const clonedUser = cloneDeep(props.user)

  return h(ElDialog, {
    'modelValue': props.modelValue,
    'onUpdate:modelValue': (val: boolean) => {
      props?.['onUpdate:modelValue']?.(val)
      // 思考上面这行和下面这一行的区别，为什么他们的行为是一致的, 为什么 react 都放 props 里？ vue 到底创造了多少额外的概念?
      // emit('update:modelValue', val)
    },
    'draggable': true,
    'zIndex': props.zIndex,
    'closeOnClickModal': false,
    'closeOnPressEscape': false,
    'destroyOnClose': true,
  }, {
    header: () => {
      const vnode = h('div', {}, [`${clonedUser?.name}的个人信息`, '(这是正常的插槽透传)'])
      return slots.header ? slots.header?.({ vnode, Component: BaseUserDialog }) : vnode
    },
    default: () => {
      return [
        h('div', ['dialog body']),
        h('div', {
          class: 'border border-gray-300 rounded-lg p-4',
        }, [
          // 在 default 中渲染全部插槽
          slots.header?.({ Component: BaseUserDialog, vnode: '从 dialog body 中渲染 header 插槽' }),
          slots.default?.({ Component: BaseUserDialog }),
          slots.footer?.({ Component: BaseUserDialog }),
        ]),

      ]
    },
    footer: () => {
      return [
        // 在 footer 中渲染 header 插槽的同时，对插槽的渲染结果，进行修改
        slots.header?.(
          { Component: BaseUserDialog, vnode: '从 dialog footer 中渲染 header 插槽' },
        )?.map((x) => {
          return cloneVNode(x, {
            type: 'info',
            // 对于事件则走 merge props 流程
            onClick: () => {
              ElMessage('hello world')
            },
          })
        }),
        h('div', ['footer']),
      ]
    },
  })
}
