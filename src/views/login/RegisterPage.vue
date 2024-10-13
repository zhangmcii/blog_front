<template>
  <div style="text-align: center; height: 50px">注册</div>
  <el-form
    :model="ruleForm"
    status-icon
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item label="电子邮件" prop="email">
      <el-input type="text" v-model="ruleForm.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="用户名" prop="user">
      <el-input type="text" v-model="ruleForm.user" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPass">
      <el-input type="password" v-model="ruleForm.confirmPass" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="register">注册</el-button>
    </el-form-item>
  </el-form>
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
        if (this.ruleForm.password !== '') {
          this.$refs.ruleForm.validateField('password')
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
    var validatePass3 = (rule, value, callback) => {
      if (value != this.ruleForm.password) {
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
        user: [{ validator: validatePass, trigger: 'blur' }],
        password: [{ validator: validatePass2, trigger: 'blur' }],
        confirmPass: [{ validator: validatePass3, trigger: 'blur' }]
      }
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  methods: {
    register() {
      authApi
        .register({
          email: this.ruleForm.email,
          username: this.ruleForm.user,
          password: this.ruleForm.password
        })
        .then((res) => {
          if (res.data.msg == 'success') {
            this.$message.success('注册成功')
            this.$router.push('/login')
          } else {
            this.$message.error(res.data.detail)
          }
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
