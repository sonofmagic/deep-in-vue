type Props = {
  a: number
  b?: string
  c: boolean
  d: string[]
  e: {
    f: number
    g: string
  }
} & {
  h: number
  i?: string
  j: boolean
  k: string[]
  l: {
    m: number
    n: string
  }
}

defineProps<Props>()