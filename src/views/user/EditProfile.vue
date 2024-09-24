<script>
import editApi from '@/api/user/editApi.js'
export default {
  data() {
    return {
      formLabelAlign: {
        name: '',
        location: '',
        about_me: ''
      },
      user: {}
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const params = to.params.obj
      vm.formLabelAlign = params ? JSON.parse(decodeURIComponent(params)) : null
      vm.$nextTick(() => {})
    })
  },
  mounted() {},
  methods: {
    getUserInfo() {},
    submit() {
      editApi.editProfile(this.formLabelAlign).then((res) => {
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
    <el-form-item label="昵称" :label-position="itemLabelPosition">
      <el-input v-model="formLabelAlign.name" />
    </el-form-item>
    <el-form-item label="城市" :label-position="itemLabelPosition">
      <el-input v-model="formLabelAlign.location" />
    </el-form-item>
    <el-form-item label="关于我" :label-position="itemLabelPosition">
      <el-input v-model="formLabelAlign.about_me" show-word-limit maxlength="30" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<style scoped></style>
