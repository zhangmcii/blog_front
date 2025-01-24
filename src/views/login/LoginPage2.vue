<script>
import authApi from '@/api/auth/authApi.js'
import { useCurrentUserStore } from '@/stores/currentUser'
export default {
  name: 'LoginPage',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账户'))
      } else {
        if (this.ruleForm.pass !== '') {
          this.$refs.ruleForm.validateField('pass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        user: 'admin',
        pass: 'admin'
      },
      rules: {
        user: [{ validator: validatePass, trigger: 'blur' }],
        pass: [{ validator: validatePass2, trigger: 'blur' }]
      },
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  computed: {
    formHasValue() {
      return this.ruleForm.user != '' || this.ruleForm.pass != ''
    }
  },
  methods: {
    login() {
      authApi.login(this.ruleForm.user, this.ruleForm.pass).then((res) => {
        if (res.data.msg == '登录成功') {
          this.currentUser.saveToken(res.data.token)
          this.currentUser.saveUserName(res.data.username)
          this.currentUser.saveAdmin(res.data.admin)
          this.currentUser.saveRoleId(res.data.roleId)
          this.currentUser.saveConfirmed(res.data.isConfirmed)
          this.$message({
            message: res.data.msg,
            type: 'success',
            duration: 1700
          })
          this.$router.push({ path: '/posts' })
          return
        }
        this.$message({
          message: res.data.msg,
          type: 'error',
          duration: 1700
        })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<template>
  <div id="login-container">
    <div style="text-align: center; height: 50px">登录</div>
    <el-form
      :model="ruleForm"
      label-position="left"
      status-icon
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="user">
        <el-input
          type="text"
          v-model="ruleForm.user"
          autocomplete="off"
          @keyup.enter="login"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input
          type="password"
          v-model="ruleForm.pass"
          autocomplete="off"
          show-password
          @keyup.enter="login"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="!formHasValue" @click="login"
          >提交</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>

  <el-row
    >忘记密码？
    <el-link type="primary" @click="$router.push('/resetPassword')"
      >点击重新设置密码</el-link
    ></el-row
  >
  <el-row
    >新用户？
    <el-link type="primary" @click="$router.push('/register')">点击这里去注册</el-link></el-row
  >
</template>

<style scoped>
body {
  margin: 0;
}
#login-container {
  width: 85%;
  height: 100%;
  padding: 20px;
  margin: 10vh 0 10vh 0;
  border-radius: 5px;
}
</style>
