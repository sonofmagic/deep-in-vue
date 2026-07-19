import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { compileTemplate, parse } from '@vue/compiler-sfc'
import { transformVFile } from '../src'

function assertNoErrors(stage: string, errors: Array<Error | string>): void {
  if (errors.length === 0) {
    return
  }

  const details = errors
    .map(error => error instanceof Error ? error.message : error)
    .join('\n')
  throw new Error(`${stage} failed:\n${details}`)
}

async function main(): Promise<void> {
  const target = 'CustomDirective'
  const packageRoot = path.resolve(import.meta.dirname, '..')
  const filename = path.resolve(packageRoot, 'test/fixtures/demo', `${target}.vue`)
  const outputDirectory = path.resolve(packageRoot, '.debug/sfc', target)
  const source = await readFile(filename, 'utf8')
  const { descriptor, errors } = parse(source, {
    filename,
  })
  assertNoErrors('SFC parse', errors)

  if (!descriptor.template) {
    throw new Error(`${filename} does not contain a template block`)
  }

  const templateResult = compileTemplate({
    id: 'data-v-debug-custom-directive',
    filename,
    source: descriptor.template.content,
    compilerOptions: {
      nodeTransforms: [transformVFile],
    },
  })
  assertNoErrors('Template compile', templateResult.errors)

  await mkdir(outputDirectory, { recursive: true })
  await writeFile(path.resolve(outputDirectory, 'template.js'), templateResult.code, 'utf8')
  process.stdout.write(
    `Compiled ${path.relative(packageRoot, filename)} into ${path.relative(packageRoot, outputDirectory)}\n`,
  )
}

await main()
