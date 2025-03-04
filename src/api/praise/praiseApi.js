import { $http } from '@/utils/request.js'
export default {
  submitPraise(postId) {
    return $http.post(`/praise/${postId}`)
  },
  getPraise(postId){
    return $http.get(`/praise/${postId}`)
  }
}
