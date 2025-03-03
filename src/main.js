import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import dayjs from './config/dayjsCfg'

import 'element-plus/theme-chalk/dark/css-vars.css'

import { ElMessage } from 'element-plus'

import '@wangeditor/editor/dist/css/style.css'

// 全局loading
import { loadingFadeOut } from 'virtual:app-loading'
loadingFadeOut()

import vue3PhotoPreview from 'vue3-photo-preview'
import 'vue3-photo-preview/dist/index.css'

import { useElementPlus } from '@/plugins/elementPlus'
import 'element-plus/dist/index.css'

import { useVant } from '@/plugins/vant'
import 'vant/lib/index.css'
import {copy} from '@/directives/copy.js'
const app = createApp(App)
const pinia = createPinia()

app.config.globalProperties.$dayjs = dayjs
app.config.globalProperties.$message = ElMessage
app.directive('copy', copy)
app.use(useElementPlus)
app.use(useVant)
app.use(router)
app.use(pinia)
app.use(vue3PhotoPreview)
app.mount('#app')
