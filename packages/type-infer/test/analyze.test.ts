import { resolveScope } from '@/scope'
import path from 'pathe'
// import a from './fixtures/a.ts?url'
// console.log(a)

function r(testCase: string) {
  const scope = resolveScope(
    path.resolve(import.meta.dirname, `./fixtures/${testCase}.ts`),
  )
  return scope
}

describe.skip('analyze', () => {
  it('analyze', () => {
    const scope = r('a')
    expect(scope.typeMap.keys()).toMatchSnapshot('typeMap keys')
  })
})
