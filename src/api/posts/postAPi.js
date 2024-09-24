import { $http } from '@/api/index'
export default {
  get_posts(page) {
    let params = {}
    params['page'] = page
    return $http.get('/', { params: params })
  },
  publish_post(post) {
    return $http.post('/', post)
  }
}
