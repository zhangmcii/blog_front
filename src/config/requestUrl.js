export default {
  baseUrl: import.meta.env.DEV == true ? 'http://172.18.66.0' : 'http://117.72.109.0',
  backendPort: import.meta.env.DEV == true ? '8081' : '4289',
  frontPort: import.meta.env.DEV == true ? import.meta.env.VITE_PORT : '1717'
}
