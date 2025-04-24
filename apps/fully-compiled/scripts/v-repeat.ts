import { createForLoopParams, createStructuralDirectiveTransform } from '@vue/compiler-core'

const transformRepeat = createStructuralDirectiveTransform(
  'repeat', // 指令名：v-repeat
  (node, directive, _context) => {
    let exp = directive.exp

    if (!exp) {
      // 没有参数，默认重复 1 次
      exp = {
        type: 4, // NodeTypes.SIMPLE_EXPRESSION
        content: '1',
        isStatic: true,
        constType: 3, // ConstantTypes.CAN_STRINGIFY
        loc: directive.loc,
      }
    }

    // 直接转换成 v-for 的结构
    node.for = {
      type: 11, // NodeTypes.FOR
      source: exp, // 对应 v-for="i in 3" 的 3
      valueAlias: createForLoopParams(['i']), // 默认循环变量 i
      keyAlias: undefined,
      objectIndexAlias: undefined,
      children: node.children,
      loc: node.loc,
    }
  },
)

export default transformRepeat
