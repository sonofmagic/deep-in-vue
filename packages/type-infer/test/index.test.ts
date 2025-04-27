import { resolveScope } from '@/scope'
import fs from 'fs-extra'
import path from 'pathe'

function extractTypes(id: string) {
  return resolveScope(id, true)
}

describe('index', () => {
  it('simple-interface', async () => {
    const { props } = await extractTypes(
      path.resolve(import.meta.dirname, './fixtures/simple-interface.ts'),
    )
    await fs.outputFile(
      path.resolve(import.meta.dirname, './output/simple-interface.json'),
      JSON.stringify(props, undefined, 2),
      'utf8',
    )
    expect(props).toMatchSnapshot()
  })

  it('simple-interface-ref', async () => {
    const { props } = await extractTypes(
      path.resolve(import.meta.dirname, './fixtures/simple-interface-ref.ts'),
    )
    await fs.outputFile(
      path.resolve(import.meta.dirname, './output/simple-interface-ref.json'),
      JSON.stringify(props, undefined, 2),
      'utf8',
    )
    expect(props).toMatchSnapshot()
  })

  it('simple-type-ref', async () => {
    const { props } = await extractTypes(
      path.resolve(import.meta.dirname, './fixtures/simple-type-ref.ts'),
    )
    await fs.outputFile(
      path.resolve(import.meta.dirname, './output/simple-type-ref.json'),
      JSON.stringify(props, undefined, 2),
      'utf8',
    )
    expect(props).toMatchSnapshot()
  })

  it('simple-type-ref-interseaction-case-0', async () => {
    const { props } = await extractTypes(
      path.resolve(import.meta.dirname, './fixtures/simple-type-ref-interseaction-case-0.ts'),
    )
    await fs.outputFile(
      path.resolve(import.meta.dirname, './output/simple-type-ref-interseaction-case-0.json'),
      JSON.stringify(props, undefined, 2),
      'utf8',
    )
    expect(props).toMatchSnapshot()
  })

  it('complex', async () => {
    const { props } = await extractTypes(
      path.resolve(import.meta.dirname, './fixtures/complex.ts'),
    )
    await fs.outputFile(
      path.resolve(import.meta.dirname, './output/complex.json'),
      JSON.stringify(props, undefined, 2),
      'utf8',
    )
    expect(props).toMatchSnapshot()
  })

  it('complex-ag', async () => {
    const { props } = await extractTypes(
      path.resolve(import.meta.dirname, './fixtures/complex-ag.ts'),
    )
    await fs.outputFile(
      path.resolve(import.meta.dirname, './output/complex-ag.json'),
      JSON.stringify(props, undefined, 2),
      'utf8',
    )
    expect(props).toMatchSnapshot()
  })

  it('complex-intersection', async () => {
    const { props } = await extractTypes(
      path.resolve(import.meta.dirname, './fixtures/complex-intersection.ts'),
    )
    await fs.outputFile(
      path.resolve(import.meta.dirname, './output/complex-intersection.json'),
      JSON.stringify(props, undefined, 2),
      'utf8',
    )
    expect(props).toMatchSnapshot()
  })
})
