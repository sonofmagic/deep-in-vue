import fs from 'fs-extra'
import path from 'pathe'
import { compileScript, compileStyle, compileTemplate, parse } from 'vue/compiler-sfc'
import { transformVFile } from './v-file'

function debug(..._args: any[]) {

}

function output(target: string, data: string) {
  fs.outputFileSync(path.resolve(import.meta.dirname, `../src/demo/output/${target}`), data)
}

async function main() {
  const target = 'CustomDirective' // 'error'// 'CardWrapper'
  const filename = `${target}.vue`
  const codePath = path.resolve(import.meta.dirname, `../test/fixtures/demo/${target}.vue`) // path.resolve(import.meta.url, '../src/demo/App.vue')
  const code = await fs.readFile(codePath, 'utf-8')
  const { descriptor, errors } = parse(code, {
    filename,
  })
  debug(descriptor, errors)
  if (errors.length === 0) {
    const { script, template, styles } = descriptor
    if (script) {
      const { content } = compileScript(descriptor, {
        id: target,

      })
      output('CustomDirective/script.ts', content)
    }
    if (template) {
      const { code } = compileTemplate({
        id: target,
        filename,
        source: template.content,
        compilerOptions: {
          nodeTransforms: [
            transformVFile,
          ],
          directiveTransforms: {

          },
        },
      })
      output('CustomDirective/template.ts', code)
    }
    if (styles.length) {
      const { code } = compileStyle({
        id: target,
        filename,
        source: styles[0].content,
      })
      output('CustomDirective/style.css', code)
    }
  }
}

main()
