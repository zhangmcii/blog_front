<script>
import { useCurrentUserStore } from '@/stores/currentUser'
export default {
  data() {
    return {}
  },
  setup() {
    const user = useCurrentUserStore()
    return { user }
  },
  computed: {
    login() {
      this.user.loadUserName()
      return this.user.username != ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.userName = to.params.userName
      vm.$nextTick(() => {})
    })
  },
  mounted() {
    this.user.loadUserName()
  },
  methods: {
    log_out() {
      localStorage.removeItem('token')
      localStorage.removeItem('currentUserName')
      localStorage.removeItem('isAdmin')
      localStorage.removeItem('userName')
      // 更新pinia
      this.user.loadUserName()
      console.log('33', this.user.username)
      this.$message.success('已退出')
      this.$router.push('/posts')
    },
    handleCommand(command) {
      if (command == 'exit') {
        this.log_out()
      }
    }
  }
}
</script>

<template>
  <el-row>
    <el-col :xs="4" :sm="6" :md="4" :lg="3" :xl="1">
      <el-link :underline="false" @click="this.$router.push('/posts')">主页</el-link>
    </el-col>
    <el-col v-show="login" :xs="6" :sm="6" :md="4" :lg="3" :xl="1">
      <el-link :underline="false" @click="this.$router.push(`/user/${user.username}`)"
        >个人资料</el-link
      >
    </el-col>

    <!-- <el-col v-show="login" :xs="6" :sm="6" :md="4" :lg="3" :xl="1">
      <el-link :underline="false" @click="this.$router.push(`/user/${user.username}`)">评论管理员</el-link>
    </el-col> -->

    <el-col :push="17" v-if="!login" :xs="3" :sm="6" :md="4" :lg="3" :xl="1">
      <el-link :underline="false" @click="this.$router.push('/login')">登录</el-link>
    </el-col>
    <el-col :push="10" v-else :xs="5" :sm="6" :md="4" :lg="3" :xl="1" class="example-showcase">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="dropdown">
          账户
          <el-icon>
            <i-ep-CaretBottom />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>修改密码</el-dropdown-item>
            <el-dropdown-item>修改邮箱</el-dropdown-item>
            <el-dropdown-item command="exit">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown></el-col
    >
  </el-row>
</template>
<style scoped>
.el-row {
  margin-top: 1vh;
}
.el-link,
.dropdown {
  font-size: 16px;
  color: #9d9d9d;
}
.el-link:hover,
.dropdown:hover {
  color: #ffffff;
}
.example-showcase {
  cursor: pointer;
  color: #9d9d9d;
  display: flex;
  align-items: center;
}
</style>
