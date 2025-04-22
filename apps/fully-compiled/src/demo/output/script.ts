import { defineComponent as _defineComponent } from 'vue'

import { computed, defineEmits, defineProps, ref } from 'vue'

export const helloWorld = 'Hello World!'

export const titleRef = ref(0)

function addCountClick() {
  titleRef.value = titleRef.value + 1
}

export default /*@__PURE__*/_defineComponent({
  __name: 'CardWrapper',
  props: {
    title: { type: String, required: true },
    date: { type: Date, required: false }
  },
  emits: ["card-clicked"],
  setup(__props: any, { expose: __expose, emit: __emit }) {
  __expose();

// Props
const props = __props

// Emits
const emit = __emit

console.log(helloWorld)

// 内部响应式状态
const clickCount = ref(0)

// 计算属性
const formattedDate = computed(() => {
  const d = props.date || new Date()
  return d.toLocaleDateString()
})

// 方法
function handleClick() {
  clickCount.value++
  emit('card-clicked', clickCount.value)
}

const __returned__ = { helloWorld, titleRef, addCountClick, props, emit, clickCount, formattedDate, handleClick }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

})