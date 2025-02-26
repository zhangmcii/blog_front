import { $http } from '@/api/index'
export default {
    getLogs(page) {
        let params = {}
        params['page'] = page
        return $http.get('/logs', { params: params })
      },
  }
