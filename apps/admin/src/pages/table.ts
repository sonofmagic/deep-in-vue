import type { PaginationRequest, PaginationResponse, User } from '@/types'
import type { FunctionalComponent, VNode } from 'vue'
import axios from 'axios'
import { ElButton, ElDialog, ElDivider, ElInput, ElLink, ElMessage, ElPagination, ElTable, ElTableColumn, vLoading } from 'element-plus'
import { cloneDeep } from 'es-toolkit'
import { cloneVNode, defineComponent, h, nextTick, onMounted, reactive, ref, render, withDirectives } from 'vue'

enum Role {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
  None = 'none',
}

const BaseUserDialog: FunctionalComponent<{
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

function roleText(role: string): string {
  switch (role) {
    case Role.Admin:
      return '管理员'
    case Role.User:
      return '普通用户'
    case Role.Guest:
      return '游客'
    default:
      return '未知'
  }
}

export default defineComponent({
  name: 'Table',
  setup() {
    const pagination = reactive({
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    })
    const fetchedData = ref<User[]>([])
    const loading = ref(false)
    const baseDialogVisible = ref(false)
    const currentUser = ref<User>()

    async function fetchData(req: Partial<PaginationRequest> = {}) {
      const { page = pagination.page, pageSize = pagination.pageSize, searchParams = {} } = req
      try {
        loading.value = true
        const { data } = await axios.get<PaginationResponse<User>>('/api/table', {
          params: {
            page,
            pageSize,
            ...searchParams,
          },
        })
        fetchedData.value = data.data
        pagination.total = data.total
        pagination.page = data.page
        pagination.pageSize = data.pageSize
        pagination.totalPages = data.totalPages
      }
      finally {
        loading.value = false
      }
    }
    onMounted(async () => {
      await fetchData()
    })

    const TableControl: FunctionalComponent = () => {
      return h('div', {
        class: 'flex justify-between',
      }, [
        h('div', {
          class: 'flex items-center text-sm',
        }, [
          h('div', { class: 'flex items-center' }, [
            h('div', { class: 'mr-2 w-20' }, [
              '名称',
            ]),
            h(ElInput, {
              placeholder: '请输入',
              class: 'w-80',
              clearable: true,
            }),
          ]),

        ]),
        h('div', [
          h(
            ElButton,
            {
              type: 'primary',
            },
            [
              '添加',
            ],
          ),
        ]),
      ])
    }

    function renderActionColumn() {
      return h(ElTableColumn, {
        prop: 'id',
        width: '180',
        label: '操作',
        fixed: 'right',
      }, {
        default: (_scope: { row: User }) => [
          h(ElButton, {
            type: 'primary',
            size: 'small',
            onClick: () => {

            },
          }, () => '编辑'),
          h(ElButton, {
            type: 'danger',
            size: 'small',
          }, () => '删除'),
        ],
      })
    }

    function renderPagination() {
      return h(ElPagination, {
        'total': pagination.total,
        'pageSize': pagination.pageSize,
        'layout': 'total, sizes, prev, pager, next, jumper',
        'pageSizes': [10, 20, 30, 40],
        'currentPage': pagination.page,
        'onUpdate:currentPage': (val: number) => {
          fetchData({ page: val })
        },
        'onUpdate:pageSize': (val: number) => {
          fetchData({ pageSize: val })
        },
      })
    }

    return () => {
      return h(
        'div',
        {

        },
        [
          h(TableControl),
          h(ElDivider),
          withDirectives(
            h('div', [
              h(
                ElTable,
                {
                  data: fetchedData.value,
                  class: 'w-full',
                },
                {
                  default: () => {
                    return [
                      // h(ElTableColumn, {
                      //   prop: 'id',
                      //   type: 'selection',
                      //   width: '30',
                      // }),
                      h(ElTableColumn, {
                        prop: 'name',
                        label: '名称',
                        width: '180',
                      }, {
                        default: ({ row }: { row: User }) => {
                          return h('span', {
                            class: 'text-sky-500 hover:underline cursor-pointer',
                            onClick: () => {
                              currentUser.value = row
                              nextTick(() => {
                                baseDialogVisible.value = true
                              })
                            },
                          }, row.name)
                        },
                      }),
                      h(ElTableColumn, {
                        prop: 'email',
                        label: '邮箱',
                        width: '220',
                      }, {
                        default: ({ row }: { row: User }) => {
                          return h(ElLink, {
                            href: `mailto:${row.email}`,
                            // class: 'text-blue-500 underline',
                            underline: true,
                            type: 'primary',
                          }, () => row.email)
                        },
                      }),
                      h(ElTableColumn, {
                        prop: 'username',
                        label: '用户名',
                      }),
                      // h(ElTableColumn, {
                      //   prop: 'address',
                      //   label: '地址',
                      //   minWidth: '220',
                      // }),
                      h(ElTableColumn, {
                        prop: 'phone',
                        label: '手机号码',
                        minWidth: '120',
                      }),
                      h(ElTableColumn, {
                        prop: 'role',
                        label: '角色',
                      }, {
                        default: ({ row }: { row: User }) => {
                          return h('span', {
                            class: [
                              {
                                'text-red-500': row.role === undefined || row.role === null,
                              },
                            ],
                          }, roleText(row.role ?? Role.None))
                        },
                      }),
                      h(ElTableColumn, {
                        prop: 'isActive',
                        label: '是否激活',
                        width: 80,
                        align: 'center',
                      }, {
                        default: ({ row }: { row: User }) => {
                          return h('span', row.isActive ? '是' : '否')
                        },
                      }),
                      h(ElTableColumn, {
                        prop: 'createdAt',
                        label: '创建时间',
                        width: 120,
                      }),
                      h(ElTableColumn, {
                        prop: 'updatedAt',
                        label: '修改时间',
                        width: 120,
                      }),
                      renderActionColumn(),
                    ]
                  },
                },
              ),
              h('div', {
                class: 'mt-4 flex justify-end',
              }, [
                renderPagination(),
              ]),
            ]),
            // 加 v-loading 的本质
            [[vLoading, loading.value]],
          ),
          h(BaseUserDialog, {
            // v-model
            'modelValue': baseDialogVisible.value,
            'onUpdate:modelValue': (val: boolean) => {
              baseDialogVisible.value = val
            },
            'user': currentUser.value,
          }, {
            header: (
              { vnode, Component }: { vnode: VNode, Component: FunctionalComponent }) => {
              return h(ElButton, {
                type: 'primary',
                onClick: () => {
                  // 声明式调用某个组件，这也是 MessageBox 的实现原理
                  let visible = true
                  const container = document.createElement('div')
                  const v = h(Component, {
                    'modelValue': visible,
                    'onUpdate:modelValue': (val: boolean) => {
                      visible = val
                    },
                    'user': currentUser.value,
                  })
                  render(v, container)
                  document.body.appendChild(container.firstElementChild!)
                },
              }, vnode)
            },
          }),
        ],
      )
    }
  },
})
