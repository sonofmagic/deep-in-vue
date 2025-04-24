import type { PaginationRequest, PaginationResponse, User } from '@/types'
import type { FunctionalComponent, VNode } from 'vue'
import { BaseUserDialog } from '@/components/BaseUserDialog'
import { UpsertUserDialog } from '@/components/UpsertUserDialog'
import { Role, roleTextFilter } from '@/types'
import { formatDate } from '@/utils'
import axios from 'axios'
import { ElButton, ElDivider, ElInput, ElLink, ElMessageBox, ElPagination, ElProgress, ElSelect, ElTable, ElTableColumn, ElTooltip, vLoading } from 'element-plus'
import { defineComponent, h, nextTick, onMounted, reactive, ref, render, withDirectives } from 'vue'

export default defineComponent({
  name: 'Table',
  setup() {
    const pagination = reactive({
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    })

    const searchParams = reactive({
      name: '',
      role: '',
    })

    const orderBy = ref<{
      order?: 'ascending' | 'descending' | (string & {})
      prop?: string
    }>({})

    const fetchedData = ref<User[]>([])
    const loading = ref(false)
    const baseDialogVisible = ref(false)
    const currentUser = ref<User>()
    const upsertUserDialogVisible = ref(false)

    async function fetchData(req: Partial<PaginationRequest> = {}) {
      const { page = pagination.page, pageSize = pagination.pageSize } = req
      try {
        loading.value = true
        const { data } = await axios.get<PaginationResponse<User>>('/api/user', {
          params: {
            page,
            pageSize,
            searchParams,
            orderBy: orderBy.value,
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

    async function upsertUser(user: User) {
      try {
        loading.value = true
        await axios.post('/api/user', user)
        await fetchData()
      }
      finally {
        loading.value = false
      }
    }

    async function deleteUser(user: User) {
      try {
        loading.value = true
        await axios.delete(`/api/user`, {
          params: {
            id: user.id,
          },
        })
        await fetchData()
      }
      finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      await fetchData()
    })

    const TableControl: FunctionalComponent = () => {
      function renderSearchField(label: string, vnode: VNode) {
        return h('div', { class: 'flex items-center' }, [
          h('div', { class: 'mr-4 w-16 text-right' }, [
            label,
          ]),
          vnode,
        ])
      }

      return h('div', {
        class: 'flex justify-between',
      }, [
        h('div', {
          class: 'flex items-center text-sm',
        }, [
          h('div', { class: 'flex items-center space-x-4' }, [
            renderSearchField('名称', h(ElInput, {
              placeholder: '请输入',
              class: 'w-80',
              clearable: true,
              modelValue: searchParams.name,
              onInput: (val: string) => {
                searchParams.name = val
              },
            })),
            renderSearchField('角色', h('div', {
              class: 'w-45',
            }, [
              h(ElSelect, {
                'modelValue': searchParams.role!,
                'onUpdate:modelValue': (val) => {
                  searchParams.role = val
                },
                'placeholder': '请选择角色',
                'clearable': true,
              }, [
                h(ElSelect.Option, {
                  value: 'admin',
                  label: '管理员',
                }),
                h(ElSelect.Option, {
                  value: 'user',
                  label: '普通用户',
                }),
                h(ElSelect.Option, {
                  value: 'guest',
                  label: '游客',
                }),
                h(ElSelect.Option, {
                  value: 'none',
                  label: '未知',
                }),
              ]),
            ])),
          ]),

        ]),

        h('div', [
          h(ElButton, {
            type: 'primary',
            onClick: () => {
              fetchData()
            },
          }, [
            '搜索',
          ]),
          h(
            ElButton,
            {
              type: 'primary',
              onClick: () => {
                currentUser.value = undefined
                upsertUserDialogVisible.value = true
              },
            },
            [
              '添加',
            ],
          ),
        ]),
      ])
    }
    const percentage = ref(0)

    function renderActionColumn() {
      return h(ElTableColumn, {
        prop: 'id',
        width: '180',
        label: '操作',
        fixed: 'right',
      }, {
        default: ({ row }: { row: User }) => [
          h(ElButton, {
            type: 'primary',
            size: 'small',
            onClick: () => {
              currentUser.value = row
              upsertUserDialogVisible.value = true
            },
          }, () => '编辑'),
          h(ElButton, {
            type: 'danger',
            size: 'small',
            onClick: async () => {
              percentage.value = 0

              const ptr = window.setInterval(() => {
                if (percentage.value >= 100) {
                  clearInterval(ptr)
                  deleteUser(row)
                  return
                }
                percentage.value += 1
              }, 30)

              const res = await ElMessageBox({
                message: () => {
                  return h('div', {
                    class: 'flex justify-center items-center w-full',
                  }, [
                    h(ElProgress, {
                      type: 'circle',
                      status: 'success',
                      percentage: percentage.value,

                    }, {
                      default: ({ percentage }: { percentage: number }) => {
                        return percentage < 100 ? '正在删除 ' : '删除完成'
                      },
                    }),
                  ])
                },
                center: true,
                showConfirmButton: true,
              })
              console.log(res)
            },
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
                  'data': fetchedData.value,
                  'class': 'w-full',
                  'onSort-change': function ({ order, prop }) {
                    Object.assign(orderBy.value, {
                      order,
                      prop,
                    })
                    fetchData()
                  },
                  'defaultSort': {
                    prop: 'id',
                    order: 'descending',
                  },
                },
                {
                  default: () => {
                    return [
                      h(ElTableColumn, {
                        prop: 'id',
                        width: '70',
                        label: 'ID',
                        sortable: 'custom',
                      }),
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
                          }, roleTextFilter(row.role ?? Role.None))
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
                        width: 180,
                        sortable: 'custom',
                      }, {
                        default: ({ row }: { row: User }) => {
                          return h(ElTooltip, {
                            placement: 'top',
                            effect: 'dark',
                          }, {
                            default: () => h('span', {
                              class: 'text-gray-500',
                            }, formatDate(row.createdAt)),
                            content: () => row.createdAt,
                          })
                        },
                      }),
                      h(ElTableColumn, {
                        prop: 'updatedAt',
                        label: '修改时间',
                        width: 180,
                        sortable: 'custom',
                      }, {
                        default: ({ row }: { row: User }) => {
                          return h(ElTooltip, {
                            placement: 'top',
                            effect: 'dark',
                          }, {
                            default: () => h('span', {
                              class: 'text-gray-500',
                            }, formatDate(row.updatedAt)),
                            content: () => row.updatedAt,
                          })
                        },
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
            // BaseUserDialog 的 header 的作用域插槽
            header: (
              // 传入 vnode 和 Component 组件
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
          h(UpsertUserDialog, {
            'modelValue': upsertUserDialogVisible.value,
            'onUpdate:modelValue': (val: boolean) => {
              upsertUserDialogVisible.value = val
            },
            'user': currentUser.value,
            'onSave': (user: User) => {
              return upsertUser(user)
            },
          }),
        ],
      )
    }
  },
})
