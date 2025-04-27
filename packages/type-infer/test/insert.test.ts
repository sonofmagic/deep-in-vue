import { insert } from '@/insert'
import fs from 'fs-extra'
import path from 'pathe'

function handle(jsonFilename: string) {
  const code = insert(
    path.resolve(__dirname, `./fixtures/vue/index.js`),
    fs.readJsonSync(path.resolve(__dirname, `./output/${jsonFilename}.json`)),
  )
  // fs.outputFileSync(path.resolve(__dirname, `./output/${jsonFilename}.js`), code)
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
