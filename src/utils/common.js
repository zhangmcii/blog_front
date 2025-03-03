import { copyTextToClipboard } from '@pureadmin/utils'
import { ElMessage } from 'element-plus'
export function copy(value) {
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
