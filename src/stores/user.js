import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import requestUrl from '@/config/requestUrl.js'

export const useCurrentUserStore = defineStore('currentUser', {
  state() {
    return {
      socket: null,
      activeChat: null,
      heartbeatInterval: null,
      userInfo: {
        id: '1',
        username: '',
        nickname: '',
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
      },
      devUploadBaseUrl: 'dev/'
    }
  },
  getters: {
    isLogin: (state) => state.userInfo.token != '',
    isCommentManage: (state) => state.userInfo.roleId >= 2,
    isConfirmed: (state) => state.userInfo.isConfirmed == true,
    isAdmin: (state) => state.userInfo.roleId == 3,
    priorityName: (state) =>
      state.userInfo.nickname ? state.userInfo.nickname : state.userInfo.username,
    // 图片上传目录
    uploadArticlesBaseUrl: (state) =>
      import.meta.env.DEV == true
        ? state.devUploadBaseUrl
        : `user_image/user_${state.userInfo.id}/articles/`,
    uploadAvatarsBaseUrl: (state) =>
      import.meta.env.DEV == true
        ? state.devUploadBaseUrl
        : `user_image/user_${state.userInfo.id}/avatars/`,
    uploadBackgroundBaseUrl: (state) =>
      import.meta.env.DEV == true
        ? state.devUploadBaseUrl
        : `user_image/user_${state.userInfo.id}/background/`,
    uploadCommentsBaseUrl: (state) =>
      import.meta.env.DEV == true
        ? state.devUploadBaseUrl
        : `user_image/user_${state.userInfo.id}/comments/`
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
        // 初始化心跳定时器
        this.heartbeatInterval = setInterval(() => {
          if (this.socket?.connected) {
            this.socket.emit('heartbeat')
          }
        }, 15000)
      }
    },
    disconnectSocket() {
      if (this.socket) {
        this.socket.off('connect')
        this.socket.off('connect_error')
        this.cleanup()
        this.socket = null
        if (import.meta.env.DEV) {
          console.log('前端主动断开WebSocket连接')
        }
      }
    },
    cleanup() {
      // 清理定时器
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval)
        this.heartbeatInterval = null
      }

      // 断开Socket连接
      if (this.socket) {
        this.socket.disconnect()
        this.socket = null
      }
    },
    enterChat(targetId) {
      this.activeChat = targetId
      this.socket.emit('enter_chat', { targetId: targetId })
      if (import.meta.env.DEV) {
        console.log('进入聊天:', targetId)
      }
    },

    sendMessage(chat, func) {
      let content = chat.content
      if (this.activeChat && content.trim()) {
        this.socket.emit(
          'send_message',
          {
            receiver_id: this.activeChat,
            content: content.trim()
          },
          () => {
            if (import.meta.env.DEV) {
              console.log('消息发送成功')
            }

            func(chat)
            // 在这里执行发送成功后的逻辑
          }
        )
        if (import.meta.env.DEV) {
          console.log('发送消息:', content.trim())
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
