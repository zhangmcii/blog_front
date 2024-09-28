import { $http } from '@/api/index'
export default {
  get_user(username, page) {
    let params = {}
    params['page'] = page
    return $http.get(`/user/${username}`, { params: params })
  },
  follow(username) {
    return $http.get(`/follow/${username}`)
  },
  unFollow(username) {
    return $http.get(`/unfollow/${username}`)
  }
}
