<script>
import editApi from '@/api/user/editApi.js'
import userApi from '@/api/user/userApi.js'
import ButtonClick from '@/utils/components/ButtonClick.vue'
export default {
  components: {
    ButtonClick
  },
  data() {
    return {
      formLabelAlign: {},
      originalForm: {},
      user: {},
      userId: -1,
      loading: false,
      isChange: false
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.userId = to.params.id
      vm.$nextTick(() => {})
    })
  },
  mounted() {
    if (this.userId != -1) {
      this.getUserInfo(this.userId)
    }
  },
  watch: {
    formLabelAlign: {
      deep: true,
      handler(newVal) {
        this.isChange = JSON.stringify(newVal) !== this.originalForm
      }
    }
  },
  methods: {
    getUserInfo(userId) {
      userApi.getUser(userId).then((res) => {
        if (res.data.msg == 'success') {
          this.user = res.data.data
          this.originalForm = JSON.stringify(res.data.data)
          this.formLabelAlign = res.data.data
        }
      })
    },
    submit() {
      this.loading = true
      editApi.editProfile(this.formLabelAlign).then((res) => {
        this.loading = false
        this.isChange = false
        if (res.data.data == 'success') {
          this.$message.success('修改成功')
          this.$router.push(`/user/${this.formLabelAlign.username}`)
        } else {
          this.$message.error('修改失败')
        }
      })
    }
  }
}
</script>

<template>
  <el-form
    ref="formLabelAlign"
    :model="formLabelAlign"
    label-position="top"
    label-width="auto"
    style="max-width: 600px"
  >
    <el-form-item label="昵称" >
      <el-input v-model="formLabelAlign.name" />
    </el-form-item>
    <el-form-item label="城市" >
      <el-input v-model="formLabelAlign.location" />
    </el-form-item>
    <el-form-item label="关于我" >
      <el-input v-model="formLabelAlign.about_me" show-word-limit maxlength="30" />
    </el-form-item>
    <el-form-item>
      <ButtonClick
        content="提交"
        type="primary"
        :loading="loading"
        :disabled="!isChange"
        @do-search="submit"
      />
    </el-form-item>
  </el-form>
</template>
<style scoped></style>
