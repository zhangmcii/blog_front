import { ElMessage } from 'element-plus'
import router from '../router/index.js'
import axios from 'axios'
import requestUrl from '@/config/requestUrl.js'

const $http = axios.create({
  baseURL: requestUrl.baseUrl + ':' + requestUrl.backendPort,
  timeout: 10000
})

/**
 * 设置网路请求监听
 */
function setInterceptors(...instance) {
  instance.forEach((i) => {
    // 添加请求拦截器
    i.interceptors.request.use(
      function (config) {
        // 从localStorage中获取token
        const token = localStorage.getItem('token')
        if (token) {
          config.headers['Authorization'] = token
        }
        if (import.meta.env.DEV) {
          console.log('==>请求开始')
          console.log(`${config.baseURL}${config.url}`)
          if (config.data) {
            console.log('==>请求数据', config.data)
          }
        }
        return config
      },
      function (error) {
        // 对请求错误做些什么
        if (import.meta.env.DEV) {
          console.log('==>请求开始')
          console.log(error)
        }

        ElMessage({
          message: error,
          type: 'error'
        })
        return Promise.reject(error)
      }
    )

    // 添加响应拦截器
    i.interceptors.response.use(
      function (response) {
        // 2xx 范围内的状态码都会触发该函数。
        if (import.meta.env.DEV) {
          console.log(response)
          console.log('==>请求结束')
        }

        if (response.status == 200) {
          if (response.data.success != undefined && response.data.success != null) {
            if (response.data.success == true) {
              return response.data.data
            } else {
              ElMessage({
                message: response.data.message,
                type: 'error'
              })
              return Promise.reject(response.data.message)
            }
          } else {
            return response
          }
        } else {
          return Promise.reject(response)
        }
      },
      function (error) {
        // 超出 2xx 范围的状态码都会触发该函数。
        if (import.meta.env.DEV) {
          console.log(error)
          console.log('==>请求结束')
        }

        if (error.response === undefined) {
          ElMessage({
            message: '服务器响应超时',
            type: 'error'
          })
          return Promise.reject(error)
        }
        if (error.response.status >= 500) {
          // ElMessage({
          //   message:'服务器出现错误',
          //   type:'error'
          // })
          router.push('/500')
          return Promise.reject(error)
        }
        if (error.response.status === 404) {
          router.push('/404')
          return Promise.reject(error)
        }
        if (error.response.status === 400) {
          ElMessage({
            message: '接口报错',
            type: 'error'
          })
          return Promise.reject(error)
        }
        if (error.response.status === 401) {
          ElMessage({
            message: '您的身份未认证',
            type: 'error'
          })
          return Promise.reject(error)
        }

        if (error.response.status === 403) {
          router.push('/403')
          return Promise.reject(error)
        } else {
          const data = error.response.data
          if (data === null || data === undefined) {
            ElMessage({
              message: '请求失败，请稍后重试！',
              type: 'error'
            })
            return Promise.reject(error)
          } else {
            const resCode = data.code
            if (resCode && typeof resCode == 'number' && resCode !== 200) {
              ElMessage({
                message: '请求失败，请稍后重试！',
                type: 'error'
              })
            }
            return Promise.reject(error)
          }
        }
      }
    )
  })
}

//添加拦截器
setInterceptors($http)

export { $http }
