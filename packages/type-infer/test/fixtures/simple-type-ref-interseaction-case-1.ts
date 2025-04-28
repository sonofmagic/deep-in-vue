interface Props1 {
  k: string[]
  l: {
    m: number
    n: string
  }
}

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
} & Props1

defineProps<Props>()