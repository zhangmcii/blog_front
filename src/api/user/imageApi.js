import { $http } from '@/utils/request.js'
export default {
  saveImageUrl(image) {
    return $http.post('/image', image)
  },
  saveInterestImage(userId, data){
    return $http.post(`/user/${userId}/interest_images`,data)  
  }
}
