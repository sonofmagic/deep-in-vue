interface Props {
  a: number
  b?: string
  c: boolean
  d: string[]
  e: {
    f: number
    g: string
  }
}

defineProps<Props>()

