import { $http } from '@/utils/request.js'
export default {
  sendMsg(params) {
    return $http.post('/msg', params)
  },
  getMessageHistory(userId) {
    let params = {}
    params['userId'] = userId
    console.log('params', params)
    return $http.get('/msg', { params: params })
  },
  markMessagesRead(ids) {
    let params = {}
    params[ids] = ids
    return $http.post('/msg/read', params)
  }
}
