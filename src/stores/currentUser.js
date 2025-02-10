import { defineStore } from 'pinia'

export const useCurrentUserStore = defineStore('currentUser', {
  state: () => ({
    token: '',
    username: '',
    name:'',
    isAdmin: false,
    roleId: 0,
    isConfirmed: false,
    image: ''
  }),
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
    saveUserName(data) {
      this.username = data
      localStorage.setItem('currentUserName', data)
    },
    loadUserName() {
      const data = localStorage.getItem('currentUserName')
      if(!data || data == 'null'){
        this.username = ''
      }else{
        this.username = data
      }
    },
    saveName(data) {
      this.name = data
      localStorage.setItem('currentName', data)
    },
    loadName() {
      const data = localStorage.getItem('currentName')
      if(!data || data == 'null'){
        this.name = ''
      }else{
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
    }
  }
})
