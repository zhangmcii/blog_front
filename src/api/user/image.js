import { $http } from '@/api/index'
export default {
  saveImageUrl(image) {
    return $http.post('/image', image)
  }
}
