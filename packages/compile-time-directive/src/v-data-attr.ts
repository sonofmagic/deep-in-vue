import type { DirectiveTransform } from '@vue/compiler-core'
import { createSimpleExpression, NodeTypes } from '@vue/compiler-core'

export const transformX: DirectiveTransform = (dir, _node, _context) => {
  return {
    props: [
      {
        type: NodeTypes.JS_PROPERTY,
        name: 'data-attr',
        value: dir.exp ?? createSimpleExpression('true', false, dir.loc),
        key: dir.arg ?? createSimpleExpression('data-attr', true, dir.loc),
        loc: dir.loc,
      },
    ],
  }
}
