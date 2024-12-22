<script>
import commentApi from '@/api/comment/commentApi.js'
export default {
  data() {
    return {
      currentComment: {
        author: '李四',
        body: '不经巨大的困难，不会有伟大的事业。'
      },
      replyData: ''
    }
  },
  computed: {
    title() {
      return '回复' + this.currentComment.author
    }
  },
  mounted() {
    const comment = localStorage.getItem('currentComment')
    this.currentComment = JSON.parse(comment)
  },
  methods: {
    // 回退页面
    onBack() {
      this.$router.back()
    },
    publish() {
      commentApi.submitComment(this.currentComment.postId, { body: this.replyData, parentCommentId: this.currentComment.id}).then((res) => {
        if (res.data.msg == 'success') {
            this.$message.success('发布成功')
            this.$router.back()
        } else {
          this.$message.error(res.data.detail)
        }
      })
    }
  }
}
</script>

<template>
  <el-page-header @back="onBack" title="评论">
    <template #extra>
      <el-button text :disabled="!replyData" @click="publish">发布</el-button>
    </template>
  </el-page-header>

  <el-text> {{ title }}</el-text>
  <el-card class="comment">
    {{ currentComment.body }}
  </el-card>

  <el-input
    v-model="replyData"
    :rows="15"
    type="textarea"
    maxlength="250"
    show-word-limit
    :placeholder="title"
  />
</template>
<style scoped>
.el-page-header {
  margin-bottom: 10px;
}
.el-text {
  color: #71717a;
}
.el-card {
  font-size: 0.8rem;
}
.comment {
  margin: 20px 0px;
}
.reply-input {
  width: 100%;
}
</style>
