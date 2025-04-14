import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '',
    component: () => import('@/pages/home'),
    meta: {
      label: '首页',
    },
  },
  {
    path: 'dashborad',
    component: () => import('@/pages/dashborad'),
    meta: {
      label: '仪表盘',
    },
  },
  {
    path: 'player',
    component: () => import('@/pages/player'),
    meta: {
      label: '播放器',
    },
  },
  {
    path: 'table',
    component: () => import('@/pages/table'),
    meta: {
      label: 'Table 列表',
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
