<script>
import authApi from '@/api/auth/authApi.js'
import { useCurrentUserStore } from '@/stores/user'
export default {
  data() {
    var validateUser = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账户'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        user: '',
        pass: ''
      },
      rules: {
        user: [{ validator: validateUser, trigger: 'blur' }],
        pass: [{ validator: validatePass, trigger: 'blur' }]
      },
      // 是否记住账号密码
      isRemember: false,
      loading: false
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (to.query?.username) {
        vm.ruleForm.user = to.query.username
      } else {
        vm.getAccount()
      }
    })
  },
  computed: {
    formHasValue() {
      return this.ruleForm.user !== '' && this.ruleForm.pass !== ''
    }
  },
  methods: {
    login() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          authApi.login(this.ruleForm.user, this.ruleForm.pass).then((res) => {
            if (res.data.msg == 'success') {
              this.loading = false
              // 判断是否勾选记住密码
              this.hasRemember()
              const u = res.data.data
              this.currentUser.userInfo = u
              this.$message({
                message: '登录成功',
                type: 'success',
                duration: 1700
              })
              this.$router.push({ path: '/posts' })
              return
            }
            this.loading = false
            this.$message({
              message: '账号或密码错误',
              type: 'error',
              duration: 1700
            })
          })
        } else {
          this.$message.error('请修正表单中的错误')
        }
      })
    },
    //  检查本地存储是否有记住的账号密码，如果有则填充到输入框中
    getAccount() {
      const savedUsername = localStorage.getItem('loginUsername')
      const savedPassword = localStorage.getItem('loginPassword')
      if (savedUsername && savedPassword) {
        this.ruleForm.user = savedUsername
        this.ruleForm.pass = savedPassword
        this.isRemember = true
      }
    },
    // 判断是否勾选记住密码
    hasRemember() {
      if (this.isRemember) {
        // 保存账号密码到本地存储
        localStorage.setItem('loginUsername', this.ruleForm.user)
        localStorage.setItem('loginPassword', this.ruleForm.pass)
      } else {
        // 清除本地存储的账号密码
        localStorage.removeItem('loginUsername')
        localStorage.removeItem('loginPassword')
      }
    }
  }
}
</script>

<template>
  <div class="header">
    <h2>欢迎回来 👋🏻</h2>
    <p>请输入您的账号信息来开始您的博客之旅</p>
  </div>

  <el-form
    :model="ruleForm"
    label-position="left"
    status-icon
    :rules="rules"
    ref="ruleForm"
    style="max-width: 600px"
  >
    <el-form-item prop="user">
      <el-input v-model="ruleForm.user" size="large" placeholder="请输入用户名" />
    </el-form-item>
    <el-form-item prop="pass">
      <el-input v-model="ruleForm.pass" show-password size="large" placeholder="密码" />
    </el-form-item>
  </el-form>
  <el-row justify="space-between">
    <el-col :span="4"><el-checkbox label="记住密码" v-model="isRemember"></el-checkbox></el-col>
    <el-col :span="6"
      ><div class="text">
        <el-link class="forget-pass" @click="$router.push('/resetPassword')">忘记密码？</el-link>
      </div></el-col
    >
  </el-row>

  <el-button type="primary" round :disabled="!formHasValue" @click="login" :loading="loading"
    >登录</el-button
  >

  <!-- <el-divider> 其他登录方式 </el-divider> -->
  <div class="register-container">
    <el-text class="register-account">还没有账号?</el-text>
    <el-link class="register" @click="$router.push('/register')">创建账号 </el-link>
  </div>
   <div class="visit">
    <el-text class="register" @click="$router.push('/posts')">游客访问</el-text>
  </div>
</template>

<style scoped>
* {
  font-family: -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, 'Helvetica Neue', arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  /* color: #323639; */
  font-size: 14px;
  /* 移动端点击可点击元素时，出现蓝色默认背景色 */
  -webkit-tap-highlight-color: transparent;
  padding-left: 3px;
}
a,
button,
input,
textarea {
  outline: None;
}
.el-button {
  width: 95%;
  letter-spacing: 2px;
  margin-left: 9px;
}
:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #323639;
}

.text {
  height: 90%;
  height: 32px;
  display: grid;
  align-content: center;
}
.forget-pass,
.register {
  color: #006be6;
}
.el-checkbox,
.register-account {
  color: #323639;
}
h2 {
  font-size: 30px;
  color: #323639;
  margin: 0px 0px 12px 0px;
}
p {
  color: #71717a;
}
.el-form-item {
  padding-bottom: 0.8rem;
}
.el-input {
  height: 38px;
}
:deep(.el-input__wrapper) {
  border-radius: 7px;
}
.register-container {
  width: 95%;
  display: flex;
  justify-content: center;
  margin-top: 3vh;
}
.el-form {
  width: 95%;
}
.header {
  margin-top: 5vh;
}

.header,
.el-form,
.el-row,
.el-button {
  margin-bottom: 0.8rem;
}
.visit {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
