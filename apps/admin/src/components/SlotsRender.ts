import { defineComponent } from 'vue'
// getCurrentInstance
export default defineComponent({
  name: 'SlotsRender',
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  setup(_props, { slots }) {
    // const vm = getCurrentInstance()
    return () => {
      console.log('SlotsRender')
      return slots.default?.()
    }
  },
})
