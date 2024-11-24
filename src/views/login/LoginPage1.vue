<script>
export default {
  data() {
    return {
      form: {
        account: 'admin',
        pass: 'admin'
      }
    }
  },
  mounted() {},
  methods: {}
}
</script>

<template>
  <div class="header">
    <h2>欢迎回来 🤞🏼</h2>
    <p>请输入您的账号信息来开始您的博客之旅</p>
  </div>

  <el-form :model="form" style="max-width: 600px">
    <el-form-item>
      <el-input v-model="form.account" size="large" placeholder="请输入用户名" />
    </el-form-item>
    <el-form-item>
      <el-input v-model="form.pass" show-password size="large" placeholder="密码" />
    </el-form-item>
  </el-form>
  <el-row justify="space-between">
    <el-col :span="4"><el-checkbox>记住账号</el-checkbox></el-col>
    <el-col :span="6"
      ><div class="text"><el-text class="forget-pass">忘记密码？</el-text></div></el-col
    >
  </el-row>

  <el-button type="primary" round>登录</el-button>

  <el-divider> 其他登录方式 </el-divider>
  <div class="register-container">
    <el-text class="register-account">还没有账号?</el-text>
    <el-text class="register">创建账号 </el-text>
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
.el-checkbox, .register-account {
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
  width: 100%;
  display: flex;
  justify-content: center;
}
.el-form {
   width:95%;
}
.header {
  margin-top: 10vh;
}

.header, .el-form, .el-row,.el-button {
  margin-bottom: 0.8rem;
}
</style>
