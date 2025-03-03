import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, _from, next) => {
  // 无权限跳转403页面
  if (to.meta?.roles && !to.meta?.roles.includes(localStorage.getItem('roleId'))) {
    next({ path: '/403' })
  } else {
    next()
  }
})
export default router
