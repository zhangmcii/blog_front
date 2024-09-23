import axios from 'axios'
import { setInterceptors } from './config'

/* Python后台 */
const url_py = 'http://192.168.1.13:8081'

const $http = axios.create({
  baseURL: url_py,
  timeout: 10000
})

//添加拦截器
setInterceptors($http)

export { $http }
