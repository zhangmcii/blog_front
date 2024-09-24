<script>
import editApi from '@/api/user/editApi.js'
export default {
  data() {
    return {
      formLabelAlign: {
        email: '',
        username: '',
        confirmed: '',
        role: '',
        name: '',
        location: '',
        about_me: ''
      },
      user: {},
      roles: [
        {
          value: 1,
          label: '普通用户'
        },
        {
          value: 2,
          label: '内容协调员'
        },
        {
          value: 3,
          label: '管理员'
        }
      ]
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
    submit() {
      editApi.editProfileAdmin(this.formLabelAlign).then((res) => {
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
  <el-form :model="formLabelAlign" label-position="top" label-width="auto" style="max-width: 600px">
    <el-form-item label="邮件" :label-position="itemLabelPosition">
      <el-input v-model="formLabelAlign.email" />
    </el-form-item>
    <el-form-item label="用户名" :label-position="itemLabelPosition">
      <el-input v-model="formLabelAlign.username" />
    </el-form-item>
    <el-form-item label="认证状态" :label-position="itemLabelPosition">
      <el-input v-model="formLabelAlign.confirmed" />
    </el-form-item>
    <el-form-item label="角色" :label-position="itemLabelPosition">
      <el-select v-model="formLabelAlign.role" placeholder="Select" style="width: 240px">
        <el-option
          v-for="item in roles"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="昵称" :label-position="itemLabelPosition">
      <el-input v-model="formLabelAlign.name" />
    </el-form-item>
    <el-form-item label="城市" :label-position="itemLabelPosition">
      <el-input v-model="formLabelAlign.location" />
    </el-form-item>
    <el-form-item label="关于我" :label-position="itemLabelPosition">
      <el-input v-model="formLabelAlign.about_me" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<style scoped></style>
