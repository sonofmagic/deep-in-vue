import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Vue 本质轮',
  description: 'A VitePress Site',
  themeConfig: {
    sidebar: [
      { text: '.vue 文件的本质', link: '/' },
      { text: '编译器', link: '/compiler' },
      { text: '纯运行时', link: '/no-compile' },
      { text: 'script setup 的本质', link: '/setup' },
      { text: '插槽的本质', link: '/slot' },
      { text: 'vModel 的本质', link: '/vModel' },
    ],
  },
})
