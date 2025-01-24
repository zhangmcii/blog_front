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
  props: {
    headerText: {
      type: String,
      default() {
        return '请输入您的邮箱'
      }
    },
    password: {
      type: String,
      default() {
        return ''
      }
    },
    action: {
      type: String,
      default() {
        return 'confirm'
      }
    }
  },
  data() {
    return {
      form: {
        email: '',
        code: '',
        password: '',
        action: 'bind'
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
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
  computed:{
    isSubmit(){
      return !(this.isEmailValid && this.form.code)
    }
  },
  mounted() {},
  methods: {
    applyCode() {
      this.form.action = this.action
      this.value = Date.now() + 1000 * 60
      this.showButton = !this.showButton
      authApi.applyCode(this.form).then((res) => {
        if (res.data.msg == 'success') {
          this.$message.success('验证码已发送')
        } else {
          this.$message.error(res.data.detail)
        }
      })
    },
    bindEmail() {
      authApi.checkCode(this.form).then((res) => {
        if (res.data.msg == 'success') {
          this.currentUser.saveConfirmed(res.data.isConfirmed)
          this.currentUser.saveRoleId(res.data.roleId)
          this.$message.success('邮箱绑定成功！')
          this.$router.push('/posts')
        } else {
          this.$message.error(res.data.detail)
        }
      })
    },
    changeEmail() {
      authApi.changeEmail(this.form).then((res) => {
        if (res.data.msg == 'success') {
          this.$message.success('邮箱更新成功')
        } else {
          this.$message.error(res.data.detail)
        }
      })
    },
    resetPassword() {
      authApi.resetPassword(this.form).then((res) => {
        if (res.data.msg == 'success') {
          this.$message.success('密码重置成功')
          this.$router.push('/login')
        } else {
          this.$message.error(res.data.detail)
        }
      })
    },
    submitForm() {
      this.loading = true
      if (this.action == 'confirm') {
        this.bindEmail()
      } else if (this.action == 'change') {
        this.form.password = this.password
        this.changeEmail()
      } else if (this.action == 'reset') {
        this.form.password = this.password
        this.resetPassword()
      }
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
    <h1>{{ headerText }}</h1>
    <el-form
      label-position="top"
      label-width="auto"
      :model="form"
      :rules="rules"
      ref="formRef"
      style="max-width: 600px"
    >
      <el-form-item prop="email" label="邮件">
        <el-input v-model="form.email" style="width: 65%" @blur="validateEmail" />
        <el-button @click="applyCode" type="primary" :disabled="!isEmailValid" v-if="showButton">
          发送验证码
        </el-button>
        <el-countdown prefix="重新发送" format="ss" :value="value" @finish="finish" v-else />
      </el-form-item>
      <el-form-item prop="code" label="验证码">
        <el-input v-model="form.code" style="width: 40%" />
      </el-form-item>
      <slot></slot>
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
/* font-size: 16px; */
:deep(.el-statistic__content) {
  font-size: 0.8rem;
  color: #9d9d9d;
}
</style>
