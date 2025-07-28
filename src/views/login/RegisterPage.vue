<template>
  <PageHeadBack>
    <h1 style="text-align: center">注册</h1>
    <div class="info">密码通过加密签名(SHA-256)保护，请放心注册</div>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
      <el-form-item prop="user">
        <el-input
          type="text"
          v-model="ruleForm.user"
          autocomplete="off"
          placeholder="用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          autocomplete="off"
          show-password
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="confirmPass">
        <el-input
          type="password"
          v-model="ruleForm.confirmPass"
          autocomplete="off"
          show-password
          placeholder="确认密码"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" round :disabled="!isChange" :loading="loading" @click="register"
          >注册</el-button
        >
      </el-form-item>
    </el-form>
  </PageHeadBack>
</template>

<script>
import authApi from '@/api/auth/authApi.js'
import confetti from 'canvas-confetti'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
import imageCfg from '@/config/image.js'

export default {
  components: {
    PageHeadBack
  },
  name: 'RegisterPage',
  data() {
    var validateUser = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9_@.\-]{3,16}$/
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (value.length < 3) {
        callback(new Error('账号长度不能少于3个字符'))
      } else if (!reg.test(value)) {
        callback(new Error('账号只能包含大小写字母、数字和_@.-字符'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9_@.\-]{3,16}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 3) {
        callback(new Error('密码长度应该在3到16个字符之间'))
      } else if (!reg.test(value)) {
        callback(new Error('密码只能包含大小写字母、数字和_@.-字符'))
      } else {
        callback()
      }
    }
    var validateConfirmPass = (rule, value, callback) => {
      if (value !== this.ruleForm.password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        user: '',
        password: '',
        confirmPass: '',
        email: ''
      },
      rules: {
        user: [{ required: true, validator: validateUser, trigger: 'blur' }],
        password: [{ required: true, validator: validatePass, trigger: 'blur' }],
        confirmPass: [{ required: true, validator: validateConfirmPass, trigger: 'blur' }]
      },
      isChange: false,
      loading: false
    }
  },
  watch: {
    ruleForm: {
      deep: true,
      handler() {
        this.isChange = true
      }
    }
  },
  methods: {
    // 封装验证方法为 Promise
    validateForm() {
      return new Promise((resolve) => {
        this.$refs.ruleForm.validate((valid) => {
          resolve(valid)
        })
      })
    },
    async register() {
      const valid = await this.validateForm()
      if (valid) {
        this.loading = true
        const image = await imageCfg.random()
        authApi
          .register({
            email: this.ruleForm.email,
            username: this.ruleForm.user,
            password: this.ruleForm.password,
            image: image
          })
          .then((res) => {
            this.loading = false
            if (res.data.msg == 'success') {
              this.congratulation()
              this.$message.success('注册成功')
              setTimeout(() => {
                this.$router.push({
                  path: '/login',
                  query: {
                    username: this.ruleForm.user
                  },
                  hash: false
                })
              }, 700)
            } else {
              this.$message.error(res.data.detail)
            }
          })
      } else {
        this.$message.error('请修正表单中的错误')
      }
    },
    congratulation() {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }
}
</script>

<style scoped>
body {
  margin: 0;
}
#login-container {
  width: 400px;
  height: 290px;
  background: #e5e9f2;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -220px;
  margin-top: -170px;
  border-radius: 5px;
  padding-top: 40px;
  padding-right: 40px;
}
.info {
  font-size: 0.9rem;
  color: gray;
  text-align: center;
  margin-bottom: 50px;
}
.el-button {
  width: 100%;
}
</style>
