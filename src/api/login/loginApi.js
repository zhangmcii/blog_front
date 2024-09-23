import { $http } from '@/api/index'
export default {
  login(username, password) {
    const param = {}
    param.uiAccountName = username
    param.uiPassword = password
    return $http.post('/auth/login', param)
  }
}
