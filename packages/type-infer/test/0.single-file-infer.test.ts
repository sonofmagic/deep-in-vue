import { extractTypes } from '@/0.single-file-infer'
import path from 'pathe'

describe('0.single-file-infer', () => {
  it('should extract types from a.ts', async () => {
    const { props } = await extractTypes(path.resolve(import.meta.dirname, `./fixtures/simple-interface.ts`))
    expect(props).toEqual({
      a: {
        type: 'TSNumberKeyword',
        required: true,
      },
      b: {
        type: 'TSStringKeyword',
        required: false,
      },
      c: {
        type: 'TSBooleanKeyword',
        required: true,
      },
      d: {
        type: 'TSArrayType',
        required: true,
      },
      e: {
        type: 'TSTypeLiteral',
        required: true,
      },
    })
  })
})
