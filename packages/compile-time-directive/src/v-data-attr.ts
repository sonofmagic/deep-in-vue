import type { DirectiveTransform, NodeTransform } from '@vue/compiler-core'

export const transformX: DirectiveTransform = (dir, node, context) => {
  return {
    props: [
      {
        type: 'attr',
        name: 'data-attr',
        value: dir.exp,
        key: dir.arg,
        loc: dir.loc,
      },
    ],
  }
}
