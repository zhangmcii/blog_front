import { $http } from '@/api/index'
export default {
  logined() {
    return $http.get('/logined')
  },
  getPermission(perm) {
    return $http.get(`/can/${perm}`)
  }
}
