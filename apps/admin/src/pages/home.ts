import { defineComponent, h, shallowRef } from 'vue'

export default defineComponent({
  name: 'Home',
  setup() {
    const divRef = shallowRef()
    return () => {
      return h(
        'div',
        {
          ref: divRef,
        },
        [
          h('p', 'Home page'),
        ],
      )
    }
  },
})
