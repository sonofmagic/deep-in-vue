import type { NodePath, TraverseOptions } from '@babel/traverse'
import type * as t from '@babel/types'
import type { RuntimeProps } from './types'
import path from 'node:path'
import fs from 'fs-extra'
import { LRUCache } from 'lru-cache'
import set from 'set-value'
import { parse, traverse } from './babel'

interface Scope {
  props: RuntimeProps
  typeMap: Map<string, NodePath<t.TypeScript>>
  ImportDeclarations: NodePath<t.ImportDeclaration>[]
  ExportDeclarations: NodePath<t.ExportDeclaration>[]
  getType: (name: string) => NodePath<t.TypeScript> | undefined
}

const cache = new LRUCache<string, Scope>({
  max: 1024,
})

export function resolveScope(id: string, extractTypes = false): Scope {
  if (cache.has(id)) {
    return cache.get(id)!
  }
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

  function getType(name: string) {
    const inThisFileType = typeMap.get(name)
    if (inThisFileType) {
      return inThisFileType
    }
    else {
      let importedName: string
      const targetDeclaration = ImportDeclarations.find((x) => {
        return x.get('specifiers').find((x) => {
          if (x.isImportSpecifier()) {
            if (x.get('local').isIdentifier({ name })) {
              const imported = x.get('imported')
              if (imported.isIdentifier()) {
                importedName = imported.node.name
              }
              return true
            }
          }
          return false
        })
      })
      if (targetDeclaration) {
        const sourceValue = targetDeclaration.get('source').node.value
        let importFilePath = path.resolve(dir, sourceValue)
        // 加自动补全 .ts/.tsx/.d.ts 文件
        if (!fs.existsSync(importFilePath)) {
          if (fs.existsSync(`${importFilePath}.ts`)) {
            importFilePath = `${importFilePath}.ts`
          }
          else if (fs.existsSync(`${importFilePath}.tsx`)) {
            importFilePath = `${importFilePath}.tsx`
          }
          else if (fs.existsSync(`${importFilePath}.d.ts`)) {
            importFilePath = `${importFilePath}.d.ts`
          }
          else if (fs.existsSync(path.join(importFilePath, 'index.ts'))) {
            importFilePath = path.join(importFilePath, 'index.ts')
          }
          else {
          // 找不到文件，直接返回
            return undefined
          }
        }
        if (importedName! && fs.existsSync(importFilePath)) {
          const importedScope = resolveScope(importFilePath)
          return importedScope.getType(importedName)
        }
      }
    }
  }

  function resolveTSTypeReference(np: NodePath<t.TSTypeReference>) {
    const typeNameNode = np.node.typeName
    if (typeNameNode.type === 'Identifier') {
      const name = typeNameNode.name
      return getType(name)
    }
    else if (typeNameNode.type === 'TSQualifiedName') {
      // 处理 A.B.C 的情况，只拿最左边的 A
      let left = typeNameNode.left
      while (left.type === 'TSQualifiedName') {
        left = left.left
      }
      if (left.type === 'Identifier') {
        const name = left.name
        return getType(name)
      }
    }

    return undefined
  }

  function resolveTSExpressionWithTypeArguments(np: NodePath<t.TSExpressionWithTypeArguments>) {
    const typeNameNode = np.node.expression
    if (typeNameNode.type === 'Identifier') {
      const name = typeNameNode.name
      return getType(name)
    }
    else if (typeNameNode.type === 'TSQualifiedName') {
      // 处理 A.B.C 的情况，只拿最左边的 A
      let left = typeNameNode.left
      while (left.type === 'TSQualifiedName') {
        left = left.left
      }
      if (left.type === 'Identifier') {
        const name = left.name
        return getType(name)
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
    else if (typePath.isTSExpressionWithTypeArguments()) {
      const binding = resolveTSExpressionWithTypeArguments(typePath)
      if (binding) {
        if (binding.isTSInterfaceDeclaration()) {
          binding.get('body').get('body').forEach((mp) => {
            resolveTSProperty(mp)
          })
          const extendsPaths = binding.get('extends')
          if (Array.isArray(extendsPaths)) {
            for (const extendsPath of extendsPaths) {
              resolveIntersectionTypes(extendsPath)
            }
          }
        }
        else if (binding.isTSTypeAliasDeclaration()) {
          const typeAnnotation = binding.get('typeAnnotation')
          resolveIntersectionTypes(typeAnnotation)
        }
      }
    }
    else if (typePath.isTSTypeReference()) {
      const binding = resolveTSTypeReference(typePath)
      if (binding) {
        if (binding.isTSInterfaceDeclaration()) {
          binding.get('body').get('body').forEach((mp) => {
            resolveTSProperty(mp)
          })
          const extendsPaths = binding.get('extends')
          if (Array.isArray(extendsPaths)) {
            for (const extendsPath of extendsPaths) {
              resolveIntersectionTypes(extendsPath)
            }
          }
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
  const opts: TraverseOptions = {
    TSInterfaceDeclaration(path) {
      const name = path.node.id.name
      typeMap.set(name, path)
    },
    TSTypeAliasDeclaration(path) {
      const name = path.node.id.name
      typeMap.set(name, path)
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

  }
  if (extractTypes) {
    opts.CallExpression = function (p) {
      if (p.get('callee').isIdentifier({
        name: 'defineProps',
      })) {
        const pa = p.get('typeParameters').get('params')
        if (pa.length > 0) {
          // 只获取第一个范形
          const taregtPath = pa[0]
          // 最基础的情况
          resolveIntersectionTypes(taregtPath)
        }
      }
    }
  }

  traverse(ast, opts)

  const scope = {
    props: result,
    typeMap,
    ImportDeclarations,
    ExportDeclarations,
    getType,
  }

  cache.set(id, scope)

  return scope
}
