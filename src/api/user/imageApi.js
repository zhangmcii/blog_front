import { $http } from '@/utils/request.js'
export default {
  saveImageUrl(image) {
    return $http.post('/image', image)
  },
  saveInterestImage(userId, data) {
    return $http.post(`/user/${userId}/interest_images`, data)
  },
  getBackgroundImage(currentPage, pageSize) {
    const images = [
      'https://www.191718.com/userBackground/static/image-pre1.webp-slim',
      'https://www.191718.com/userBackground/static/image-pre2.webp-slim',
      'https://www.191718.com/userBackground/static/image-pre3.webp-slim',
      'https://www.191718.com/userBackground/static/image-pre4.webp-slim',
    ]
    // 计算当前页显示的item
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return new Promise((resolve, reject) => {
      // 返回一个promise
      const data = {
        data: images.slice(start, end),
        total: images.length,
        msg: 'success'
      }
      resolve(data)
    })
  }
}
