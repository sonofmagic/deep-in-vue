type Props = {
  a: number
  b?: string
  c: boolean
  d: string[]
  e: {
    f: number
    g: string
  }
}

type Props2 = Props & {
  h: number
}

defineProps<Props2>()