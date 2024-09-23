import { $http } from '@/api/index'
export default {
  get_user(username) {
    const url = `/user/${username}`
    return $http.get(url)
  }
}
