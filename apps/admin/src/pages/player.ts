import Player from '@vimeo/player'
import { ElButton, ElInputNumber, ElTag, vLoading } from 'element-plus'
import { defineComponent, h, onMounted, ref, useTemplateRef, withDirectives } from 'vue'

export default defineComponent({
  name: 'Player',
  setup() {
    const divRef = useTemplateRef<HTMLElement>('player')
    let player: Player
    const vimeoOpenIds = ref([
      19231868,
      1015908690,
      1074471464,
      1013021528,
      1068406166,
    ])
    const videoId = ref<number | undefined>(vimeoOpenIds.value[0])
    const loading = ref(false)

    onMounted(() => {
      if (divRef.value) {
        player = new Player(divRef.value, {
          id: videoId.value,
          height: 720,
        })

        player.on('loaded', () => {
          // 双保险
          loading.value = false
        })
      }
    })

    async function loadVideo(id: number) {
      try {
        loading.value = true
        await player.loadVideo(id)
      }
      finally {
        loading.value = false
      }
    }

    return () => {
      return h('div', { class: 'space-y-4 flex flex-col items-center' }, [
        withDirectives(h(
          'div',
          {
            ref: 'player',
            class: 'self-center',
          },
        ), [
          [vLoading, loading.value],
        ]),
        h('div', {
          class: 'flex items-center space-x-3',
        }, [
          h('div', { class: 'text-sm' }, ['播放视频id']),
          vimeoOpenIds.value.map((id) => {
            return h(ElTag, {
              key: id,
              class: 'cursor-pointer',
              type: videoId.value === id ? 'primary' : 'info',
              onClick: () => {
                videoId.value = id
                loadVideo(videoId.value!)
              },
            }, [id])
          }),
          h(ElInputNumber, {
            'size': 'small',
            'modelValue': videoId.value,
            'onUpdate:modelValue': (id: number | undefined) => {
              videoId.value = id
            },
            'controls': false,
          }),
          h(ElButton, {
            size: 'small',
            onClick: () => {
              loadVideo(videoId.value!)
            },
            type: 'primary',
          }, ['加载']),
        ]),
      ])
    }
  },
})
