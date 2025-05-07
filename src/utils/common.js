import { copyTextToClipboard } from '@pureadmin/utils'
import { ElMessage } from 'element-plus'
import { showConfirmDialog } from 'vant'
import router from '@/router'
import lrz from 'lrz'

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

function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(`${Math.random() * minNum + 1}`, 10)
    case 2:
      return parseInt(`${Math.random() * (maxNum - minNum + 1) + minNum}`, 10)
    default:
      return 0
  }
}

function isNode() {
  return typeof window === 'undefined'
}

/*
 * @description: 防抖函数
 */
function debounce(func, wait) {
  let timeout
  return function (...args) {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

/*
 * @description: 处理图片压缩
 * @param {Array} originalFiles 原始文件列表
 * @param {Array} _compressedImages 已压缩的图片列表
 
 * @return {Array} compressedImages 压缩后的图片列表
 */
async function compressImages(originalFiles, _compressedImages) {
  const compressedRatio = 80
  const compressedImages = [..._compressedImages]
  const compressionRatio = compressedRatio / 100

  // 找出未压缩的文件
  const uncompressedFiles = originalFiles.filter(
    (file) => !compressedImages.some((img) => img.uid === file.uid)
  )

  for (const file of uncompressedFiles) {
    const rawFile = file.raw
    const compressedFile = await lrz(rawFile, { quality: compressionRatio })

    console.log('压缩后的文件:', compressedFile)
    console.log(`压缩后大小: ${(compressedFile.file.size / 1024).toFixed(2)} KB`)

    // 将 base64 转换为 Blob
    const byteString = atob(compressedFile.base64.split(',')[1])
    const mimeString = compressedFile.base64.split(',')[0].split(':')[1].split(';')[0]
    const arrayBuffer = new ArrayBuffer(byteString.length)
    const uintArray = new Uint8Array(arrayBuffer)
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([arrayBuffer], { type: mimeString })

    compressedImages.push({
      src: compressedFile.base64,
      blob, // 保存 Blob 对象
      name: rawFile.name,
      uid: rawFile.uid,
      sizeInfo: `压缩后大小: ${(compressedFile.file.size / 1024).toFixed(2)} KB`
    })
  }
  return compressedImages
}

export { copy, loginReminder, retry, randomNum, isNode, debounce, compressImages }
