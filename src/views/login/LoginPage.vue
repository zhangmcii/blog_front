<template>
  <div id="login-container">
    <div style="text-align: center; height: 50px">登录</div>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="user">
        <el-input type="text" v-model="ruleForm.user" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="logined">111</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-row
    >忘记密码？
    <el-link type="primary" @click="this.$router.push('/resetPassword')"
      >点击重新设置密码</el-link
    ></el-row
  >
  <el-row
    >新用户？
    <el-link type="primary" @click="this.$router.push('/register')">点击这里去注册</el-link></el-row
  >
</template>

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
        user: 'zmc',
        pass: 'zmc'
      },
      rules: {
        user: [{ validator: validatePass, trigger: 'blur' }],
        pass: [{ validator: validatePass2, trigger: 'blur' }]
      },
      isLogin: false
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  methods: {
    submitForm() {
      authApi.login(this.ruleForm.user, this.ruleForm.pass).then((res) => {
        if (res.data.msg == '登录成功') {
          localStorage.setItem('token', res.data.token)
          this.currentUser.saveUserName(res.data.username)
          this.currentUser.saveAdmin(res.data.admin)
          this.currentUser.saveRoleId(res.data.roleId)
          this.currentUser.saveConfirmed(res.data.isConfirmed)
          this.$message.success(res.data.msg)
          this.$router.push({ path: '/posts' })
          return
        }
        this.$message.error(res.data.msg)
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    logined() {
      authApi.logined().then((res) => {
        this.$message.success(res.data.msg)
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
</style>
