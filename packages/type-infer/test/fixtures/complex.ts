import { Props } from './a'

defineProps<Props & {
  h: number
  i?: string
  j: boolean
  k: string[]
  l: {
    m: number
    n: string
  }
}>()

