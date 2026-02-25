import { icebreaker } from '@icebreakers/eslint-config'

export default icebreaker(
  {
    vue: true,
    ignores: [
      '**/fixtures/**',
      'apps/only-vue-runtime/public',
      'docs/**/*.md',
    ],
    formatters: {
      css: true,
      graphql: true,
      html: true,
      markdown: true,
      prettierOptions: {
        endOfLine: 'lf',
      },
    },
  },
  {
    rules: {
      'vue/one-component-per-file': 'off',
    },
  },
)
