import type { t } from './babel'
import type { RuntimeProps } from './types'
import fs from 'fs-extra'
import MagicString from 'magic-string'
import { parse, traverse } from './babel'

const map: Record<string, string> = {
  TSArrayType: 'Array',
  TSTypeLiteral: 'Object',
  TSNumberKeyword: 'Number',
  TSStringKeyword: 'String',
  TSBooleanKeyword: 'Boolean',
}

function mapTsType2VueType(type: string) {
  return map[type] || type
}

export function insert(id: string, props: RuntimeProps) {
  const code = fs.readFileSync(id, 'utf8')
  const ms = new MagicString(code)
  const ast = parse(code, {
    sourceType: 'module',
  })

  traverse(ast, {
    CallExpression(p) {
      if (
        p.get('callee').isIdentifier({
          name: '_defineComponent',
        })
      ) {
        const options = p.get('arguments')[0]
        if (options.isObjectExpression()) {
          const propertiesPath = options.get('properties')
          const propsKey = propertiesPath.find(p => p.get('key').isIdentifier({
            name: 'props',
          }))
          if (!propsKey) {
            const nameKey = propertiesPath.find(p => p.get('key').isIdentifier({
              name: '__name',
            }))
            if (nameKey && typeof nameKey.node.start === 'number' && typeof nameKey.node.end === 'number') {
              const padLeft = ' '.repeat(nameKey.node.loc?.start.column ?? 0)
              ms.appendRight(nameKey.node.end + 1, [
                `props: {`,
                ...Object.entries(props).map(([key, { type, required }]) => {
                  return `  ${key}: { type: ${mapTsType2VueType(type)}, required: ${required} },`
                }),
                '},',
              ].map((x, idx) => {
                return `${idx === 0 ? '\n' : ''}${padLeft}${x}`
              }).join('\n'))
            }
          }
        }
      }
    },
  })

  return ms.toString()
}
