import { icebreaker } from '@icebreakers/eslint-config'

export default icebreaker(
  {
    vue: true,
  },
  {
    ignores: [
      '**/fixtures/**',
      'apps/admin/public',
    ],
  },
)
