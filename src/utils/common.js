import { copyTextToClipboard } from '@pureadmin/utils'
import { ElMessage } from 'element-plus'
import { showConfirmDialog } from 'vant'
import router from '@/router'

function copy(value) {
  // 复制卡片内容到剪贴板
  if (!value) {
    ElMessage({
      message: '内容为空',
      type: 'error'
    })
    return
  }
  const success = copyTextToClipboard(value)
  ElMessage({
    message: success ? '复制成功' : '复制失败',
    type: success ? 'success' : 'error'
  })
}

function loginReminder(message) {
  showConfirmDialog({
    title: '您还未登录',
    message: message,
    confirmButtonText: '去登录',
    width: 300
  })
    .then(() => {
      router.push('/login')
    })
    .catch(() => {})
}

async function retry(func, maxRetries = 3, delay = 1000, ...args) {
  let retries = 0
  while (retries < maxRetries) {
    try {
      const result = await func(...args)
      return result
    } catch (error) {
      retries++
      if (retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay))
      } else {
        // 达到最大重试次数，抛出最后一次的错误
        throw error
      }
    }
  }
}

function getAvatarsUrl(key) {
  return `http://${import.meta.env.VITE_QINIU_DOMAIN}/${key}-slim`
}

export { copy, loginReminder, retry, getAvatarsUrl }
