import type { TemplateChildNode } from '@vue/compiler-core'
import {
  CREATE_COMMENT,
  createCallExpression,
  createCompoundExpression,
  createConditionalExpression,
  createSequenceExpression,
  createSimpleExpression,
  createStructuralDirectiveTransform,
  createVNodeCall,
  FRAGMENT,
  traverseNode,
} from '@vue/compiler-core'

const indexMap = new WeakMap()

const PATCH_FLAGS = {
  STABLE_FRAGMENT: 64,
} as const

const DIRECTIVE_NODES = {
  SHOW: 'show',
} as const

export const transformLazyShow = createStructuralDirectiveTransform(
  /^(lazy-show|show)$/,
  (node, dir, context) => {
    if (dir.name === DIRECTIVE_NODES.SHOW && !dir.modifiers.some(i => i.content === 'lazy')) {
      return () => {
        node.props.push(dir)
      }
    }

    const directiveName = dir.name === DIRECTIVE_NODES.SHOW
      ? 'v-show.lazy'
      : 'v-lazy-show'

    if (node.tag === 'template') {
      throw new Error(`${directiveName} can not be used on <template>`)
    }

    const conditionExp = dir.exp!

    node.props
      .forEach((prop) => {
        if (prop.name === 'on') {
          return
        }
        if ('exp' in prop && prop.exp && 'content' in prop.exp && prop.exp.loc.source) {
          prop.exp = createSimpleExpression(prop.exp.loc.source)
        }
      })

    if (conditionExp.loc.source) {
      dir.exp = createSimpleExpression(conditionExp.loc.source)
    }

    if (context.ssr || context.inSSR) {
      const ssrTransformIf = context.nodeTransforms[0]

      node.props
        .push({
          ...dir,
          modifiers: dir.modifiers.filter(modifier => modifier.content !== 'lazy'),
          name: 'if',
        })

      ssrTransformIf(node, context)
      return
    }

    const { helper } = context
    const keyIndex = (indexMap.get(context.root) ?? 0) + 1
    indexMap.set(context.root, keyIndex)

    const key = `_lazyshow${keyIndex}`

    const wrapNode = createConditionalExpression(
      createCompoundExpression([`_cache.${key}`, ' || ', conditionExp]),
      createSequenceExpression([
        createCompoundExpression([`_cache.${key} = true`]),
        createVNodeCall(
          context,
          helper(FRAGMENT),
          undefined,
          [node],
          PATCH_FLAGS.STABLE_FRAGMENT,
          undefined,
          undefined,
          true,
          false,
          false /* isComponent */,
          node.loc,
        ),
      ]),
      createCallExpression(helper(CREATE_COMMENT), [
        '"v-show-if"',
        'true',
      ]),
    )

    node.props.push({
      ...dir,
      modifiers: dir.modifiers.filter(modifier => modifier.content !== 'lazy'),
      name: DIRECTIVE_NODES.SHOW,
    })

    const _context = Object.assign({}, context)
    context.replaceNode(<TemplateChildNode><unknown>wrapNode)

    return () => {
      if (!node.codegenNode) {
        traverseNode(node, _context)
      }
    }
  },
)
