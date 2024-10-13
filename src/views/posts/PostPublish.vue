<script>
import postApi from '@/api/posts/postApi.js'
import ButtonClick from '@/utils/components/ButtonClick.vue'
export default {
  emits: ['postsResult', 'loadingBegin'],
  components: {
    ButtonClick
  },
  data() {
    return {
      content: '',
      posts: [],
      loading: false
    }
  },
  mounted() {},
  methods: {
    publish() {
      this.$emit('loadingBegin', true)
      this.loading = true
      postApi.publish_post({ content: this.content }).then((res) => {
        this.loading = false
        this.$emit('postsResult', res)
        if (res.data.msg == 'success') {
          this.content = ''
          this.$message.success('发布成功!')
        } else {
          this.$message.error('发布失败!')
        }
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
    placeholder="书写片段,温润流年。"
  />
  <ButtonClick
    class="custom-button"
    content="发布"
    :disabled="!content"
    :loading="loading"
    @do-search="publish"
  >
    <el-icon><i-ep-Pointer /></el-icon>
  </ButtonClick>
</template>
<style scoped>
:deep(.el-card__body) {
  padding: 5px;
}
.el-input {
  width: 100%;
}
.custom-button {
  margin: 10px 0px;
}
</style>
