import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'firstPage',
      redirect: '/responsive'
    },
    {
      path: '/responsive',
      name: 'responsive',
      component: () => import('../views/res/ResponsiveDesign.vue')
    }
  ]
})

export default router
