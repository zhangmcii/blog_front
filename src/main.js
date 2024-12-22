import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import * as dayjs from 'dayjs'
import zhCN from 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import axios from 'axios'
// 引入css样式
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// element plus配置为中文
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { loadingFadeOut } from 'virtual:app-loading'
loadingFadeOut()
// 引入RelativeTime插件
dayjs.extend(relativeTime)
// dayjs语言配置为中文
dayjs.locale(zhCN)

dayjs.extend(updateLocale)
dayjs.updateLocale('zh-cn', {
  relativeTime: {
    future: '%s后',
    past: '%s前',
    s: '几秒',
    m: '1分钟',
    mm: '%d分钟',
    h: '1小时',
    hh: '%d小时',
    dd: '%d天',
    M: '1个月',
    MM: '%d月',
    y: '1年',
    yy: '%d年'
  }
})

const app = createApp(App)
const pinia = createPinia()

// app.config.globalProperties.$dayjs = dayjs
app.config.globalProperties.$http = axios
app.config.globalProperties.$message = ElMessage

app.use(ElementPlus, {
  locale: zhCn
})
app.use(router)
app.use(pinia)
app.mount('#app')
