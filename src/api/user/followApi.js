import { $http } from '@/api/index'
export default {
  getFan(userName) {
    return $http.get(`/followers/${userName}`)
  },
  getFollowing(userName) {
    return $http.get(`/followed_by/${userName}`)
  }
}
