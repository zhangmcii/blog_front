import axios from 'axios'
import { setInterceptors } from './config'

const url_py =  (import.meta.env.DEV == true) ? 'http://192.168.1.4:8081':'http://117.72.109.0:4289'
const $http = axios.create({
  baseURL: url_py,
  timeout: 10000
})

//添加拦截器
setInterceptors($http)

export { $http }
