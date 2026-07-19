import { execFile } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

describe('SFC compiler debug entry', () => {
  it('generates script, template, and style output', async () => {
    const packageRoot = path.resolve(import.meta.dirname, '..')
    const outputDirectory = path.resolve(packageRoot, '.debug/sfc/CardWrapper')
    const { stdout, stderr } = await execFileAsync(
      process.execPath,
      ['--import', 'tsx', 'scripts/compile-sfc.ts'],
      { cwd: packageRoot },
    )

    expect(stderr).toBe('')
    expect(stdout).toContain('Generated: script.ts, template.js, style-0.css')

    const [script, template, style] = await Promise.all([
      readFile(path.resolve(outputDirectory, 'script.ts'), 'utf8'),
      readFile(path.resolve(outputDirectory, 'template.js'), 'utf8'),
      readFile(path.resolve(outputDirectory, 'style-0.css'), 'utf8'),
    ])
    expect(script).toContain('_defineComponent')
    expect(template).toContain('export function render')
    expect(style).toContain('.card')
  })
})
