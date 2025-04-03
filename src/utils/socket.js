// src/utils/socket.js
import { io } from 'socket.io-client'
import requestUrl from '@/config/requestUrl.js'
import { useCurrentUserStore } from '@/stores/user'


let socket = null
const currentUser = useCurrentUserStore()

function connectSocket() {
  const token = currentUser.userInfo.token
  if (!socket) {
    socket = io(`${requestUrl.baseUrl}:${requestUrl.backendPort}`, {
      auth: { Authorization: token },
      query: { token },
      transports: ['websocket']
    })

    // 监听连接成功事件
    socket.on('connect', () => {
      if (import.meta.env.DEV) {
        console.log('已连接到WebSocket服务器')
      }
    })
    socket.on('connect_error', (err) => {
      if (import.meta.env.DEV) {
        console.error('WebSocket连接失败:', err.message)
      }
    })
  }
  return socket
}

function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
    if (import.meta.env.DEV) {
      console.log('前端主动断开WebSocket连接')
    }
  }
}

export { connectSocket, disconnectSocket }
