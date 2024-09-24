import { $http } from '@/api/index'
export default {
  getPosts(page, tabName) {
    let params = {}
    params['page'] = page
    params['tabName'] = tabName
    return $http.get('/', { params: params })
  },
  publish_post(post) {
    return $http.post('/', post)
  },
  editPost(id, post) {
    return $http.put(`/edit/${id}`, post)
  }
}
