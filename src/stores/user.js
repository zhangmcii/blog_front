import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import requestUrl from '@/config/requestUrl.js'

export const useCurrentUserStore = defineStore('currentUser', {
  state() {
    return {
      socket: null,
      userInfo: {
        id: '1',
        username: '',
        nickname: '',
        isAdmin: false,
        roleId: 0,
        isConfirmed: false,
        image: '',
        about_me: '',
        location: '',
        token: '',
        // 已点赞的评论id
        likeIds: [],
        // 关注的用户
        followed: [
          {
            id: -1,
            name: '',
            uName: '',
            avatar: ''
          }
        ]
      },
      notice: {
        Notification_data: [],
        // NOTIFICATION_KEY: `user_notifications_${userInfo.id}`,
        NOTIFICATION_KEY: `user_notifications_1}`,
        MAX_ITEM: 50
      }
    }
  },
  getters: {
    isLogin: (state) => state.userInfo.token != '',
    isCommentManage: (state) => state.userInfo.roleId >= 2,
    isConfirmed: (state) => state.userInfo.isConfirmed == true,
    isAdmin: (state) => state.userInfo.isAdmin == true,
    priorityName: (state) =>
      state.userInfo.nickname ? state.userInfo.nickname : state.userInfo.username
  },
  actions: {
    addItemLikeIds(value) {
      this.userInfo.likeIds.push(value)
    },
    addItemFollowed(value) {
      this.userInfo.followed.push(value)
    },
    delItemFollowed(username) {
      this.userInfo.followed = this.userInfo.followed.filter((item) => item.uName != username)
    },
    // 保存通知
    saveNotifications(notifications) {
      const trimmed = notifications.slice(0, this.MAX_ITEM)
      this.notice.Notification_data = trimmed
    },
    // 读取通知
    loadNotifications() {
      return this.notice.Notification_data
    },
    // 清空通知（可选）
    clearNotifications() {},
    logOut() {
      this.$reset()
      localStorage.removeItem('blog')
      localStorage.removeItem('blogOtherUser')
    },
    connectSocket() {
      if (!this.socket) {
        this.socket = io(`${requestUrl.baseUrl}:${requestUrl.backendPort}`, {
          auth: { Authorization: this.userInfo.token },
          query: { token: this.userInfo.token },
          transports: ['websocket'],
          reconnectionAttempts: 5,
          reconnectionDelay: 5000
        })

        // 监听连接成功事件
        this.socket.on('connect', () => {
          if (import.meta.env.DEV) {
            console.log('已连接到WebSocket服务器')
          }
        })
        this.socket.on('connect_error', (err) => {
          if (import.meta.env.DEV) {
            console.error('WebSocket连接失败:', err.message)
          }
        })
      }
    },
    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect()
        this.socket.off('connect')
        this.socket.off('connect_error')
        this.socket = null
        if (import.meta.env.DEV) {
          console.log('前端主动断开WebSocket连接')
        }
      }
    }
  },
  persist: {
    key: 'blog',
    storage: localStorage,
    pick: ['userInfo', 'notice']
  }
})
