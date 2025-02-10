<script>
import authApi from '@/api/auth/authApi.js'
import ButtonClick from '@/utils/components/ButtonClick.vue'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
import { useCurrentUserStore } from '@/stores/currentUser'
export default {
  components: {
    ButtonClick,
    PageHeadBack
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
        username: '',
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
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
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
      showConfirmDialog({
        title: '修改用户的密码？',
        width: 230,
        confirmButtonColor:'red',
        beforeClose: this.beforeClose
      })
    },
    beforeClose(action) {
      if (action !== 'confirm') {
        return Promise.resolve(true)
      } else {
        return authApi.helpChangePassword(this.form).then((res) => {
          this.isChange = false
          if (res.data.msg == 'success') {
            this.$message.success('该用户密码修改成功')
          } else {
            this.$message.error(res.data.detail)
          }
          return res
        })
      }
    }
  }
}
</script>

<template>
  <PageHeadBack>
    <h1>找回其他用户密码</h1>
    <el-form
      :model="form"
      label-position="top"
      :rules="rules"
      ref="form"
      label-width="auto"
      style="max-width: 600px"
    >
      <el-form-item prop="username" label="用户账号">
        <el-input v-model="form.username"  />
      </el-form-item>
      <el-form-item prop="newPassword" label="新密码">
        <el-input v-model="form.newPassword" type="password" show-password/>
      </el-form-item>
      <el-form-item prop="confirmNewPassword" label="确认新密码">
        <el-input v-model="form.confirmNewPassword" type="password" show-password/>
      </el-form-item>
      <el-form-item>
        <ButtonClick
          content="提交"
          type="primary"
          :disabled="!isChange"
          :loading="loading"
          @do-search="submitForm"
        />
      </el-form-item>
    </el-form>
  </PageHeadBack>
</template>
<style scoped></style>
