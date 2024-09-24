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
        // 登陆页面
        {
          path: '/login',
          name: 'login',
          component: () => import('@/views/login/LoginPage.vue')
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
        },
        {
          path: '/editProfile/:obj',
          name: 'editProfile',
          component: () => import('../views/user/EditProfile.vue')
        },
        {
          path: '/editProfileAdmin/:obj',
          name: 'editProfileAdmin',
          component: () => import('../views/user/EditProfileAdmin.vue')
        },
        {
          path: '/share/:obj',
          name: 'share',
          component: () => import('../views/posts/PostShare.vue')
        }
      ]
    },

    {
      path: '/',
      redirect: '/login'
    }
  ]
})

export default router
