import { ElButton } from 'element-plus'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    return () => {
      return h(ElButton, null, [
        'only vue runtime',
      ])
    }
  },
})
