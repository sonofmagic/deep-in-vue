import type { NodePath } from '@babel/traverse'
import type * as t from '@babel/types'
import fs from 'fs-extra'
// import path from 'pathe'
import { parse, traverse } from './babel'

export type RuntimeProps = Record<string, { type: string, required: boolean }>

export async function extractTypes(id: string): Promise<RuntimeProps> {
  const code = await fs.readFile(id, 'utf8')
  const ast = parse(code, {
    plugins: ['typescript'],
    sourceType: 'module',
  })

  const result: RuntimeProps = {}
  const typeMap = new Map<string, NodePath>()

  function resolveTSTypeReference(path: NodePath<t.TSTypeReference>) {
    const typeNameNode = path.node.typeName
    if (typeNameNode.type === 'Identifier') {
      const name = typeNameNode.name
      return typeMap.get(name)
    }

    if (typeNameNode.type === 'TSQualifiedName') {
      // 处理 A.B.C 的情况，只拿最左边的 A
      let left = typeNameNode.left
      while (left.type === 'TSQualifiedName') {
        left = left.left
      }
      if (left.type === 'Identifier') {
        const name = left.name
        return typeMap.get(name)
      }
    }

    return undefined
  }

  traverse(ast, {
    TSInterfaceDeclaration(path) {
      const name = path.node.id.name
      typeMap.set(name, path)
    },
    TSTypeAliasDeclaration(path) {
      const name = path.node.id.name
      typeMap.set(name, path)
    },
    CallExpression: {
      enter(p) {
        if (p.get('callee').isIdentifier({
          name: 'defineProps',
        })) {
          const pa = p.get('typeParameters').get('params')
          if (pa.length > 0) {
            const taregtPath = pa[0]
            if (taregtPath.isTSTypeReference()) {
              const binding = resolveTSTypeReference(taregtPath)
              if (binding) {
                console.log(binding)
              }
            }
          }
        }
      },
    },

    // ImportDeclaration: {
    //   enter(p) {

    //   },
    // },
    // ExportDeclaration: {
    //   enter(p) {

    //   },
    // },
  })

  return result
}
