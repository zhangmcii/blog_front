<script>
import authApi from '@/api/auth/authApi.js'
import EmailPage from './EmailPage.vue'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
export default {
  components: {
    EmailPage,
    PageHeadBack
  },
  data() {
    return {
      form: {
        password: ''
      }
    }
  },
  methods: {
    submitForm() {
      authApi.changeEmail(this.form).then((res) => {
        if (res.data.msg == 'success') {
          this.$message.success('邮箱更换成功!')
          this.$router.push('/posts')
        } else {
          this.$message.error(res.data.detail)
        }
      })
    }
  }
}
</script>

<template>
  <PageHeadBack>
  <EmailPage header-text="更换您的邮箱地址" :password="form.password" action="change">
    <el-form-item prop="password" label="密码">
      <el-input v-model="form.password" type="password" />
    </el-form-item>
  </EmailPage>
</PageHeadBack>
</template>
<style scoped></style>
