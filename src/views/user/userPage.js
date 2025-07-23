import typewriter from '@/utils/components/Typewriter.vue'
import interest from '@/views/user/components/Interest.vue'
import { FloatButton } from 'vue-amazing-ui'
import socialLinks from '@/utils/components/SocialLinks.vue'
import ButtonAnimate from '@/utils/components/ButtonAnimate.vue'
import cityUtil from '@/utils/cityUtil.js'
import { areaList } from '@vant/area-data'
import { useCurrentUserStore } from '@/stores/user'
import { useOtherUserStore } from '@/stores/otherUser'
import SkeletonUtil from '@/utils/components/SkeletonUtil.vue'
import PostImage from '@/views/posts/components/PostImage.vue'
import PostPreview from '@/views/posts/components/PostPreview.vue'
import userApi from '@/api/user/userApi.js'
import authApi from '@/api/auth/authApi.js'
import date from '@/utils/date.js'
import dayjs from 'dayjs'
import emitter from '@/utils/emitter.js'
import { showConfirmDialog } from 'vant'
import { loginReminder, compressImages } from '@/utils/common.js'
import uploadApi from '@/api/upload/uploadApi.js'
import imageApi from '@/api/user/imageApi.js'
import { v4 as uuidv4 } from 'uuid'
import * as qiniu from 'qiniu-js'

export default {
  components: {
    typewriter,
    interest,
    FloatButton,
    socialLinks,
    ButtonAnimate,
    SkeletonUtil,
    PostImage,
    PostPreview
  },
  data() {
    return {
      isUserPage: true,
      activeInterest: 'movie',
      socialPlatformIcons: [
        { icon: 'mdi-github', link: 'https://www.github.com/leleo886' },
        { icon: 'mdi-email', link: 'mailto:leleo886@foxmail.com' },
        { icon: 'mdi-qqchat', link: 'https://im.qq.com/' },
        { icon: 'mdi-wechat', link: 'https://wx.qq.com/' },
        { icon: 'mdi-youtube', link: 'https://www.youtube.com' },
        { icon: 'mdi-facebook', link: 'https://www.facebook.com' }
      ],
      but: false,
      personalizedtags: ['乐观开朗', '温柔体贴', '善解人意'],
      user: {
        username: '张三',
        name: '赫赫',
        location: '上海',
        email: 'zmc@qq.com',
        about_me: '',
        member_since: '2024-9-20 12:14:00',
        last_seen: '2024-9-20 12:14:00',
        admin: false,
        followers_count: 0,
        followed_count: 0,
        is_followed_by_current_user: false,
        is_following_current_user: false,
        image: '/src/asset/image1.png',
        interest: {
          books: [
            {
              describe: '\u53f2\u8482\u592b\u00b7\u4e54\u5e03\u65af\u4f20',
              disabled: false,
              id: 15,
              related_id: 99,
              timestamp: 'Fri, 13 Jun 2025 12:26:13 GMT',
              type: '\u4e66\u7c4d',
              url: 'http://sxryiuhrz.hd-bkt.clouddn.com/user_image/user_99/interest/8fc817a5-7c5c-4760-84a7-cda88b843745.jpg-slim'
            }
          ],
          movies: [
            {
              describe: '\u82e6\u5c3d\u7518\u6765\u9047\u89c1\u4f60',
              disabled: false,
              id: 12,
              related_id: 99,
              timestamp: 'Fri, 13 Jun 2025 12:25:49 GMT',
              type: '\u7535\u5f71',
              url: 'src/asset/book/book1.webp'
            },
            {
              describe: '\u6211\u7684\u5927\u53d4',
              disabled: false,
              id: 13,
              related_id: 99,
              timestamp: 'Fri, 13 Jun 2025 12:25:49 GMT',
              type: '\u7535\u5f71',
              url: 'src/asset/book/book2.webp'
            },
            {
              describe: '\u9ed1\u8bdd\u5f8b\u5e08',
              disabled: false,
              id: 14,
              related_id: 99,
              timestamp: 'Fri, 13 Jun 2025 12:25:49 GMT',
              type: '\u7535\u5f71',
              url: 'src/asset/book/book3.webp'
            }
          ]
        },
        social_account: {},
        tags: []
      },
      userName: '',
      posts: [{}],
      currentPage: 1,
      posts_count: 0,
      followPerm: false,
      loading: {
        userData: false,
        follow: false,
        skeleton: true,
        switch: false
      },
      uploadToken: '',
      imageUrls: [],
      uploading: false,
      imageKey: [],

      drawer: false,
      imgList: [],
      skeletonThrottle: {
        leading: 300,
        trailing: 300,
        initVal: true
      },
      activeName: 'first',
      // 原始文件
      originalFiles: [],
      // 压缩后的文件
      compressedImages: []
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    const otherUser = useOtherUserStore()
    return { currentUser, otherUser, areaList }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.userName = to.params.userName
      vm.getUserData(vm.userName)
    })
  },
  // 当从A资料跳转B资料时，更新资料页面
  created() {
    this.$watch(
      () => this.$route.params.userName,
      (newVal) => {
        this.userName = newVal
        this.getUserData(newVal)
      }
    )
  },
  async mounted() {
    this.getPermission(1)
    this.getUploadToken()
  },
  computed: {
    location() {
      if (this.user.location && !isNaN(this.user.location)) {
        return cityUtil.getCodeToName(this.user.location, this.areaList)
      }
      return ''
    },
    member_since() {
      return dayjs(this.user.member_since).format('YYYY-MM-DD')
    },
    from_now() {
      // 防止上线时间与当前时间过于接近而显示"几秒后"
      const time = dayjs(this.user.last_seen).subtract(5, 'second').format('YYYY-MM-DD HH:mm:ss')
      return date.dateShow(time)
    },
    isCurrentUser() {
      return this.user.username == this.currentUser.userInfo.username
    },
    follow() {
      return this.followPerm && this.currentUser.userInfo.username != this.user.username
    },
    isFollowCurrentUser() {
      return (
        this.currentUser.userInfo.username &&
        !this.isCurrentUser &&
        this.user.is_following_current_user
      )
    },
    isFollowEachOther() {
      return (
        this.currentUser.userInfo.username &&
        !this.isCurrentUser &&
        this.user.is_following_current_user &&
        this.user.is_followed_by_current_user
      )
    },
    isFollowOtherUser() {
      return (
        this.currentUser.userInfo.username &&
        !this.isCurrentUser &&
        this.user.is_followed_by_current_user
      )
    }
  },
  methods: {
    setMainProperty() {
      if (!this.user.bg_image) {
        return
      }
      const root = document.documentElement
      root.style.setProperty('--leleo-background-image-url', `url('${this.user.bg_image}')`)
    },
    // 每次点击tag触发动画
    playTagAnimation(e) {
      const el = e.currentTarget
      el.classList.remove('animate')
      // 强制重绘
      void el.offsetWidth
      el.classList.add('animate')
    },
    setActive(type) {
      this.activeInterest = type
    },
    handleSwitchChange() {
      const root = document.documentElement
      if (this.isUserPage) {
        root.style.setProperty('--leleo-background-image-url', `url('${this.user.bg_image}')`)
      } else {
        root.style.setProperty('--leleo-background-image-url', `none`)
        root.style.setProperty('background-color', '#fff')
      }
    },
    beforeSwitch() {
      this.loading.switch = true
      return new Promise((resolve) => {
        setTimeout(() => {
          this.loading.switch = false
          return resolve(true)
        }, 500)
      })
    },

    getUserData(userName, page) {
      this.loading.userData = true
      if (!userName) {
        userName = this.otherUser.userInfo.username
      }
      if (!userName) {
        this.$message.error('要显示资料的用户名为空！')
        return
      }
      userApi.get_user(userName, page).then((res) => {
        this.loading.userData = false
        this.user = res.data.data
        // 保存当前点开的用户资料信息
        this.currentUser.setUserInfo(res.data.data)
        this.otherUser.userInfo = res.data.data
        this.imgList.push(this.user.image)
        this.posts = res.data.posts
        this.posts_count = res.data.total
        // 让chat和关注按钮出现时机与骨架屏同步
        setTimeout(() => {
          this.loading.skeleton = false
          this.setMainProperty()
        }, this.skeletonThrottle.trailing)
      })
    },
    editProfile() {
      this.$router.push(`/editProfile`)
    },
    editProfileAdmin() {
      this.$router.push(`/editProfileAdmin/${this.user.id}`)
    },
    // 查询当前登录用户的权限
    getPermission(perm) {
      authApi.getPermission(perm).then((res) => {
        if (res.data.data) {
          this.followPerm = true
        } else {
          this.followPerm = false
        }
      })
    },
    followUser() {
      this.loading.follow = true
      userApi.follow(this.user.username).then((res) => {
        if (res.data.msg == 'success') {
          this.loading.follow = false
          this.user = res.data.data
          this.currentUser.addItemFollowed({
            id: this.user.id,
            name: this.user.name ? this.user.name : this.user.username,
            uName: this.user.username,
            avatar: this.user.image
          })
          this.$message.success('关注成功')
        } else {
          this.loading.follow = false
          this.$message.error(res.data.msg)
        }
      })
    },
    unFollowUser() {
      showConfirmDialog({
        title: '取消对该用户的关注',
        width: 230,
        beforeClose: this.beforeClose
      })
    },

    beforeClose(action) {
      if (action !== 'confirm') {
        return Promise.resolve(true)
      } else {
        return userApi.unFollow(this.user.username).then((res) => {
          if (res.data.msg == 'success') {
            this.user = res.data.data
            this.currentUser.delItemFollowed(this.user.username)
            this.$message.success('已取消关注')
          } else {
            this.$message.error(res.data.msg)
          }
          return res
        })
      }
    },
    followerDetail() {
      const f = 'follower'
      this.$router.push(`/follow/${f}/${this.user.username}`)
    },
    followedDetail() {
      const f = 'followed'
      this.$router.push(`/follow/${f}/${this.user.username}`)
    },
    handleCurrentChange() {
      this.getUserData(this.userName, this.currentPage)
    },
    async handleFileChange(file, fileList) {
      if (!this.beforePicUpload([file])) {
        return
      }
      this.originalFiles = [...fileList]
      // 压缩图像
      this.compressedImages = await compressImages(this.originalFiles, this.compressedImages)
      // 上传至七牛云
      await this.uploadFiles()
      // url保存至后端
      this.submitAvatars()
    },
    async uploadFiles() {
      const domin = import.meta.env.VITE_QINIU_DOMAIN
      try {
        const putExtra = {}
        const config = {
          // 存储区域
          region: qiniu.region.z0
        }
        for (const file of this.compressedImages) {
          const folder = this.currentUser.uploadAvatarsBaseUrl
          const uniqueFileName = `${uuidv4()}.${file.name.split('.').pop()}`
          const key = folder + uniqueFileName
          const observable = qiniu.upload(file.blob, key, this.uploadToken, putExtra, config)
          await new Promise((resolve, reject) => {
            // 保存 this 上下文
            const self = this
            observable.subscribe({
              next() {},
              error(err) {
                reject(err)
              },
              complete(res) {
                self.imageKey.push(res.key)
                const imageUrl = `http://${domin}/${res.key}`
                self.imageUrls.push(imageUrl)
                resolve()
              }
            })
          })
        }
      } catch (error) {
        console.error('Upload failed:', error)
      }
    },
    submitAvatars() {
      const domin = import.meta.env.VITE_QINIU_DOMAIN
      const imageUrl = `http://${domin}/${this.imageKey[0]}`
      imageApi.saveImageUrl({ image: this.imageKey[0] }).then((res) => {
        // 换图像成功后，更新本地image字段
        if (res.data.msg == 'success') {
          this.currentUser.userInfo = { ...this.currentUser.userInfo, ...{ image: res.data.image } }
          this.user.image = imageUrl
          this.imgList.push(this.user.image)
          emitter.emit('image', imageUrl)
          this.$message.success('图像上传成功')
        } else {
          this.$message.error('图像上传失败')
        }
      })
    },
    beforePicUpload(fileList) {
      for (const file of fileList) {
        const isImage = file.raw.type.startsWith('image/')
        if (!isImage) {
          this.$message.error('只能上传图片格式文件！')
          return false
        }
        const limitPic =
          file.raw.type === 'image/png' ||
          file.raw.type === 'image/jpg' ||
          file.raw.type === 'image/jpeg'
        if (!limitPic) {
          this.$message.warning('请上传格式为png/jpg/jpeg的图片')
          return false
        }
      }
      return true
    },
    showDrawer() {
      this.drawer = !this.drawer
    },
    openChat() {
      if (!this.currentUser.isLogin) {
        loginReminder('快去登录再私信吧')
        return
      }
      this.$router.push('/chat')
    },
    getUploadToken() {
      uploadApi.get_upload_token().then((res) => {
        this.uploadToken = res.data.upload_token
      })
    }
  }
}
