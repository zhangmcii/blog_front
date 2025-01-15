import image_1 from '../asset/image_1.ico'
import image_2 from '../asset/image_2.ico'
import image_3 from '../asset/image_3.ico'
import image_4 from '../asset/image_4.ico'
import image_5 from '../asset/image_5.ico'
import image_6 from '../asset/image_6.ico'
import image_7 from '../asset/image_7.ico'
import image_8 from '../asset/image_8.ico'
import logOut from '../asset/logOut.png'
import cherry from '../asset/cherry5.jpg'

const arr = [image_1, image_2, image_3, image_4, image_5, image_6, image_7, image_8]
function getRandomImage() {
  // 确保数组不为空
  if (arr && arr.length) {
    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
  }
  return null
}
const imageCfg = {
  random: getRandomImage,
  login: 'https://www.helloimg.com/i/2025/01/15/6787d90f29c4f.jpg',
  loginFail: cherry,
  logOut: logOut,
}
export default imageCfg
