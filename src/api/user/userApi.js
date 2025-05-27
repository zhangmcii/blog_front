import { $http } from '@/utils/request.js'
const url_prefix = '/api/v1'
export default {
  // 返回用户信息+文章数据
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
  },

  getUser(userId) {
    return $http.get(`${url_prefix}/users/${userId}`)
  },
  query(user_id) {
   
    return $http.get(`/query/${user_id}`)
  },
  get_task(task_id) {
    return $http.get(`/task/${task_id}`)
  }
}
