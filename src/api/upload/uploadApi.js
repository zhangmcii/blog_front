import { $http } from '@/utils/request.js'
import * as qiniu from 'qiniu-js'

export default {
  get_upload_token() {
    return $http.get('/get_upload_token')
  },
  del_image(key) {
    const bucket = 'b-article'
    return $http.delete('/del_image', { data: { bucket, key } })
  }
}
