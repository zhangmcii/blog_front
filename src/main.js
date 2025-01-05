import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import dayjs from './config/dayjsCfg'
// 引入css样式
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// element plus配置为中文
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { ElMessage } from 'element-plus'

import '@wangeditor/editor/dist/css/style.css' // 引入 css

// 全局loading
import { loadingFadeOut } from 'virtual:app-loading'
loadingFadeOut()

const app = createApp(App)
const pinia = createPinia()

app.config.globalProperties.$dayjs = dayjs
app.config.globalProperties.$message = ElMessage

app.use(ElementPlus, {
  locale: zhCn
})
app.use(router)
app.use(pinia)
app.mount('#app')
