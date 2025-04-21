<script lang="tsx">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'Icebreaker',
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  emits: ['click', 'update:msg'],
  setup(props, { emit, slots }) {
    const wrap = computed({
      get: () => props.msg,
      set: (val: string) => {
        emit('update:msg', val)
      },
    })

    return () => (
      <div
        class={
          [
            'border border-red-500',
            'ice-wrap',
          ]
        }
        onClick={(e: MouseEvent) => emit('click', e)}
      >
        <input v-model={wrap.value}></input>
        {slots.default?.()}
      </div>
    )
  },
})
</script>

<style scoped>
.ice-wrap {
  display: grid;
  gap: 1rem;
  padding: 4rem;
}
</style>
