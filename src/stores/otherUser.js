import { defineStore } from 'pinia'

export const useOtherUserStore = defineStore('otherUser', {
  state: () => ({
    userInfo: {
      id: 1,
      username: '',
      nickname: '',
    }
  }),
  getters: {
    isCommentManage: (state) => state.userInfo.roleId >= 2,
    isConfirmed: (state) => state.userInfo.isConfirmed == true,
    isAdmin: (state) => state.userInfo.isAdmin == true,
    priorityName: (state) => (state.userInfo.nickname ? state.userInfo.nickname : state.userInfo.username)
  },
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
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'blogOtherUser',
        storage: localStorage
      }
    ]
  }
})
