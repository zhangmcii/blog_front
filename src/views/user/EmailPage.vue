<script>
import authApi from '@/api/auth/authApi.js'
import { useCurrentUserStore } from '@/stores/currentUser'
import ButtonClick from '@/utils/components/ButtonClick.vue'
export default {
  components: {
    ButtonClick
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
  watch: {
    form: {
      deep: true,
      handler() {
        this.isChange = true
      }
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
      console.log('倒计时结束')
      this.showButton = !this.showButton
    }
  }
}
</script>

<template>
  <h1>{{ headerText }}</h1>
  <el-form
    label-position="top"
    label-width="auto"
    :model="form"
    ref="form"
    style="max-width: 600px"
  >
    <el-form-item
      prop="email"
      label="邮件"
      :rules="[
        {
          type: 'email',
          message: '请输入正确的邮件地址',
          trigger: ['blur', 'change']
        }
      ]"
    >
      <el-input v-model="form.email">
        <template #append>
          <el-button @click="applyCode" v-if="showButton"> 发送验证码 </el-button>
          <el-countdown prefix="重新发送" format="ss" :value="value" @finish="finish" v-else />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="code" label="验证码">
      <el-input v-model="form.code" style="width: 40%" />
    </el-form-item>
    <slot></slot>
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
<style scoped>
/* font-size: 16px; */
:deep(.el-statistic__content) {
  font-size: 0.8rem;
  color: #9d9d9d;
}
</style>
