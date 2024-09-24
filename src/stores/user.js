import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({ username: '', isAdmin: false }),
  actions: {
    saveUserName(data) {
      this.username = data
      localStorage.setItem('userName', data)
    },
    loadUserName() {
      const data = localStorage.getItem('userName')
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
