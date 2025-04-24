import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Vue 编译本质论',
  description: '理解 vue 编译器',
  themeConfig: {
    sidebar: [
      { text: '前言', link: '/' },
      {
        base: '/guide',
        collapsed: false,
        text: '指南',
        items: [
          { text: '纯运行时项目', link: '/no-compile' },
          { text: 'vue 编译器介绍', link: '/compiler' },
          { text: 'script setup 的本质', link: '/setup' },
          { text: '插槽的本质', link: '/slot' },
          { text: 'vModel 的本质', link: '/vModel' },
          { text: '.vue 文件的本质', link: '/vue' },
        ],
      },
      {
        base: '/deep',
        collapsed: false,
        text: '深入',
        items: [
          { text: '静态提升与 openBlock', link: '/index' },
        ],
      },

    ],
  },
  vite: {
    server: {
      port: 8080,
    },
  },
})
