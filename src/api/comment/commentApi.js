import { $http } from '@/api/index'
const url_prefix = '/api/v1'
export default {
  submitComment(postId, comment) {
    return $http.post(`/post/${postId}`, comment)
  },
  getComment(postId, page) {
    let params = {}
    params['page'] = page
    return $http.get(`${url_prefix}/posts/${postId}/comments/`, { params: params })
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
