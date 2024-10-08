<script>
import editApi from '@/api/user/editApi.js'
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
      loading: false,
      isChange: false
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const params = to.params.obj
      vm.formLabelAlign = params ? JSON.parse(decodeURIComponent(params)) : null
      vm.originalForm = params ? JSON.parse(decodeURIComponent(params)) : null
      vm.$nextTick(() => {})
    })
  },
  mounted() {},
  watch: {
    formLabelAlign: {
      deep: true,
      handler(newVal) {
        this.isChange = JSON.stringify(newVal) !== JSON.stringify(this.originalForm)
      }
    }
  },
  methods: {
    getUserInfo() {},
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
      <ButtonClick
        content="提交"
        type="primary"
        :disabled="!isChange"
        :loading="loading"
        @do-search="submit"
      />
    </el-form-item>
  </el-form>
</template>
<style scoped></style>
