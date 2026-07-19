import type { RuntimeProps } from '@/types'
import { readFileSync } from 'node:fs'
import path from 'pathe'
import { insert } from '@/insert'

function handle(jsonFilename: string) {
  const props = JSON.parse(
    readFileSync(path.resolve(__dirname, `./output/${jsonFilename}.json`), 'utf8'),
  ) as RuntimeProps
  const code = insert(
    path.resolve(__dirname, `./fixtures/vue/index.js`),
    props,
  )
  return code
}

describe('insert', () => {
  it('simple-interface-ref', () => {
    expect(handle('simple-interface-ref')).toMatchSnapshot()
  })

  it('simple-interface', () => {
    expect(handle('simple-interface')).toMatchSnapshot()
  })

  it('simple-type-ref-interseaction-case-0', () => {
    expect(handle('simple-type-ref-interseaction-case-0')).toMatchSnapshot()
  })

  it('simple-type-ref', () => {
    expect(handle('simple-type-ref')).toMatchSnapshot()
  })
})
