import fs from 'fs-extra'
import path from 'pathe'
import { parse } from 'vue/compiler-sfc'
// walk estree-walker

async function main() {
  const codePath = path.resolve(import.meta.dirname, '../src/demo/CardWrapper.vue') // path.resolve(import.meta.url, '../src/demo/App.vue')
  const code = await fs.readFile(codePath, 'utf-8')
  const { descriptor, errors } = parse(code)
  console.log(descriptor, errors)
}

main()
