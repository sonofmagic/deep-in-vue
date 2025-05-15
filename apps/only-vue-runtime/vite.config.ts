import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    port: 8081,
  },
  plugins: [
    tsconfigPaths(),
    vueDevTools(),
  ],
})
