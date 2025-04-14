import { defineComponent, h, onMounted } from 'vue'

export default defineComponent({
  name: 'Table',
  setup() {
    onMounted(() => {

    })

    return () => {
      return h(
        'div',
        {

        },
        [
          h('div', {
            class: 'max-xl:text-yellow-500 text-blue-500 sm:max-md:text-red-500',
          }, [
            'dasjdaskldjaslk',
          ]),
          h('div'),
        ],
      )
    }
  },
})
