import type { NodePath, Scope, TraverseOptions, Visitor } from '@babel/traverse'
import _babelTraverse from '@babel/traverse'
import * as t from '@babel/types'

export { parse, parseExpression } from '@babel/parser'

function _interopDefaultCompat(e: any) {
  return e && typeof e === 'object' && 'default' in e ? e.default : e
}

type Traverse = (
  parent: t.Node,
  opts: TraverseOptions & Visitor,
  scope?: Scope | null,
  state?: unknown,
  parentPath?: NodePath,
) => void

// Babel 8's generic overload picks `never` for catch-all enter/exit visitors.
export const traverse = _interopDefaultCompat(_babelTraverse) as Traverse

export {
  t,
}
