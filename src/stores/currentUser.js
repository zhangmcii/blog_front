import { defineStore } from 'pinia'
import { set } from 'undraw-ui'

export const useCurrentUserStore = defineStore('currentUser', {
  state: () => ({
    token: '',
    id: '',
    username: '',
    name: '',
    isAdmin: false,
    roleId: 0,
    isConfirmed: false,
    image: '',
    Notification_data: [],
    NOTIFICATION_KEY: 'user_notifications',
    MAX_ITEM: 50
  }),
  // state: () => {
  //   return {
  //     toekn: '',
  //     userInfo: {
  //       id:'1',
  //       username: '',
  //       name: '',
  //       isAdmin: false,
  //       roleId: 0,
  //       isConfirmed: false,
  //       image: ''
  //     },
  //     notice: {
  //       Notification_data: [],
  //       NOTIFICATION_KEY: `user_notifications_${userInfo.id}`,
  //       MAX_ITEM: 50
  //     }
  //   }
  // },
  actions: {
    saveToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    loadToken() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
      } else {
        this.token = ''
      }
    },
    saveId(id) {
      this.id = id
      localStorage.setItem('currentUserId', id)
    },
    loadId() {
      const data = localStorage.getItem('currentUserId')
      if (!data || data == 'null') {
        this.id = ''
      } else {
        this.id = data
      }
    },
    saveUserName(data) {
      this.username = data
      localStorage.setItem('currentUserName', data)
    },
    loadUserName() {
      const data = localStorage.getItem('currentUserName')
      if (!data || data == 'null') {
        this.username = ''
      } else {
        this.username = data
      }
    },
    saveName(data) {
      this.name = data
      localStorage.setItem('currentNickName', data)
    },
    loadName() {
      const data = localStorage.getItem('currentNickName')
      if (!data || data == 'null') {
        this.name = ''
      } else {
        this.name = data
      }
    },
    saveAdmin(isAdmin) {
      this.isAdmin = isAdmin
      localStorage.setItem('isAdmin', isAdmin)
    },
    loadAdmin() {
      this.isAdmin = localStorage.getItem('isAdmin')
    },
    saveRoleId(roleId) {
      this.roleId = roleId
      localStorage.setItem('roleId', roleId)
    },
    loadRoleId() {
      this.roleId = parseInt(localStorage.getItem('roleId'))
    },
    saveConfirmed(isConfirmed) {
      this.isConfirmed = isConfirmed
      localStorage.setItem('isConfirmed', isConfirmed)
    },
    loadConfirmed() {
      this.isConfirmed = localStorage.getItem('isConfirmed')
    },
    saveImage(image) {
      this.image = image
      localStorage.setItem('image', image)
    },
    loadImage() {
      this.image = localStorage.getItem('image')
    },
    // 保存通知
    saveNotifications(notifications) {
      const trimmed = notifications.slice(0, this.MAX_ITEM)
      this.Notification_data = trimmed
      localStorage.setItem(this.NOTIFICATION_KEY, JSON.stringify(trimmed))
    },
    // 读取通知
    loadNotifications() {
      const data = localStorage.getItem(this.NOTIFICATION_KEY)
      this.Notification_data = data ? JSON.parse(data) : []
      try {
        const data = localStorage.getItem(this.NOTIFICATION_KEY)
        const d = data ? JSON.parse(data) : []
        this.Notification_data = d
        return d
      } catch (error) {
        this.clearNotifications()
        return []
      }
    },
    // 清空通知（可选）
    clearNotifications() {
      localStorage.removeItem(this.NOTIFICATION_KEY)
    }
  }
})
