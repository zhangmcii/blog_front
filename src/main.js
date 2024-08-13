import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import * as echarts from 'echarts'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8081'

const app = createApp(App)

app.config.globalProperties.$echarts = echarts

app.config.globalProperties.$http = axios

app.use(createPinia())

app.use(router)
app.mount('#app')
