import { defineMonorepoConfig } from '@icebreakers/monorepo'

export default defineMonorepoConfig({
  commands: {
    create: {
      defaultTemplate: 'unbuild',
      renameJson: false,
    },
    clean: {
      autoConfirm: false,
      includePrivate: true,
    },
    upgrade: {
      skipOverwrite: false,
      mergeTargets: true,
    },
  },
})
