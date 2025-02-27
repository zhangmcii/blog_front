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
    var validateOldPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入原密码'))
      } else {
        callback()
      }
    }

    var validateNewPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'))
      } else if (value.length < 3) {
        callback(new Error('新密码长度不能少3个字符'))
      } else {
        callback()
      }
    }

    var validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.form.newPassword) {
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
        oldPassword: [{required: true, validator: validateOldPassword, trigger: 'blur' }],
        newPassword: [{required: true, validator: validateNewPassword, trigger: 'blur' }],
        confirmNewPassword: [{required: true, validator: validateConfirmPassword, trigger: 'blur' }]
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          authApi.changePassword(this.form).then((res) => {
            this.loading = false
            this.isChange = false
            if (res.data.msg == 'success') {
              this.$message.success('修改密码成功')
              this.log_out()
            } else {
              this.$message.error(res.data.detail)
            }
          })
        } else {
          this.$message.error('请修正表单中的错误')
        }
      })
    },
    log_out() {
      localStorage.removeItem('token')
      localStorage.removeItem('currentUserName')
      localStorage.removeItem('isAdmin')
      localStorage.removeItem('roleId')
      localStorage.removeItem('userName')
      localStorage.removeItem('isConfirmed')
      localStorage.removeItem('currentComment')
      localStorage.removeItem('image')
      // 更新pinia
      this.currentUser.loadUserName()
      // 退出后跳转到主页面 隐藏发布文章区域
      this.currentUser.loadToken()
      this.$router.push('/login')
    }
  }
}
</script>

<template>
  <PageHeadBack>
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
        <el-input v-model="form.oldPassword" type="password" show-password />
      </el-form-item>
      <el-form-item prop="newPassword" label="新密码">
        <el-input v-model="form.newPassword" type="password" show-password />
      </el-form-item>
      <el-form-item prop="confirmNewPassword" label="确认新密码">
        <el-input v-model="form.confirmNewPassword" type="password" show-password />
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
