import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({ username: '' }),
  actions: {
    saveUserName(data) {
      this.username = data
      localStorage.setItem('userName', data)
    },
    loadUserName() {
      const data = localStorage.getItem('userName')
      if (data) {
        this.username = data
      }
    }
  }
})
