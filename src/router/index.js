import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/layout',
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
        },
        {
          path: '/posts',
          name: 'posts',
          component: () => import('../views/posts/PostData.vue')
        },
        {
          path: '/user/:userName',
          name: 'user',
          component: () => import('../views/user/UserData.vue')
        }
      ]
    },
    // 登陆页面
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/',
      redirect: '/login'
    }
  ]
})

export default router
