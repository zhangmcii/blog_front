import { $http } from '@/api/index'
export default {
  get_user(username) {
    const url = `/user/${username}`
    return $http.get(url)
  },
  follow(username) {
    return $http.get(`/follow/${username}`)
  },
  unFollow(username) {
    return $http.get(`/unfollow/${username}`)
  }
}
