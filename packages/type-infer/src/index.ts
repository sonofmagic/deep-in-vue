import type { NodePath } from '@babel/traverse'
import type * as t from '@babel/types'
import path from 'node:path'
import fs from 'fs-extra'
// import { LRUCache } from 'lru-cache'
import set from 'set-value'
// import path from 'pathe'
import { parse, traverse } from './babel'

export type RuntimeProps = Record<string, { type: string, required: boolean }>

// const cache = new LRUCache({
//   max: 1024,
// })

export function extractTypes(id: string) {
  const code = fs.readFileSync(id, 'utf8')
  const dir = path.dirname(id)
  const ast = parse(code, {
    plugins: ['typescript'],
    sourceType: 'module',
  })

  const result: RuntimeProps = {}
  const typeMap = new Map<string, NodePath<t.TypeScript>>()
  const ImportDeclarations: NodePath<t.ImportDeclaration>[] = []
  const ExportDeclarations: NodePath<t.ExportDeclaration>[] = []

  function resolveTSTypeReference(np: NodePath<t.TSTypeReference>) {
    const typeNameNode = np.node.typeName
    if (typeNameNode.type === 'Identifier') {
      const name = typeNameNode.name
      if (typeMap.get(name)) {
        return typeMap.get(name)
      }
      else {
        const targetDeclaration = ImportDeclarations.find((x) => {
          return x.get('specifiers').find((x) => {
            if (x.isImportSpecifier() && x.get('imported').isIdentifier({ name })) {
              return x.get('local').isIdentifier({ name })
            }
            return false
          })
        })
        if (targetDeclaration) {
          const value = targetDeclaration.get('source').node.value
          const imtf = path.resolve(dir, value)
          if (fs.existsSync(imtf)) {
            const code = fs.readFileSync(imtf, 'utf8')
            const ast = parse(code, {
              plugins: ['typescript'],
              sourceType: 'module',
            })
          }
        }
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
        if (typeAnnotationPath.node) {
          set(result, `${key}.type`, typeAnnotationPath.node.typeAnnotation.type)
        }
        const optional = mp.get('optional')
        set(result, `${key}.required`, !optional.node)
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
          const pa = p.get('typeParameters').get('params')
          if (pa.length > 0) {
            // 只获取第一个范形
            const taregtPath = pa[0]
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

    ImportDeclaration: {
      enter(p) {
        ImportDeclarations.push(p)
      },
    },
    ExportDeclaration: {
      enter(p) {
        ExportDeclarations.push(p)
      },
    },
  })

  return {
    props: result,
  }
}
