import axios from 'axios'
import { setInterceptors } from './config'

/* dev后端 */
// const url_py = 'http://192.168.1.13:8081'

const url_py = 'http://117.72.109.0:4289'

const $http = axios.create({
  baseURL: url_py,
  timeout: 10000
})

//添加拦截器
setInterceptors($http)

export { $http }
