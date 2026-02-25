import type { DirectiveTransform } from '@vue/compiler-core'

export const transformX: DirectiveTransform = (dir, _node, _context) => {
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
