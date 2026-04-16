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
            { text: '本章导读', link: '/' },
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
            { text: '本章导读', link: '/' },
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
            { text: '本章导读', link: '/' },
            { text: '纯运行时项目', link: '/no-compile' },
            { text: 'vue+jsx 全编译项目', link: '/fully-compiled' },
            { text: 'vite dev 和 build 下的 vue 产物', link: '/vite-dev-build' },
            { text: 'Vue 3.5 SSR 与 Hydration', link: '/ssr-hydration-3.5' },
          ],
        },
        {
          base: '/deep',
          collapsed: false,
          text: '深入',
          items: [
            { text: '本章导读', link: '/' },
            { text: 'Vue 3 响应式系统的实现原理', link: '/vue-runtime' },
            { text: '类型推导与提取', link: '/type-infer' },
            { text: '自定义编译时指令', link: '/custom-compile-directive' },
            { text: '为什么 React 市占率比 Vue 高', link: '/why-react' },
          ],
        },
      ],
      '/utils/': [
        { text: '跳转到本地 IDE', link: '/utils/inspect' },
      ],
      '/demo/': [
        { text: '语法演示', link: '/demo/' },
      ],
      '/ui/': [
        { text: '前言', link: '/ui/index' },
        {
          text: '提炼组件 (Vue 3 主线，含 Vue 2 历史兼容)',
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
            { text: 'element-ui (vue2) 构建分析', link: '/ui/npm/element-ui' },
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
          text: '横向对照与趋势',
          items: [
            { text: 'React 组件生态速览', link: '/ui/other-component/react' },
            { text: 'SolidJS 组件生态速览', link: '/ui/other-component/solid-js' },
            { text: 'Svelte 组件生态速览', link: '/ui/other-component/svelte' },
            { text: 'headless', link: '/next/index' },
          ],
        },
      ],
    },
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '本质', link: '/essence/' },
      { text: '进阶', link: '/advanced/' },
      { text: '深入', link: '/deep/' },
      { text: '演示', link: '/demo/' },
      { text: '工具', link: '/utils/inspect' },
      { text: '构建组件库', link: '/ui/' },
    ],
  },
  vite: {
    server: {
      port: 8080,
    },
  },
})
