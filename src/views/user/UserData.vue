<script>
import userApi from '@/api/user/userApi.js'
import common from '@/utils/common.js'
import { useUserStore } from '@/stores/user'
export default {
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
        admin: false
      }
    }
  },
  setup() {
    const currentUser = useUserStore()
    console.log('current', currentUser.isAdmin)
    return { currentUser }
  },
  computed: {
    name_or_location() {
      return this.user.name || this.user.location
    },
    member_since() {
      return this.$dayjs(this.user.member_since).format('YYYY-MM-DD')
    },
    from_now() {
      const time = this.$dayjs(this.user.last_seen).format('YYYY-MM-DD HH:mm:ss')
      console.log(time)
      if (common.isYesterday(time)) {
        return `昨天 ${this.$dayjs(time).format('HH:mm')}`
      }
      return this.$dayjs(time).fromNow()
    }
  },
  mounted() {
    this.getUserData(this.userName)
    // 页面刷新手动加载一次pinia
    this.currentUser.loadAdmin()
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.userName = to.params.userName
      vm.$nextTick(() => {})
    })
  },
  methods: {
    getUserData(userName) {
      if (!userName) {
        this.$message.error('要显示资料的用户名为空！')
        return
      }
      userApi.get_user(userName).then((res) => {
        this.user = res.data.data
      })
    },
    editProfile() {
      this.$router.push({
        name: 'editProfile',
        params: { obj: encodeURIComponent(JSON.stringify(this.user)) }
      })
    },
    editProfileAdmin() {
      this.$router.push({
        name: 'editProfileAdmin',
        params: { obj: encodeURIComponent(JSON.stringify(this.user)) }
      })
    }
  }
}
</script>

<template>
  <el-card style="width: 300px">
    <h1>{{ userName }}</h1>
    <p v-if="name_or_location">
      <span v-if="user.name">{{ user.name }}</span>
      <span v-if="user.location"> 城市 {{ user.location }} </span>
    </p>
    <p v-if="user.email">{{ user.email }}</p>
    <p v-if="user.about_me">{{ user.about_me }}</p>
    <p>生日 {{ member_since }}. 上线时间 {{ from_now }}.</p>
    <el-row v-if="user.username == currentUser.username">
      <el-button @click="editProfile">编辑资料</el-button>
    </el-row>
    <el-row v-if="currentUser.isAdmin == 'true'">
      <el-button type="danger" @click="editProfileAdmin">编辑资料 [管理员]</el-button>
    </el-row>
  </el-card>
</template>

<style scoped></style>
