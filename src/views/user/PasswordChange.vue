<script>
import authApi from '@/api/auth/authApi.js'
import ButtonClick from '@/utils/components/ButtonClick.vue'
export default {
  components: {
    ButtonClick
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value != this.form.newPassword) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      rules: {
        confirmNewPassword: [{ validator: validatePass, trigger: 'blur' }]
      },
      loading: false,
      isChange: false
    }
  },
  watch: {
    form: {
      deep: true,
      handler() {
        this.isChange = true
      }
    }
  },
  methods: {
    submitForm() {
      this.loading = true
      authApi.changePassword(this.form).then((res) => {
        this.loading = false
        this.isChange = false
        if (res.data.msg == 'success') {
          this.$message.success('修改密码成功')
          this.$router.push('/posts')
        } else {
          this.$message.success(res.data.detail)
        }
      })
    }
  }
}
</script>

<template>
  <h1>修改密码</h1>
  <el-form
    :model="form"
    label-position="top"
    :rules="rules"
    ref="form"
    label-width="auto"
    style="max-width: 600px"
  >
    <el-form-item prop="oldPassword" label="原密码">
      <el-input v-model="form.oldPassword" type="password" />
    </el-form-item>
    <el-form-item prop="newPassword" label="新密码">
      <el-input v-model="form.newPassword" type="password" />
    </el-form-item>
    <el-form-item prop="confirmNewPassword" label="确认新密码">
      <el-input v-model="form.confirmNewPassword" type="password" />
    </el-form-item>
    <el-form-item>
      <!-- <el-button type="primary" @click="submitForm"> 提交 </el-button> -->
      <ButtonClick
        content="提交"
        type="primary"
        :disabled="!isChange"
        :loading="loading"
        @do-search="submitForm"
      />
    </el-form-item>
  </el-form>
</template>
<style scoped></style>
