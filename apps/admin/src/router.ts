import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/default'),
    children: [
      {
        path: '',
        component: () => import('@/pages/home'),
      },
      {
        path: 'dashborad',
        component: () => import('@/pages/dashborad'),
      },
    ],
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
