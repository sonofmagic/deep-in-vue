import { defineComponent, h, onMounted, shallowRef } from 'vue'

export default defineComponent({
  name: 'Home',
  setup() {
    const divRef = shallowRef()

    onMounted(() => {

    })

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
