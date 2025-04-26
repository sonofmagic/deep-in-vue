import { extractTypes } from '@/index'
import fs from 'fs-extra'
import path from 'pathe'

describe('index', () => {
  it('simple-interface', async () => {
    const props = await extractTypes(
      path.resolve(import.meta.dirname, './fixtures/simple-interface.ts'),
    )
    await fs.outputFile(
      path.resolve(import.meta.dirname, './output/simple-interface.json'),
      JSON.stringify(props, undefined, 2),
      'utf8',
    )
  })
})
