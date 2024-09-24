<script>
import postApi from '@/api/posts/postApi.js'
export default {
  data() {
    return {
      post: {}
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const params = to.params.obj
      vm.post = params ? JSON.parse(decodeURIComponent(params)) : null
      vm.$nextTick(() => {})
    })
  },
  mounted() {},
  methods: {
    modify() {
      postApi.editPost(this.post.id, { content: this.post.body }).then((res) => {
        if (res.data.data == 'success') {
          this.$message.success('修改成功')
          this.$router.push({
            name: 'share',
            params: { obj: encodeURIComponent(JSON.stringify(this.post)) }
          })
        } else {
          this.$message.success('修改失败')
        }
      })
    }
  }
}
</script>

<template>
  <h1>编辑</h1>
  <h4>你在想什么？</h4>
  <el-input
    v-model="post.body"
    :autosize="{ minRows: 2, maxRows: 4 }"
    type="textarea"
    placeholder="发你所想"
  />
  <el-button @click="modify">修改</el-button>
</template>
<style scoped>
.el-button {
  margin-top: 10px;
}
</style>
