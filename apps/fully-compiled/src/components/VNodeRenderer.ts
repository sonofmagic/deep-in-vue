import type { FunctionalComponent, VNodeChild } from 'vue'

const VNodeRenderer: FunctionalComponent<{
  children: VNodeChild
}> = (props: { children: VNodeChild }) => {
  return props.children
}

export default VNodeRenderer
