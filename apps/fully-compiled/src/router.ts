import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/index.vue'),
  },
  {
    path: '/ice',
    name: 'ice',
    component: () => import('@/pages/ice.vue'),
  },
  {
    path: '/counter',
    name: 'counter',
    component: () => import('@/pages/counter.vue'),
  },
  {
    path: '/hello',
    name: 'hello',
    component: () => import('@/pages/hello.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
