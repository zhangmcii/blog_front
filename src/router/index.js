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
          path: '/editProfile/:id',
          name: 'editProfile',
          component: () => import('../views/user/EditProfile.vue')
        },
        {
          path: '/editProfileAdmin/:id',
          name: 'editProfileAdmin',
          component: () => import('../views/user/EditProfileAdmin.vue')
        },
        {
          path: '/share/:id',
          name: 'share',
          component: () => import('../views/posts/PostShare.vue')
        },
        {
          path: '/editPost/:id',
          name: 'editPost',
          component: () => import('../views/posts/PostEdit.vue')
        },
        {
          path: '/follow/:action/:userName',
          name: 'follow',
          component: () => import('../views/user/followList.vue')
        },
        {
          path: '/commentManagement',
          name: 'commentManagement',
          component: () => import('../views/comment/commentManagement.vue')
        },
        {
          path: '/register',
          name: 'register',
          component: () => import('../views/login/RegisterPage.vue')
        },
        {
          path: '/bindEmail',
          name: 'bindEmail',
          component: () => import('../views/user/EmailPage.vue')
        },
        {
          path: '/changeEmail',
          name: 'changeEmail',
          component: () => import('../views/user/EmailChange.vue')
        },
        {
          path: '/changePassword',
          name: 'changePassword',
          component: () => import('../views/user/PasswordChange.vue')
        },
        {
          path: '/resetPassword',
          name: 'resetPassword',
          component: () => import('../views/user/PasswordReset.vue')
        }
      ]
    },

    {
      path: '/',
      redirect: '/posts'
    },
    {
      path: '/login1',
      name: 'login1',
      component: () => import('@/views/login/LoginPage1.vue')
    },
  ]
})
export default router
