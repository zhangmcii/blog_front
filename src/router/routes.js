const routes = [
  {
    path: '/layout',
    name: 'firstPage',
    meta:{index:-1},
    component: () => import('../components/AppLayout.vue'),
    children: [
      {
        path: '/history',
        name: 'history',
        meta:{index:-3},
        component: () => import('../views/data_manage/HistoryData.vue')
      },
      {
        path: '/posts',
        name: 'posts',
        meta:{index:0},
        component: () => import('../views/posts/PostData.vue')
      },
      {
        path: '/user/:userName',
        name: 'user',
        meta:{index:1},
        component: () => import('../views/user/UserData.vue')
      },
      {
        path: '/editProfile/:id',
        name: 'editProfile',
        meta:{index:2},
        component: () => import('../views/user/EditProfile.vue')
      },
      {
        path: '/editProfileAdmin/:id',
        name: 'editProfileAdmin',
        meta:{index:3},
        component: () => import('../views/user/EditProfileAdmin.vue')
      },
      {
        path: '/share/:id',
        name: 'share',
        meta:{index:4},
        component: () => import('../views/posts/PostShare.vue')
      },
      {
        path: '/editPost/:id',
        name: 'editPost',
        meta:{index:5},
        component: () => import('../views/posts/PostEdit.vue')
      },
      {
        path: '/follow/:action/:userName',
        name: 'follow',
        meta:{index:6},
        component: () => import('../views/user/FollowList.vue')
      },
      {
        path: '/commentManagement',
        name: 'commentManagement',
        meta:{index:7},
        component: () => import('../views/comment/commentManagement.vue')
      },
      {
        path: '/register',
        name: 'register',
        meta:{index:8},
        component: () => import('../views/login/RegisterPage.vue')
      },
      {
        path: '/bindEmail',
        name: 'bindEmail',
        meta:{index:9},
        component: () => import('../views/user/EmailPage.vue')
      },
      {
        path: '/changeEmail',
        name: 'changeEmail',
        meta:{index:10},
        component: () => import('../views/user/EmailChange.vue')
      },
      {
        path: '/changePassword',
        name: 'changePassword',
        meta:{index:11},
        component: () => import('../views/user/PasswordChange.vue')
      },
      {
        path: '/PasswordChangeAdmin',
        name: 'PasswordChangeAdmin',
        meta:{index:12},
        component: () => import('../views/user/PasswordChangeAdmin.vue')
      },
      {
        path: '/resetPassword',
        name: 'resetPassword',
        meta:{index:13},
        component: () => import('../views/user/PasswordReset.vue')
      },
      {
        path: '/reply',
        name: 'replyComment',
        meta:{index:14},
        component: () => import('../views/comment/CommentReply.vue')
      },
      {
        path: '/networkError',
        name: 'networkError',
        meta:{index:15},
        component: () => import('../views/error/NetError.vue')
      },
      {
        path: '/notFound',
        name: 'notFound',
        meta:{index:16},
        component: () => import('../views/error/NotFound404.vue')
      }
    ]
  },

  {
    path: '/',
    redirect: '/posts',
    meta:{index:-2},
  },
  // 登陆页面
  {
    path: '/login',
    name: 'login',
    meta:{index:-5},
    component: () => import('@/views/login/LoginPage.vue')
  }
]

export default routes
