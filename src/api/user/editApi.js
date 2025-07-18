import { $http } from '@/utils/request.js'
export default {
  editProfile(formUserData) {
    return $http.post('/edit-profile', formUserData)
  },
  editProfileAdmin(formUserData) {
    return $http.post(`/edit-profile/${formUserData.id}`, formUserData)
  },
  editUserTag(data) {
    return $http.post('/update_user_tag', data)
  }
}
