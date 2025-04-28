import { resolveScope } from '@/scope'
import fs from 'fs-extra'
import path from 'pathe'

function extractTypes(id: string) {
  return resolveScope(id, true)
}

async function r(testCase: string) {
  const { props } = await extractTypes(
    path.resolve(import.meta.dirname, `./fixtures/${testCase}.ts`),
  )
  await fs.outputFile(
    path.resolve(import.meta.dirname, `./output/${testCase}.json`),
    JSON.stringify(props, undefined, 2),
    'utf8',
  )
  return props
}

describe('index', () => {
  it('simple-interface', async () => {
    expect(await r('simple-interface')).toMatchSnapshot()
  })

  it('simple-interface-ref', async () => {
    expect(await r('simple-interface-ref')).toMatchSnapshot()
  })

  it('simple-type-ref', async () => {
    expect(await r('simple-type-ref')).toMatchSnapshot()
  })

  it('simple-type-ref-ref', async () => {
    expect(await r('simple-type-ref-ref')).toMatchSnapshot()
  })

  it('simple-type-ref-interseaction-case-0', async () => {
    expect(await r('simple-type-ref-interseaction-case-0')).toMatchSnapshot()
  })

  it('complex', async () => {
    expect(await r('complex')).toMatchSnapshot()
  })

  it('complex-ag', async () => {
    expect(await r('complex-ag')).toMatchSnapshot()
  })

  it('complex-intersection', async () => {
    expect(await r('complex-intersection')).toMatchSnapshot()
  })
})
