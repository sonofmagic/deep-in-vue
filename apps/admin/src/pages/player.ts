import { defineComponent, h, onMounted, shallowRef } from 'vue'

export default defineComponent({
  name: 'Player',
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
          h('p', 'Player page'),
        ],
      )
    }
  },
})
