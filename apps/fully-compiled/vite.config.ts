import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { transformLazyShow } from 'compile-time-directive'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import tsconfigPaths from 'vite-tsconfig-paths'
// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8082,
  },
  plugins: [
    vue(
      {
        template: {
          compilerOptions: {
            nodeTransforms: [
              transformLazyShow,
            ],
          },
        },
      },
    ),
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    }),
    tsconfigPaths(
      {
        loose: true,
      },
    ),
    vueDevTools(),
  ],
  build: {
    minify: false,
  },
})
