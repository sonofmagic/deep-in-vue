import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Vue 编译本质论',
  description: '理解 vue 编译器',
  themeConfig: {
    sidebar: [
      { text: '前言', link: '/' },
      { text: '纯运行时项目', link: '/no-compile' },
      { text: 'vue 编译器介绍', link: '/compiler' },
      { text: 'script setup 的本质', link: '/setup' },
      { text: '插槽的本质', link: '/slot' },
      { text: 'vModel 的本质', link: '/vModel' },
      { text: '.vue 文件的本质', link: '/vue' },

    ],
  },
  vite: {
    server: {
      port: 8080,
    },
  },
})
