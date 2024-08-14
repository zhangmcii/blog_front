import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'firstPage',
      component: () => import('../components/AppLayout.vue'),
      children: [
        {
          path: '/menu',
          name: 'menu',
          component: () => import('../views/res/ResMenu.vue')
        },
        {
          path: '/responsive',
          name: 'responsive',
          component: () => import('../views/res/ResponsiveDesign.vue')
        },
        {
          path: '/history',
          name: 'history',
          component: () => import('../views/data_manage/HistoryData.vue')
        }
      ]
    }
  ]
})

export default router
