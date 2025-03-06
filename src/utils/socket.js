// src/utils/socket.js
import { io } from 'socket.io-client'
import requestUrl from '@/config/requestUrl.js'

const connectSocket = () => {
  const token = localStorage.getItem('token')
  const socket = io(`${requestUrl.baseUrl}:${requestUrl.backendPort}`, {
    auth: {  'Authorization': token },
    query: { token },
    transports: ['websocket'],
    headers: {
      Authorization: token
    }
  })

  // 监听连接成功事件
  socket.on('connect', () => {
    console.log('已连接到WebSocket服务器')
  })
  socket.on('new_notification', (data) => {
    console.log('收到实时通知:', data)
  })
  socket.on('connect_error', (err) => {
    console.error('WebSocket连接失败:', err.message)
  })

  return socket
}

export default connectSocket
