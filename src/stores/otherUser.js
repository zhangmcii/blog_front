import { defineStore } from 'pinia'

export const useOtherUserStore = defineStore('otherUser', {
  state: () => ({
    userInfo: {
      id: 1,
      username: '',
      nickname: '',
    },
    defaultBackground: 'http://qn.191718.com/userBackground/static/image-pre3.webp-slim'
  }),
  getters: {
    isCommentManage: (state) => state.userInfo.roleId >= 2,
    isConfirmed: (state) => state.userInfo.isConfirmed == true,
    isAdmin: (state) => state.userInfo.isAdmin == true,
    priorityName: (state) => (state.userInfo.nickname ? state.userInfo.nickname : state.userInfo.username),
    backGroundUrl: (state) =>
      state.userInfo.bg_image ? state.userInfo.bg_image : state.defaultBackground,
  },
  actions: {
  },
  persist: {
    key: 'blogOtherUser',
    storage: localStorage,
  }
})
