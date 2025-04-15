import type { FunctionalComponent } from 'vue'
import { ElButton, ElInput, ElTable, ElTableColumn } from 'element-plus'
import { defineComponent, h, onMounted } from 'vue'

const TableControl: FunctionalComponent = () => {
  return h('div', {
    class: 'flex justify-between',
  }, [
    h('div', [
      h(ElInput),
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

export default defineComponent({
  name: 'Table',
  setup() {
    const tableData = [
      {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ]
    onMounted(() => {

    })

    return () => {
      return h(
        'div',
        {

        },
        [
          h(TableControl),
          h('div', [
            h(ElTable, {
              data: tableData,
              style: {
                width: '100%',
              },
            }, [
              h(ElTableColumn, {
                prop: 'date',
                label: 'Date',
                width: '180',
              }),
              h(ElTableColumn, {
                prop: 'name',
                label: 'Name',
                width: '180',
              }),
              h(ElTableColumn, {
                prop: 'address',
                label: 'Address',
              }),
            ]),
          ]),
        ],
      )
    }
  },
})
