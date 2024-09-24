import { defineStore } from 'pinia'

export const useCurrentUserStore = defineStore('currentUser', {
  state: () => ({ username: '', isAdmin: false }),
  actions: {
    saveUserName(data) {
      this.username = data
      localStorage.setItem('currentUserName', data)
    },
    loadUserName() {
      const data = localStorage.getItem('currentUserName')
      if (data) {
        this.username = data
      } else {
        this.username = ''
      }
    },
    saveAdmin(isAdmin) {
      this.isAdmin = isAdmin
      localStorage.setItem('isAdmin', isAdmin)
      console.log('this', this.isAdmin)
    },
    loadAdmin() {
      this.isAdmin = localStorage.getItem('isAdmin')
    }
  }
})
