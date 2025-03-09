import { $http } from '@/utils/request.js'
export default {
  getUnRead() {
    return $http.get('/notification/unread')
  },
  mark_read(params) {
    return $http.post('/notification/read', params)
  }
}
