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
        text: '入门',
        items: [
          { text: '纯运行时项目', link: '/no-compile' },
          { text: 'vue 编译器介绍', link: '/compiler' },
          { text: '编译时指令 vs 运行时指令', link: '/compile-time-directive' },
          { text: 'render vs setup render 函数', link: '/render-vs-setup' },
          { text: 'vue+jsx 全编译项目', link: '/fully-compiled' },
        ],
      },
      {
        base: '/essence',
        collapsed: false,
        text: '本质',
        items: [
          { text: 'script setup 的本质', link: '/setup' },
          { text: 'slot 的本质', link: '/slot' },
          { text: 'v-bind 的本质', link: '/vBind' },
          { text: 'v-on 的本质', link: '/vOn' },
          { text: 'v-model 的本质', link: '/vModel' },
          { text: 'v-if 的本质', link: '/vIf' },
          { text: 'v-for 的本质', link: '/vFor' },
          { text: 'style scoped 的本质', link: '/style-scoped' },
          { text: 'vue jsx/tsx 的本质', link: '/tsx' },
          { text: '.vue 文件的本质', link: '/vue' },
        ],
      },
      // {
      //   base: '/deep',
      //   collapsed: false,
      //   text: '深入',
      //   items: [
      //     { text: '静态提升与 openBlock', link: '/index' },
      //   ],
      // },

    ],
  },
  vite: {
    server: {
      port: 8080,
    },
  },
})
