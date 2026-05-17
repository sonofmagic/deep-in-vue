import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: './src/index.ts',
  format: ['esm', 'cjs'],
  dts: {
    eager: true,
  },
  deps: {
    onlyBundle: false,
  },
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
  },
  outExtensions({ format }) {
    return {
      dts: format === 'cjs' ? '.d.cts' : '.d.ts',
    }
  },
})
