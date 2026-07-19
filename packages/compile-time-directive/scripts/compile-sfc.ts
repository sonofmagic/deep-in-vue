import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import {
  compileScript,
  compileStyleAsync,
  compileTemplate,
  parse,
} from '@vue/compiler-sfc'

const componentName = 'CardWrapper'
const packageRoot = path.resolve(import.meta.dirname, '..')
const filename = path.resolve(packageRoot, 'test/fixtures/demo', `${componentName}.vue`)
const outputDirectory = path.resolve(packageRoot, '.debug/sfc', componentName)
const scopeId = 'data-v-debug-card-wrapper'
const preprocessLanguages = ['less', 'sass', 'scss', 'styl', 'stylus'] as const
type PreprocessLang = typeof preprocessLanguages[number]
const preprocessLanguageSet: ReadonlySet<string> = new Set(preprocessLanguages)

function isPreprocessLang(value: string): value is PreprocessLang {
  return preprocessLanguageSet.has(value)
}

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
  const source = await readFile(filename, 'utf8')

  // Set breakpoints on each result to inspect the SFC compilation stages.
  const parseResult = parse(source, { filename })
  assertNoErrors('SFC parse', parseResult.errors)

  const { descriptor } = parseResult
  const scriptResult = descriptor.script || descriptor.scriptSetup
    ? compileScript(descriptor, { id: scopeId })
    : undefined

  const templateResult = descriptor.template
    ? compileTemplate({
        id: scopeId,
        filename,
        source: descriptor.template.content,
        scoped: descriptor.styles.some(style => style.scoped),
        compilerOptions: {
          ...(scriptResult ? { bindingMetadata: scriptResult.bindings } : {}),
        },
      })
    : undefined
  assertNoErrors('Template compile', templateResult?.errors ?? [])

  const styleResults = await Promise.all(
    descriptor.styles.map((style) => {
      const preprocessLang = style.lang
      const styleOptions = {
        id: scopeId,
        filename,
        source: style.content,
        scoped: Boolean(style.scoped),
        modules: Boolean(style.module),
      }
      if (preprocessLang) {
        if (!isPreprocessLang(preprocessLang)) {
          throw new Error(`Unsupported style preprocessor: ${preprocessLang}`)
        }
        return compileStyleAsync({ ...styleOptions, preprocessLang })
      }
      return compileStyleAsync(styleOptions)
    }),
  )
  for (const styleResult of styleResults) {
    assertNoErrors('Style compile', styleResult.errors)
  }

  await mkdir(outputDirectory, { recursive: true })
  const outputs: Array<[string, string]> = []
  if (scriptResult) {
    outputs.push(['script.ts', scriptResult.content])
  }
  if (templateResult) {
    outputs.push(['template.js', templateResult.code])
  }
  styleResults.forEach((styleResult, index) => {
    outputs.push([`style-${index}.css`, styleResult.code])
  })

  await Promise.all(
    outputs.map(([outputName, content]) => {
      return writeFile(path.resolve(outputDirectory, outputName), content, 'utf8')
    }),
  )

  process.stdout.write(
    `Compiled ${path.relative(packageRoot, filename)} into ${path.relative(packageRoot, outputDirectory)}\n`,
  )
  process.stdout.write(`Generated: ${outputs.map(([name]) => name).join(', ')}\n`)
}

await main()
