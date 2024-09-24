import { $http } from '@/api/index'
export default {
  submitComment(postId, comment) {
    return $http.post(`/post/${postId}`, comment)
  },
  getComment(postId, page) {
    let params = {}
    params['page'] = page
    return $http.get(`/post/${postId}`, { params: params })
  },
  getAllComments(page) {
    let params = {}
    params['page'] = page
    return $http.get('/moderate', { params: params })
  },
  enable(commentId) {
    return $http.get(`/moderate/enable/${commentId}`)
  },
  disable(commentId) {
    return $http.get(`/moderate/disable/${commentId}`)
  }
}
