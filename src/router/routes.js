const routes = [
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
      {
        path: '/posts',
        name: 'posts',
        component: () => import('../views/posts/PostData.vue'),
        meta: { keepAlive: true }
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
        component: () => import('../views/user/FollowList.vue')
      },
      {
        path: '/commentManagement',
        name: 'commentManagement',
        component: () => import('../views/comment/commentManagement.vue'),
        meta: {
          roles: ["3"]
        }
      },
      {
        path: '/operateLog',
        name: 'operateLog',
        component: () => import('../views/data_manage/OperateLog.vue'),
        meta: {
          roles: ["3"]
        }
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
        path: '/PasswordChangeAdmin',
        name: 'PasswordChangeAdmin',
        component: () => import('../views/user/PasswordChangeAdmin.vue'),
        meta: {
          roles: ["3"]
        }
      },
      {
        path: '/resetPassword',
        name: 'resetPassword',
        component: () => import('../views/user/PasswordReset.vue')
      },
      {
        path: '/reply',
        name: 'replyComment',
        component: () => import('../views/comment/CommentReply.vue')
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
      },
    ]
  },

  {
    path: '/',
    redirect: '/posts',
  },
  // 登陆页面
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginPage.vue')
  }
]

export default routes
