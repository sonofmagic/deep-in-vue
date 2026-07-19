import type { NodePath } from '@babel/traverse'
import type * as t from '@babel/types'
import type { RuntimeProps } from './types'
import { readFileSync } from 'node:fs'
import { parse, traverse } from './babel'

export function extractTypes(id: string) {
  const code = readFileSync(id, 'utf8')

  const ast = parse(code, {
    plugins: ['typescript'],
    sourceType: 'module',
  })

  const result: RuntimeProps = {}
  const typeMap = new Map<string, NodePath<t.TypeScript>>()

  function resolveTSTypeReference(np: NodePath<t.TSTypeReference>) {
    const typeNameNode = np.node.typeName
    if (typeNameNode.type === 'Identifier') {
      const name = typeNameNode.name
      if (typeMap.get(name)) {
        return typeMap.get(name)
      }
    }
    else if (typeNameNode.type === 'TSQualifiedName') {
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

  function resolveTSProperty(mp: NodePath<t.TSTypeElement>) {
    if (mp.isTSPropertySignature()) {
      const keyP = mp.get('key')
      if (keyP.isIdentifier()) {
        const key = keyP.node.name
        const typeAnnotationPath = mp.get('typeAnnotation')
        result[key] = {
          type: typeAnnotationPath.node?.typeAnnotation.type ?? 'null',
          required: !mp.node.optional,
        }
      }
    }
  }

  function resolveIntersectionTypes(typePath: NodePath<t.TSType>) {
    if (typePath.isTSTypeLiteral()) {
      for (const mp of typePath.get('members')) {
        resolveTSProperty(mp)
      }
    }
    else if (typePath.isTSTypeReference()) {
      const binding = resolveTSTypeReference(typePath)
      if (binding) {
        if (binding.isTSInterfaceDeclaration()) {
          binding.get('body').get('body').forEach((mp) => {
            resolveTSProperty(mp)
          })
        }
        else if (binding.isTSTypeAliasDeclaration()) {
          const typeAnnotation = binding.get('typeAnnotation')
          resolveIntersectionTypes(typeAnnotation)
        }
      }
    }
    else if (typePath.isTSIntersectionType()) {
      for (const subType of typePath.get('types')) {
        resolveIntersectionTypes(subType)
      }
    }
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
          const typeArguments = p.get('typeArguments')
          if (!typeArguments.isTSTypeParameterInstantiation()) {
            return
          }
          const pa = typeArguments.get('params')
          if (pa.length > 0) {
            // 只获取第一个范形
            const taregtPath = pa[0]
            if (!taregtPath) {
              return
            }
            // 最基础的情况
            if (taregtPath.isTSTypeLiteral()) {
              for (const mp of taregtPath.get('members')) {
                resolveTSProperty(mp)
              }
            }
            else if (taregtPath.isTSTypeReference()) {
              const binding = resolveTSTypeReference(taregtPath)
              if (binding) {
                if (binding.isTSInterfaceDeclaration()) {
                  binding.get('body').get('body').forEach((mp) => {
                    resolveTSProperty(mp)
                  })
                }
                else if (binding.isTSTypeAliasDeclaration()) {
                  const typeAnnotationPath = binding.get('typeAnnotation')
                  if (typeAnnotationPath.isTSTypeLiteral()) {
                    typeAnnotationPath.get('members').forEach((mp) => {
                      resolveTSProperty(mp)
                    })
                  }
                  else if (typeAnnotationPath.isTSIntersectionType()) {
                    resolveIntersectionTypes(typeAnnotationPath)
                  }
                }
              }
            }
          }
        }
      },
    },
  })

  return {
    props: result,
  }
}
