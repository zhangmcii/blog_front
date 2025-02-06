import { $http } from '@/api/index'
export default {
  getFan(userName, page) {
    let params = {}
    params['page'] = page
    return $http.get(`/followers/${userName}`, { params: params })
  },
  
  getFollowing(userName,page) {
    let params = {}
    params['page'] = page
    return $http.get(`/followed_by/${userName}`, { params: params })
  }
}
