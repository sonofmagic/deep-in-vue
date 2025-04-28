import type { AttributeNode } from '@vue/compiler-core'
import { createStructuralDirectiveTransform, NodeTypes } from '@vue/compiler-core'

export const transformRepeat = createStructuralDirectiveTransform(
  'file', // 指令名：v-file
  (node, directive, context) => {
    console.log(node, directive, context)

    // const dataFileAttr: AttributeNode = {
    //   type: NodeTypes.ATTRIBUTE,
    //   name: 'data-file',
    //   value: {
    //     type: NodeTypes.TEXT,
    //     content: context.filename,
    //     loc: node.loc,
    //   },
    //   loc: node.loc,
    //   nameLoc: node.loc,
    // }
    // node.props.push(dataFileAttr)
  },
)
