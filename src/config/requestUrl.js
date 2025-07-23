export default {
  baseUrl: import.meta.env.DEV == true ? `http://${location.hostname}` : import.meta.env.VITE_DOMIN,
  backendPort: import.meta.env.DEV == true ? '8082' : '4289',
  frontPort: import.meta.env.DEV == true ? import.meta.env.VITE_PORT : '1717'
}
