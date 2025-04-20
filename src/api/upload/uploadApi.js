import { $http } from '@/utils/request.js'
export default {
  get_upload_token(){
    return $http.get('/get_upload_token')
  },
}
