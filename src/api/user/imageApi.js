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
      'src/asset/user/image.png',
      'src/asset/user/image2.png',
      'src/asset/user/image3.png',
      'src/asset/user/image4.png',

      'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
      'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
      'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
      'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
      'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
      'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg'
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
