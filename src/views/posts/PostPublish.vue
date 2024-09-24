<script>
import postApi from '@/api/posts/postApi.js'
export default {
  emits: ['postsResult', 'loadingBegin'],
  data() {
    return {
      content: '',
      posts: []
    }
  },
  mounted() {},
  methods: {
    publish() {
      this.$emit('loadingBegin', true)
      postApi.publish_post({ content: this.content }).then((res) => {
        this.$emit('postsResult', res)
        this.$message.success('发布成功!')
      })
    }
  }
}
</script>

<template>
  <h4>你在想什么？</h4>
  <el-input
    v-model="content"
    :autosize="{ minRows: 2, maxRows: 4 }"
    type="textarea"
    placeholder="发你所想"
  />
  <el-button @click="publish">发布</el-button>
</template>
<style scoped>
:deep(.el-card__body) {
  padding: 5px;
}
.el-input {
  width: 100%;
}
.el-button {
  margin: 10px 0px;
  letter-spacing: 0.05em;
}
</style>
