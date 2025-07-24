const updateUser = [
  {
    path: '/editCommonField',
    name: 'editCommonField',
    component: () => import('../views/user/edit/CommonField.vue')
  },
  {
    path: '/editBackGround',
    name: 'editBackGround',
    component: () => import('../views/user/edit/Background.vue')
  }
]
const routes = [
  {
    path: '/layout',
    name: 'firstPage',
    component: () => import('../components/AppLayout.vue'),
    children: [
      {
        path: '/posts',
        name: 'posts',
        component: () => import('../views/posts/PostData.vue'),
        meta: { keepAlive: true }
      },
      // {
      //   path: '/user/:userName',
      //   name: 'user',
      //   component: () => import('../views/user/UserData.vue')
      // },
      ...updateUser,
      {
        path: '/editProfile',
        name: 'editProfile',
        component: () => import('../views/user/EditProfile.vue'),
        meta: { requireAuth: true }
      },
      {
        path: '/editProfileAdmin/:id',
        name: 'editProfileAdmin',
        component: () => import('../views/user/EditProfileAdmin.vue'),
        meta: { roles: ['admin'] }
      },
      {
        path: '/editInterest',
        name: 'editInterest',
        component: () => import('../views/user/edit/Interest.vue'),
        meta: { requireAuth: true }
      },
      {
        path: '/uploadBg',
        name: 'uploadBg',
        component: () => import('../views/user/admin/BackgoundImage.vue'),
        meta: { requireAuth: true }
      },
      {
        path: '/postDetail/:id',
        name: 'detail',
        component: () => import('../views/posts/PostDetail.vue')
      },
      {
        path: '/pubImage',
        name: 'pubImage',
        component: () => import('../views/posts/publish/PublishImage.vue'),
        meta: { keepAlive: true }
      },
      {
        path: '/chat',
        name: 'chat',
        component: () => import('../views/chat/chat.vue'),
        meta: { requireAuth: true }
      },
      {
        path: '/editPost/:id',
        name: 'editPost',
        component: () => import('../views/posts/PostEdit.vue'),
        meta: { requireAuth: true }
      },
      {
        path: '/follow/:action/:userName',
        name: 'follow',
        component: () => import('../views/user/FollowList.vue')
      },
      {
        path: '/commentManagement',
        name: 'commentManagement',
        component: () => import('../views/comment/commentManagement.vue'),
        meta: { roles: ['admin'] }
      },
      {
        path: '/operateLog',
        name: 'operateLog',
        component: () => import('../views/data_manage/OperateLog.vue'),
        meta: { roles: ['admin'] }
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('../views/login/RegisterPage.vue')
      },
      {
        path: '/bindEmail',
        name: 'bindEmail',
        component: () => import('../views/user/EmailPage.vue'),
        meta: { keepAlive: true, requireAuth: true }
      },
      {
        path: '/changeEmail',
        name: 'changeEmail',
        component: () => import('../views/user/EmailChange.vue'),
        meta: { keepAlive: true, requireAuth: true }
      },
      {
        path: '/changePassword',
        name: 'changePassword',
        component: () => import('../views/user/PasswordChange.vue'),
        meta: { keepAlive: true, requireAuth: true }
      },
      {
        path: '/PasswordChangeAdmin',
        name: 'PasswordChangeAdmin',
        component: () => import('../views/user/PasswordChangeAdmin.vue'),
        meta: { roles: ['admin'] }
      },
      {
        path: '/resetPassword',
        name: 'resetPassword',
        component: () => import('../views/user/PasswordReset.vue')
      },
      {
        path: '/403',
        name: 'notAuth',
        component: () => import('../views/error/NotAuth.vue')
      },
      {
        path: '/404',
        name: 'notFound',
        component: () => import('../views/error/NotFound404.vue')
      },
      {
        path: '/500',
        name: 'networkError',
        component: () => import('../views/error/NetError.vue')
      }
    ]
  },
  { path: '/', redirect: '/welcome' },
  // 登陆页面
  {
    path: '/login',
    name: 'login',
    component: () =>
      import.meta.env.DEV == true
        ? import('@/views/login/LoginPageDev.vue')
        : import('@/views/login/LoginPage.vue')
  },
  {
    path: '/clear',
    name: 'clear',
    component: () => import('../views/login/Clear.vue')
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: () => import('../views/welcome/BlogIndex.vue')
  },
  {
    path: '/pc',
    name: 'pc',
    component: () => import('../views/user/UserPage1.vue')
  },
  {
    path: '/user/:userName',
    name: 'user',
    // component: () => import('../views/user/UserData.vue')
    component: () => import('../views/user/UserPage1.vue'),
  }
]

export default routes
