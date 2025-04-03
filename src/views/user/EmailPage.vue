<script>
import authApi from '@/api/auth/authApi.js'
import { useCurrentUserStore } from '@/stores/currentUser'
import ButtonClick from '@/utils/components/ButtonClick.vue'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
export default {
  components: {
    ButtonClick,
    PageHeadBack
  },
  data() {
    return {
      form: {
        email: '',
        code: '',
        password: '',
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      isEmailValid: false,
      value: '',
      showButton: true,
      loading: false,
      isChange: false
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  computed: {
    isSubmit() {
      return !(this.isEmailValid && this.form.code)
    }
  },
  mounted() {},
  methods: {
    applyCode() {
      this.value = Date.now() + 1000 * 60
      this.showButton = !this.showButton
      const loadingInstance = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      authApi.applyCode(this.form).then((res) => {
        if (res.data.msg == 'success') {
          this.$message.success('验证码已发送')
        } else {
          this.$message.error(res.data.detail)
        }
        loadingInstance.close()
      }).catch(() => {
        this.$message.error('网络错误，请稍后再试')
        loadingInstance.close()
      })
    },
    bindEmail() {
      authApi.checkCode(this.form).then((res) => {
        if (res.data.msg == 'success') {
          this.currentUser.userInfo.isConfirmed = res.data.isConfirmed
          this.currentUser.userInfo.roleId = res.data.roleId
          this.$message.success('邮箱绑定成功！')
          this.$router.push('/posts')
        } else {
          this.$message.error(res.data.detail)
        }
      })
    },
    submitForm() {
      this.loading = true
      this.bindEmail()
      this.loading = false
      this.isChange = false
    },
    finish() {
      this.showButton = !this.showButton
    },
    validateEmail() {
      if (this.$refs.formRef) {
        this.$refs.formRef.validateField('email', (errorMessage) => {
          this.isEmailValid = errorMessage
        })
      }
    }
  }
}
</script>

<template>
  <PageHeadBack>
    <h1>请输入您的邮箱</h1>
    <el-form
      label-position="top"
      label-width="auto"
      :model="form"
      :rules="rules"
      ref="formRef"
      style="max-width: 600px"
    >
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="form.email" style="width: 65%" @blur="validateEmail" />
        <el-button @click="applyCode" type="primary" :disabled="!isEmailValid" v-if="showButton">
          发送验证码
        </el-button>
        <el-countdown prefix="重新发送" format="ss" :value="value" @finish="finish" v-else />
      </el-form-item>
      <el-form-item prop="code" label="验证码">
        <el-input v-model="form.code" style="width: 40%" />
      </el-form-item>
      <el-form-item>
        <ButtonClick
          content="提交"
          type="primary"
          :disabled="isSubmit"
          :loading="loading"
          @do-search="submitForm"
        />
      </el-form-item>
    </el-form>
  </PageHeadBack>
</template>
<style scoped>
:deep(.el-statistic__content) {
  font-size: 0.8rem;
  color: #9d9d9d;
}
</style>