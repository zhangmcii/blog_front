import { $http } from '@/utils/request.js'
export default {
  saveImageUrl(image) {
    return $http.post('/image', image)
  }
}
