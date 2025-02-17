import { $http } from '@/api/index'
export default {
  submitPraise(postId) {
    return $http.post(`/praise/${postId}`)
  },
  getPraise(postId){
    return $http.get(`/praise/${postId}`)
  }
}
