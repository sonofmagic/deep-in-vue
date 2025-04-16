import type { User } from '@/types'
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput } from 'element-plus'
import { cloneDeep } from 'es-toolkit'
import { defineComponent, h, reactive } from 'vue'

export const UpsertUserDialog = defineComponent({
  name: 'UpsertUserDialog',
  props: {
    'modelValue': {
      type: Boolean,
      required: true,
    },
    'user': {
      type: Object as () => User,
      default: () => ({
        id: 0,
        name: '',
        email: '',
        username: '',
        password: '',
        createdAt: '',
        updatedAt: '',
        avatarUrl: '',
        phone: '',
        address: '',
        isActive: false,
        role: '',
      }),
    },
    'onUpdate:modelValue': {
      type: Function,
      required: false,
    },
  },
  emits: ['update:modelValue'],
  setup(
    props,
    {
      // eslint-disable-next-line ts/no-unused-vars
      emit,
    },
  ) {
    const formValue = reactive(cloneDeep(props.user))
    // console.log(props)
    return () => {
      return h(ElDialog, {
        'modelValue': props.modelValue,
        'onUpdate:modelValue': (val: boolean) => {
          props?.['onUpdate:modelValue']?.(val)
          // 思考上面这行和下面这一行的区别，为什么他们的行为是一致的, 为什么 react 都放 props 里？ vue 到底创造了多少额外的概念?
          // emit('update:modelValue', val)
        },
        'closeOnClickModal': false,
        'closeOnPressEscape': false,
        'destroyOnClose': true,
      }, {
        header: () => {
          const vnode = h('div', {}, [`${formValue?.name}的个人信息`])
          return vnode
        },
        default: () => {
          return [
            h(ElForm, {}, [
              h(ElFormItem, { label: '用户名' }, () => h(ElInput, {
                modelValue: formValue?.username,
                onInput: (val: string) => {
                  formValue.username = val
                },
              })),
              h(ElFormItem, { label: '邮箱' }, () => h(ElInput, {
                modelValue: formValue?.email,
                onInput: (val: string) => {
                  formValue.email = val
                },
              })),
            ]),
          ]
        },
        footer: () => {
          return [
            h(ElButton, ['取消']),
            h(ElButton, {
              type: 'primary',
            }, () => '确定'),
          ]
        },
      })
    }
  },
})
