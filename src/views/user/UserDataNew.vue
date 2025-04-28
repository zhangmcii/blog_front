<script>
import userApi from '@/api/user/userApi.js'
import authApi from '@/api/auth/authApi.js'
import image from '@/api/user/image.js'
import date from '@/utils/date.js'
import { useCurrentUserStore } from '@/stores/user'
import { useOtherUserStore } from '@/stores/otherUser'
import PostCard from '../posts/PostCard.vue'
import dayjs from 'dayjs'
import { areaList } from '@vant/area-data'
import cityUtil from '@/utils/cityUtil.js'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
import emitter from '@/utils/emitter.js'
import SkeletonUtil from '@/utils/components/SkeletonUtil.vue'
import { showConfirmDialog } from 'vant'
import { loginReminder } from '@/utils/common.js'
import uploadApi from '@/api/upload/uploadApi.js'
import { v4 as uuidv4 } from 'uuid'
import * as qiniu from 'qiniu-js'

export default {
  components: {
    PostCard,
    PageHeadBack,
    SkeletonUtil
  },
  data() {
    return {
      userName: '',
      user: {
        username: '张三',
        name: '赫赫',
        location: '上海',
        email: 'zmc@qq.com',
        about_me: '天气不错',
        member_since: '2024-9-20 12:14:00',
        last_seen: '2024-9-20 12:14:00',
        admin: false,
        followers_count: 0,
        followed_count: 0,
        is_followed_by_current_user: false,
        is_following_current_user: false,
        image: ''
      },
      posts: [{}],
      currentPage: 1,
      posts_count: 0,
      followPerm: false,
      loading: {
        userData: false,
        follow: false,
        skeleton: true
      },

      uploadUrl: 'http://upload.qiniu.com',
      uploadData: {
        key: '',
        token: '',
        putExtra: {},
        config: {
          region: qiniu.region.z0
        }
      },

      drawer: false,
      imgList: [],
      skeletonThrottle: {
        leading: 300,
        trailing: 300,
        initVal: true
      },
      activeName: 'first'
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    const otherUser = useOtherUserStore()
    return { currentUser, otherUser, areaList }
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
      if (date.isYesterday(time)) {
        return `昨天 ${dayjs(time).format('HH:mm')}`
      }
      return dayjs(time).fromNow()
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
  mounted() {
    this.getPermission(1)
    this.getUploadToken()
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.userName = to.params.userName
      vm.getUserData(vm.userName)
      // 持久化保存 防止用户刷新本页面导致传入的username丢失
      // vm.otherUser.username = to.params.userName
      vm.$nextTick(() => {})
    })
  },
  methods: {
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
        this.otherUser.userInfo = res.data.data
        this.imgList.push(this.user.image)
        this.posts = res.data.posts
        this.posts.forEach((item) => {
          item.image = ''
        })
        this.posts_count = res.data.total
        // 让chat和关注按钮出现时机与骨架屏同步
        setTimeout(() => {
          this.loading.skeleton = false
        }, this.skeletonThrottle.trailing)
      })
    },
    editProfile() {
      this.$router.push(`/editProfile/${this.user.id}`)
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
    beforeAvatarUpload(rawFile) {
      const isImage = rawFile.type.startsWith('image/')
      if (!isImage) {
        this.$message.error('只能上传图片文件！')
        return false
      }
      if (rawFile.size / 1024 / 1024 > 1) {
        this.$message.error('图像的大小不能超过1MB!')
        return false
      }

      const folder = this.currentUser.uploadAvatarsBaseUrl
      const uniqueFileName = `${uuidv4()}.${rawFile.name.split('.').pop()}`
      const key = folder + uniqueFileName
      this.uploadData.key = key
      return true
    },
    handleAvatarSuccess(response) {
      const domin = import.meta.env.VITE_QINIU_DOMAIN
      const imageUrl = `http://${domin}/${response.key}`
      image.saveImageUrl({ image: response.key }).then((res) => {
        if (res.data.msg == 'success') {
          this.user.image = imageUrl
          this.imgList.push(this.user.image)
          // 换图像成功后，更新本地image字段
          this.currentUser.userInfo.image = `http://${domin}/${res.data.image}`
          emitter.emit('image', imageUrl)
          this.$message.success('图像上传成功')
        } else {
          this.$message.error('图像上传失败')
        }
      })
    },
    submitUpload() {
      this.$refs.uploadRef.submit()
    },
    handlePreview() {
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
        this.uploadData.token = res.data.upload_token
      })
    }
  }
}
</script>

<template>
  <PageHeadBack>
    <el-avatar size="large" :src="user.image" @click="showDrawer" />
    <el-tabs v-model="activeName" class="demo-tabs" stretch>
      <el-tab-pane label="资料" name="first">
        <el-card class="user-info" shadow="never">
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
              <el-button round size="small" v-if="isCurrentUser" @click="editProfile"
                >编辑资料</el-button
              >
              <el-button
                type="danger"
                round
                size="small"
                v-if="currentUser.isAdmin"
                @click="editProfileAdmin"
                >编辑资料 [管理员]</el-button
              >
            </div>
          </template>

          <el-skeleton :rows="5" animated :loading="loading.userData" :throttle="skeletonThrottle">
            <template #default>
              <el-row v-if="user.nickname">
                <el-col :xs="6" :xl="4">昵称</el-col>
                <el-col :xs="8" :xl="10" :offset="2">{{ user.nickname }}</el-col>
              </el-row>
              <el-row>
                <el-col :xs="6" :xl="4">账号</el-col>
                <el-col :xs="16" :xl="10" :offset="2">{{ user.username }}</el-col>
              </el-row>
              <el-row v-if="user.email">
                <el-col :xs="6" :xl="4">电子邮件</el-col>
                <el-col :xs="8" :xl="10" :offset="2">{{ user.email }}</el-col>
              </el-row>
              <el-row v-if="user.location">
                <el-col :xs="6" :xl="4">城市</el-col>
                <el-col :xs="16" :xl="10" :offset="2">{{ location }}</el-col>
              </el-row>
              <el-row v-if="user.about_me">
                <el-col :xs="6" :xl="4">签名</el-col>
                <el-col :xs="16" :xl="10" :offset="2">{{ user.about_me }}</el-col>
              </el-row>
              <el-row>
                <el-col :xs="6" :xl="4">生日</el-col>
                <el-col :xs="8" :xl="10" :offset="2">{{ member_since }}</el-col>
              </el-row>

              <el-row>
                <el-col :xs="6" :xl="4">上线时间</el-col>
                <el-col :xs="8" :xl="10" :offset="2">{{ from_now }}</el-col>
              </el-row>
            </template>
          </el-skeleton>
        </el-card>

        <el-card shadow="never">
          <el-skeleton animated :loading="loading.userData" :throttle="skeletonThrottle">
            <template #template>
              <div style="display: flex; justify-items: space-between; gap: 15px; height: 47px">
                <el-skeleton-item variant="text" class="item" />
                <el-skeleton-item variant="text" class="item" />
              </div>
            </template>
            <template #default>
              <el-row>
                <el-col :span="6">
                  <el-statistic
                    title="粉丝"
                    :value="user.followers_count"
                    @click="followerDetail"
                  />
                </el-col>
                <el-col :span="6">
                  <el-statistic title="关注" :value="user.followed_count" @click="followedDetail" />
                </el-col>
              </el-row>
            </template>
          </el-skeleton>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="文章" name="second">
        <SkeletonUtil :loading="loading.userData" :row="5" :count="1" :showAvatar="false">
          <PostCard
            v-for="item in posts"
            :key="item"
            :post="item"
            :showImage="false"
            @click="$router.push(`/postDetail/${item.id}`)"
            v-slide-in
          />

          <el-pagination
            v-model:current-page="currentPage"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="posts_count"
            @current-change="handleCurrentChange"
            :hide-on-single-page="true"
            :pager-count="5"
          />
          <el-empty :image-size="200" description="生活总归带点荒谬" v-if="posts.length === 0" />
        </SkeletonUtil>
      </el-tab-pane>
    </el-tabs>
  </PageHeadBack>

  <van-action-sheet v-model:show="drawer" cancel-text="取消">
    <photo-provider :photo-closable="true">
      <photo-consumer v-for="(src, index) in imgList" :intro="src" :key="src" :src="src">
        <el-button v-if="index === 0" text class="pre-image" @click="this.drawer = false"
          >查看图像</el-button
        >
      </photo-consumer>
    </photo-provider>
    <el-divider />
    <div class="upload" v-if="isCurrentUser">
      <el-upload
        ref="uploadRef"
        :action="uploadUrl"
        :data="uploadData"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :on-preview="handlePreview"
        :limit="1"
      >
        <template #trigger>
          <el-button class="select-image" text>从相册选择</el-button>
        </template>
      </el-upload>
    </div>
  </van-action-sheet>
  <div class="block" v-if="!isCurrentUser && !loading.skeleton"></div>
  <div class="footer" v-if="!isCurrentUser && !loading.skeleton">
    <el-button color="#d1edc4" round class="chat" @click="openChat">
      <template #icon>
        <el-icon><i-ep-ChatRound /></el-icon>
      </template>
      私信
    </el-button>
    <div>
      <el-button
        color="#faecd8"
        round
        class="follow"
        v-if="isFollowOtherUser"
        @click="unFollowUser"
      >
        <template #icon>
          <el-icon>
            <i-ep-Switch v-if="isFollowEachOther" />
            <i-ep-Check v-else-if="isFollowOtherUser" />
          </el-icon>
        </template>
        取消关注
      </el-button>
      <el-button
        color="#faecd8"
        round
        class="follow"
        v-else
        :loading="loading.follow"
        @click="followUser"
      >
        <template #icon>
          <el-icon><i-ep-Plus /></el-icon>
        </template>
        关注
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-info {
  font-size: 0.9rem;
  color: #9d9d9d;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}
:deep(.el-card__body) {
  padding: 10px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  color: #000000;
}
.user-info .el-row {
  margin-bottom: 10px;
}
.el-card {
  margin-bottom: 10px;
}
.el-pagination {
  float: right;
}

.PhotoConsumer {
  width: 100%;
}
.pre-image {
  width: 100%;
  height: 40px;
  font-size: 0.9rem;
  margin-top: 2px;
}
.upload {
  width: 100%;
  text-align: center;
  height: 33px;
}

.select-image {
  width: 100%;
  font-size: 0.9rem;
}
.el-divider {
  margin: 2px 0px 2px 0px;
}
.item {
  width: 20%;
  margin-top: 20px;
}

.skeleton-item {
  width: v-bind(skeletonItemWidth);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.block {
  margin-bottom: 33px;
}
.footer {
  position: fixed;
  bottom: 10px;
  background-color: #ffffff;
  padding: 10px;
  height: 40px;
  width: 86%;
  display: flex;
  justify-content: space-between;
  div,
  .chat {
    width: 48%;
    height: 40px;
  }
  .follow {
    width: 100%;
    height: 40px;
  }
}
:deep(.el-statistic__head) {
  font-size: 0.9rem;
}
.el-statistic {
  width: 30px;
  text-align: center;
}
</style>
