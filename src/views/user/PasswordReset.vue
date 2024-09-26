<script>
import EmailPage from './EmailPage.vue'
export default {
  components: {
    EmailPage
  },
  data() {
    return {
      form: {
        password: ''
      }
    }
  },
  mounted() {},
  methods: {}
}
</script>

<template>
  <EmailPage header-text="重置您的密码" :password="form.password" action="reset">
    <el-form-item prop="password" label="密码">
      <el-input v-model="form.password" />
    </el-form-item>
  </EmailPage>
</template>
<style scoped></style>
