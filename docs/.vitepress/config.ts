import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Vue 编译本质论',
  description: '理解 vue 编译器',
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/sonofmagic/deep-in-vue' },
    ],
    editLink: {
      pattern: 'https://github.com/sonofmagic/deep-in-vue/edit/main/docs/:path',
      text: '为此页提供修改建议',
    },
    outline: {
      label: '本页目录',
      level: [2, 3],
    },
    footer: {
      message: `Released under the CC BY-NC-SA 4.0 License.`,
      copyright: 'Copyright © 2025-present <a target="_blank" ref="nofollow" href="https://github.com/sonofmagic">sonofmagic</a>',
    },
    search: {
      provider: 'local',
    },
    sidebar: {
      '/': [
        { text: '前言', link: '/' },
        {
          base: '/guide',
          collapsed: false,
          text: '入门',
          items: [
            { text: 'vue 编译器介绍', link: '/compiler' },
            { text: '编译时指令 vs 运行时指令', link: '/compile-time-directive' },
            { text: 'render vs setup render 函数', link: '/render-vs-setup' },
          ],
        },
        {
          base: '/essence',
          collapsed: false,
          text: '本质',
          items: [
            { text: 'script setup 的本质', link: '/setup' },
            { text: 'v-bind 的本质', link: '/vBind' },
            { text: 'v-on 的本质', link: '/vOn' },
            { text: 'v-model 的本质', link: '/vModel' },
            { text: 'v-if 的本质', link: '/vIf' },
            { text: 'v-for 的本质', link: '/vFor' },
            { text: 'slot 的本质', link: '/slot' },
            { text: 'v-slot 的本质', link: '/v-slot' },
            { text: 'defineXXX 的本质', link: '/define' },
            { text: 'style scoped 的本质', link: '/style-scoped' },
            { text: 'h 函数的本质', link: '/h' },
            { text: 'vue jsx/tsx 的本质', link: '/tsx' },
            { text: '.vue 文件的本质', link: '/vue' },
          ],
        },
        {
          base: '/advanced',
          text: '进阶',
          items: [
            { text: '纯运行时项目', link: '/no-compile' },
            { text: 'vue+jsx 全编译项目', link: '/fully-compiled' },
            { text: 'vite dev 和 build 下的 vue 产物', link: '/vite-dev-build' },
          ],
        },
        {
          base: '/deep',
          collapsed: false,
          text: '深入',
          items: [
            { text: '类型推导与提取', link: '/type-infer' },
            { text: '自定义编译时指令', link: '/custom-compile-directive' },
            // { text: '静态提升与 openBlock', link: '/index' },
          ],
        },
      ],
      '/utils/': [
        { text: '跳转到本地 IDE', link: '/utils/inspect' },
      ],
      '/ui/': [
        { text: '前言', link: '/ui/index' },
        {
          text: '提炼组件 (vue 2&3)',
          items: [
            { text: '组件的编写', link: '/ui/component/0.write' },
            { text: '组件的构建', link: '/ui/component/1.build' },
            { text: '组件的测试', link: '/ui/component/2.test' },
            { text: '组件的发布', link: '/ui/component/3.publish' },
            { text: '组件的使用', link: '/ui/component/4.usage' },
          ],
        },
        {
          text: '现有组件库分析',
          items: [
            // { text: 'element-ui (vue2) 构建分析', link: '/ui/element-ui' },
            {
              text: 'element-plus (vue3) 构建分析',
              items: [
                {
                  text: '项目分析',
                  link: '/ui/npm/element-plus/index',
                },
              ],
            },
          ],
        },
        {
          text: '下个时代的组件库',
          items: [
            { text: 'headless', link: '/next/index' },
          ],
        },
      ],
    },
    nav: [
      { text: '指南', link: '/guide/compiler' },
      { text: '进阶', link: '/advanced/no-compile' },
      { text: '深入', link: '/deep/type-infer' },
      { text: '工具', link: '/utils/inspect' },
      { text: '构建组件库', link: '/ui/index' },
    ],
  },
  vite: {
    server: {
      port: 8080,
    },
  },
})
