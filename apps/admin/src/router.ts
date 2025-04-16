import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/table',
    meta: {
      hidden: true,
    },
  },
  {
    path: 'table',
    component: () => import('@/pages/table'),
    meta: {
      label: 'Table 列表',
    },
  },
  {
    path: 'home',
    component: () => import('@/pages/home'),
    meta: {
      label: '首页',
      hidden: true,
    },
  },
  {
    path: 'dashborad',
    component: () => import('@/pages/dashborad'),
    meta: {
      label: '仪表盘',
      hidden: true,
    },
  },
  {
    path: 'player',
    component: () => import('@/pages/player'),
    meta: {
      label: '播放器',
    },
  },

]

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/admin'),
    children: adminRoutes,
  },
  {
    path: '/login',
    component: () => import('@/pages/login'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
