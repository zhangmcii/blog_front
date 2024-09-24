import { $http } from '@/api/index'
export default {
  editProfile(formUserData) {
    return $http.post('/edit-profile', formUserData)
  },
  editProfileAdmin(formUserData) {
    return $http.post(`/edit-profile/${formUserData.id}`, formUserData)
  }
}
