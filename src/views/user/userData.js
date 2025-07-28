import typewriter from '@/utils/components/Typewriter.vue'
import interest from '@/views/user/components/Interest.vue'
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
import { loginReminder, compressImages, waitImage } from '@/utils/common.js'
import { ElLoading } from 'element-plus'
import uploadApi from '@/api/upload/uploadApi.js'
import imageApi from '@/api/user/imageApi.js'
import { v4 as uuidv4 } from 'uuid'
import * as qiniu from 'qiniu-js'

export default {
  components: {
    typewriter,
    interest,
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
      but: false,
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
          books: [],
          movies: []
        },
        social_account: {},
        tags: []
      },
      userName: '',
      posts: [{}],
      currentPage: 1,
      posts_count: 0,
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
        initVal: false
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
    },
    bgImage() {
      return this.isCurrentUser ? this.currentUser.backGroundUrl : this.otherUser.backGroundUrl
    },
    backColor() {
      return this.isUserPage ? '#ffffff' : '#000000'
    },
    socialCount() {
      return Object.values(this.currentUser.userInfo.social_account).every(
        (value) => value === '' || value === null || value === undefined
      )
    }
  },
    // 当从A资料跳转B资料时，更新资料页面
  created() {
    this.$watch(
      () => this.$route.params.userName,
      () => {
        this.getUser()
      }
    )
  },
  // 在首次挂载、以及每次从缓存中被重新插入的时候调用
  activated() {
    // 还是上一个用户资料
    if (this.otherUser.userInfo.username === this.$route.params.userName) {
      this.user = { ...this.otherUser.userInfo }
      this.setMainProperty()
    }
    // 进入新的用户资料
    else {
      this.isUserPage = true
      this.getUser()
    }
  },
  mounted() {},
  methods: {
    setMainProperty() {
      if (!this.isUserPage) {
        return
      }
      const root = document.documentElement
      root.style.setProperty('--leleo-background-image-url', `url('${this.bgImage}')`)
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
        root.style.setProperty('--leleo-background-image-url', `url('${this.bgImage}')`)
      } else {
        root.style.setProperty('--leleo-background-image-url', `none`)
        root.style.setProperty('background-color', '#fff')
      }
    },
    async beforeSwitch() {
      this.loading.switch = true
      await this.getPosts(this.$route.params.userName, 1)
      this.loading.switch = false
      return true
    },
    getUser() {
      const userName = this.$route.params.userName
      const loading = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.loading.userData = true
      if (!userName) {
        userName = this.otherUser.userInfo.username
      }
      if (!userName) {
        this.$message.error('要显示资料的用户名为空！')
        return
      }
      userApi.getUserByUsername(userName).then((res) => {
        this.loading.userData = false
        this.user = res.data.data
        this.otherUser.userInfo = res.data.data
        // 这里不能直接保存。当游客访问时，将别人的信息保存成当前用户。会将游客变为已登录用户
        if (this.currentUser.isLogin && this.isCurrentUser) {
          this.currentUser.setUserInfo(res.data.data)
        }
        this.imgList.push(this.user.image)
        // 让私信和关注按钮与用户数据同时出现
        setTimeout(() => {
          this.loading.skeleton = false
          this.setMainProperty()
          // 背景图片加载时显示loading
          waitImage([this.bgImage]).then((res) => {
            loading.close()
          })
        }, this.skeletonThrottle.trailing)
      })
    },
    async getPosts(userName, page) {
      await userApi.getPosts(userName, page).then((res) => {
        this.posts = res.data.posts
        this.posts_count = res.data.total
      })
    },
    editProfile() {
      this.$router.push(`/editProfile`)
    },
    editProfileAdmin() {
      this.$router.push(`/editProfileAdmin/${this.user.id}`)
    },
    followUser() {
      if (!this.currentUser.isLogin) {
        loginReminder('快去登录再私信吧')
        return
      }
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
      // this.getUserData(this.userName, this.currentPage)
      this.getPosts(this.$route.params.userName, this.currentPage)
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
    }
  }
}
