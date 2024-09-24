import { defineStore } from 'pinia'

export const useOtherUserStore = defineStore('otherUser', {
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
      } else {
        this.username = ''
      }
    }
  }
})
