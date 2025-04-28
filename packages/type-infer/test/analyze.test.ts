import { resolveScope } from '@/scope'
import fs from 'fs-extra'
import path from 'pathe'

function r(testCase: string) {
  const scope = resolveScope(
    path.resolve(import.meta.dirname, `./fixtures/${testCase}.ts`),
  )
  return scope
}

describe('analyze', () => {
  it('analyze', () => {

  })
})
