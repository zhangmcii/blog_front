import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, _from, next) => {
  const r = localStorage.getItem('roleId')
  const role = r === '3' ? 'admin' : r
  // 无权限跳转403页面
  if (to.meta?.roles && !to.meta?.roles.includes(role)) {
    next({ path: '/403' })
  } else if (to.meta?.requireAuth && !localStorage.getItem('token')) {
    // 判断是否需要登录
    next({ path: '/login' })
  } else {
    next()
  }
})
export default router
