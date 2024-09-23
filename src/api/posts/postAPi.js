import { $http } from '@/api/index'
export default {
  get_posts() {
    return $http.get('/')
  }
}
