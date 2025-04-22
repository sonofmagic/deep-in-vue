import type { User } from '@/types'
import type { ValidateFieldsError } from 'async-validator'
import type { FormInstance } from 'element-plus'
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput } from 'element-plus'
import { cloneDeep } from 'es-toolkit'
import { defineComponent, h, ref, useTemplateRef } from 'vue'

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

      emit,
    },
  ) {
    const formValue = ref(cloneDeep(props.user))

    const formRef = useTemplateRef<FormInstance>('formRef')

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
        onOpen() {
          formValue.value = cloneDeep(props.user)
        },
      }, {
        header: () => {
          const vnode = h('div', {}, [
            formValue.value ? `${formValue.value.name}的个人信息` : '新增',
          ])
          return vnode
        },
        default: () => {
          return [
            h(ElForm, {
              ref: 'formRef',
              labelWidth: '120px',
              model: formValue.value,
            }, [
              h(
                ElFormItem,
                {
                  label: '姓名',
                  prop: 'name',
                  rules: [
                    {
                      required: true,
                      message: '请输入姓名',
                      trigger: 'blur',
                    },
                  ],
                },
                () => h(ElInput, {
                  modelValue: formValue.value.name,
                  onInput: (val: string) => {
                    formValue.value.name = val
                  },
                }),
              ),
              h(
                ElFormItem,
                {
                  label: '用户名',
                  prop: 'username',
                  rules: [
                    {
                      required: true,
                      message: '请输入用户名',
                      trigger: 'blur',
                    },
                  ],
                },
                () => h(ElInput, {
                  modelValue: formValue.value.username,
                  onInput: (val: string) => {
                    formValue.value.username = val
                  },
                }),
              ),
              h(
                ElFormItem,
                {
                  label: '邮箱',
                  prop: 'email',
                  rules: [
                    {
                      required: true,
                      message: '请输入邮箱',
                      trigger: 'blur',
                    },
                    {
                      type: 'email',
                      message: '请输入正确的邮箱地址',
                      trigger: ['blur', 'change'],
                    },
                  ],
                },
                () => h(ElInput, {
                  modelValue: formValue.value.email,
                  onInput: (val: string) => {
                    formValue.value.email = val
                  },
                }),
              ),
            ]),
          ]
        },
        footer: () => {
          return [
            h(ElButton, {
              onClick() {
                emit('update:modelValue', false)
              },
            }, ['取消']),
            h(ElButton, {
              type: 'primary',
              async onClick() {
                try {
                  const valid = await formRef.value?.validate()
                  if (valid) {
                    // 这里可以调用接口保存数据
                    // await saveUser(formValue.value)
                    // doUpsertUser(formValue.value)
                    emit('update:modelValue', false)
                  }
                }
                catch (error) {
                  console.error(error as ValidateFieldsError)
                }
              },
            }, () => '确定'),
          ]
        },
      })
    }
  },
})
