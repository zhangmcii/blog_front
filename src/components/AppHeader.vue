<script>
import { useCurrentUserStore } from '@/stores/currentUser'
export default {
  data() {
    return {}
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  computed: {
    login() {
      this.currentUser.loadUserName()
      return this.currentUser.username != ''
    },
    isCommentManage() {
      return this.currentUser.roleId >= 2
    },
    isConfirmed() {
      return this.currentUser.isConfirmed == 'true'
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.userName = to.params.userName
      vm.$nextTick(() => {})
    })
  },
  mounted() {
    this.currentUser.loadUserName()
    this.currentUser.loadRoleId()
    this.currentUser.loadConfirmed()
  },
  methods: {
    log_out() {
      localStorage.removeItem('token')
      localStorage.removeItem('currentUserName')
      localStorage.removeItem('isAdmin')
      localStorage.removeItem('roleId')
      localStorage.removeItem('userName')
      localStorage.removeItem('isConfirmed')
      // 更新pinia
      this.currentUser.loadUserName()
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
  <el-row justify="space-between">
    <el-col :xs="4" :sm="6" :md="4" :lg="3" :xl="1">
      <el-link :underline="false" @click="this.$router.push('/posts')">主页</el-link>
    </el-col>
    <el-col v-show="login" :xs="6" :sm="6" :md="4" :lg="3" :xl="1">
      <el-link :underline="false" @click="this.$router.push(`/user/${currentUser.username}`)"
        >个人资料</el-link
      >
    </el-col>

    <el-col v-show="login" :xs="6" :sm="6" :md="4" :lg="3" :xl="1" v-if="isCommentManage">
      <el-link :underline="false" @click="this.$router.push('/commentManagement')"
        >评论管理</el-link
      >
    </el-col>

    <el-col v-if="!login" :xs="3" :sm="6" :md="4" :lg="3" :xl="1">
      <el-link :underline="false" @click="this.$router.push('/login')">登录</el-link>
    </el-col>
    <el-col v-else :xs="5" :sm="6" :md="4" :lg="3" :xl="1" class="example-showcase">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="dropdown">
          账户
          <el-icon>
            <i-ep-CaretBottom />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="this.$router.push('/changePassword')"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item v-if="isConfirmed" @click="this.$router.push('/changeEmail')"
              >修改邮箱</el-dropdown-item
            >
            <el-dropdown-item @click="this.$router.push('/bindEmail')" v-else
              >绑定邮箱</el-dropdown-item
            >
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
  font-size: 1rem;
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
