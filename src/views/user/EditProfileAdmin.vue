<script>
import editApi from '@/api/user/editApi.js'
import ButtonClick from '@/utils/components/ButtonClick.vue'
export default {
  components: {
    ButtonClick
  },
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
      ],
      originalForm: {},
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
  watch: {
    formLabelAlign: {
      deep: true,
      handler(newVal) {
        this.isChange = JSON.stringify(newVal) !== JSON.stringify(this.originalForm)
      }
    }
  },
  mounted() {},
  methods: {
    submit() {
      this.loading = true
      editApi.editProfileAdmin(this.formLabelAlign).then((res) => {
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
    :model="formLabelAlign"
    ref="formLabelAlign"
    label-position="top"
    label-width="auto"
    style="max-width: 600px"
  >
    <el-form-item
      prop="email"
      label="邮件"
      :label-position="itemLabelPosition"
      :rules="[
        {
          type: 'email',
          message: '请输入正确的邮件地址',
          trigger: ['blur', 'change']
        }
      ]"
    >
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
      <el-input v-model="formLabelAlign.about_me" show-word-limit maxlength="30" />
    </el-form-item>
    <el-form-item>
      <!-- <el-button type="primary" @click="submit">提交</el-button> -->
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
