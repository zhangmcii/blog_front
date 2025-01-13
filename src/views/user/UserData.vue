<script>
import userApi from '@/api/user/userApi.js'
import authApi from '@/api/auth/authApi.js'
import image from '@/api/user/image.js'
import common from '@/utils/common.js'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useOtherUserStore } from '@/stores/otherUser'
import PostCard from '../posts/PostCard.vue'
import dayjs from 'dayjs'
import { areaList } from '@vant/area-data'
import cityUtil from '@/utils/cityUtil.js'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
import emitter from '@/utils/emitter.js'
export default {
  components: {
    PostCard,
    PageHeadBack
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
        is_following_current_user: false
      },
      posts: {},
      currentPage: 1,
      posts_count: 0,
      followPerm: false,
      loading: {
        userData: false
      },
      uploadData: {
        token: '833|sZnIEsyMrBLLJmgbT2bfHRayahzZGsaqsFv4bbMN',
        album_id: '1442'
      },
      headers: {
        Authorization: 'Bearer 827|hQhMiZ48SRz9iHxOA3Vbw5wWtCgHdyZcHOFH0trU',
        Accept: 'application/json'
      },
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
      if (common.isYesterday(time)) {
        return `昨天 ${dayjs(time).format('HH:mm')}`
      }
      return dayjs(time).fromNow()
    },
    isCurrentUser() {
      return this.user.username == this.currentUser.username
    },
    isAdmin() {
      return this.currentUser.isAdmin == 'true'
    },
    follow() {
      return this.followPerm && this.currentUser.username != this.user.username
    },
    isFollowCurrentUser() {
      return this.currentUser.username && !this.isCurrentUser && this.user.is_following_current_user
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getUserData(this.userName)
    })

    this.getPermission(1)
    // 页面刷新手动加载一次pinia
    this.currentUser.loadUserName()
    this.currentUser.loadAdmin()
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.userName = to.params.userName
      // 持久化保存 防止用户刷新本页面导致传入的username丢失
      vm.otherUser.saveUserName(to.params.userName)
      vm.$nextTick(() => {})
    })
  },
  methods: {
    getUserData(userName, page) {
      this.loading.userData = true
      if (!userName) {
        this.otherUser.loadUserName()
        userName = this.otherUser.username
      }
      if (!userName) {
        this.$message.error('要显示资料的用户名为空！')
        return
      }
      userApi.get_user(userName, page).then((res) => {
        this.loading.userData = false
        this.user = res.data.data
        this.posts = res.data.posts
        this.posts_count = res.data.total
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
      userApi.follow(this.user.username).then((res) => {
        if (res.data.msg == 'success') {
          this.$message.success('关注成功')
          this.user = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    unFollowUser() {
      userApi.unFollow(this.user.username).then((res) => {
        if (res.data.msg == 'success') {
          this.$message.success('已取消关注')
          this.user = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
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
      if (rawFile.size / 1024 / 1024 > 1) {
        this.$message.error('图像的大小不能超过1MB!')
        return false
      }
      return true
    },
    handleAvatarSuccess(response) {
      const url = response.data.links.url
      image.saveImageUrl({ image: url }).then((res) => {
        if (res.data.msg == 'success') {
          emitter.emit('image', url)
          this.$message.success('图像上传成功')
        } else {
          this.$message.error('图像上传失败')
        }
      })
    },
    submitUpload() {
      this.$refs.uploadRef.submit()
    },
    handlePreview(){
      return true
    }
  }
}
</script>

<template>
  <PageHeadBack>
    <el-card class="user-info" shadow="never">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
        </div>
      </template>

      <el-skeleton :rows="5" animated :loading="loading.userData">
        <template #default>
          <el-row v-if="user.name">
            <el-col :xs="6" :xl="4">用户名</el-col>
            <el-col :xs="8" :xl="10" :offset="2">{{ user.name }}</el-col>
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
            <el-col :xs="8" :xl="10" :offset="2">{{ user.about_me }}</el-col>
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
      <el-row>
        <el-col v-if="follow" :span="6">
          <el-button v-if="user.is_followed_by_current_user" @click="unFollowUser"
            >取消关注</el-button
          >
          <el-button v-else @click="followUser">关注</el-button>
        </el-col>
        <el-col :span="4"> </el-col>
        <el-col :span="6">
          <el-statistic title="粉丝" :value="user.followers_count" @click="followerDetail" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="关注" :value="user.followed_count" @click="followedDetail" />
        </el-col>
        <el-col v-if="isFollowCurrentUser">已关注你了！</el-col>
      </el-row>
    </el-card>

    <el-card shadow="never" v-if="isCurrentUser || isAdmin">
      <el-row justify="space-between">
        <el-col v-if="isCurrentUser" :xs="9" :xl="6">
          <el-button @click="editProfile">编辑资料</el-button>
        </el-col>
        <el-col v-if="isAdmin" :xs="12" :xl="12">
          <el-button type="danger" @click="editProfileAdmin">编辑资料 [管理员]</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-upload
      ref="uploadRef"
      action="https://www.helloimg.com/api/v1/upload"
      :headers="headers"
      :data="uploadData"
      :auto-upload="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :on-preview="handlePreview"
    >
      <template #trigger>
        <el-button class="select-image" type="primary">从本机选择图像</el-button>
      </template>
      <el-button class="upload-image" type="success" @click="submitUpload"> 上传图像 </el-button>
    </el-upload>

    <PostCard v-for="item in posts" :key="item" :post="item" />

    <el-pagination
      v-model:current-page="currentPage"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="posts_count"
      @current-change="handleCurrentChange"
      :hide-on-single-page="true"
      :pager-count="5"
    />
  </PageHeadBack>
</template>

<style scoped>
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
.select-image {
  margin: 0px 10px 10px 0px;
}
</style>
