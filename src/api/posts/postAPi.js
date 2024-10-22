import { $http } from '@/api/index'
const url_prefix = '/api/v1'
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
  
  getPost(id){
    return $http.get(`${url_prefix}/posts/${id}`)
  },
  editPost(id, post) {
    return $http.put(`${url_prefix}/posts/${id}`, post)
  },

}
