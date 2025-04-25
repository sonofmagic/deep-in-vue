import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { transformLazyShow } from './scripts/v-lazy-show'
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
  ],
  build: {
    minify: false
  }
})
