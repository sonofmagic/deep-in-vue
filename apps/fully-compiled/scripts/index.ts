import fs from 'fs-extra'
import path from 'pathe'
import { compileScript, compileStyle, compileTemplate, parse } from 'vue/compiler-sfc'
// walk estree-walker

function debug(..._args: any[]) {

}

async function main() {
  const target = 'CardWrapper' // 'error'// 'CardWrapper'
  const codePath = path.resolve(import.meta.dirname, `../src/demo/${target}.vue`) // path.resolve(import.meta.url, '../src/demo/App.vue')
  const code = await fs.readFile(codePath, 'utf-8')
  const { descriptor, errors } = parse(code)
  debug(descriptor, errors)
  if (errors.length === 0) {
    const { script, template, styles } = descriptor
    if (script) {
      const { content } = compileScript(descriptor, {
        id: target,

      })
      debug(content)
    }
    if (template) {
      const { code } = compileTemplate({
        id: target,
        filename: target,
        source: template.content,
      })
      debug(code)
    }
    if (styles.length) {
      const { code } = compileStyle({
        id: target,
        filename: target,
        source: styles[0].content,
      })
      debug(code)
    }
  }
}

main()
