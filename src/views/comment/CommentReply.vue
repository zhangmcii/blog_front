<script>
import commentApi from '@/api/comment/commentApi.js'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
export default {
  components: {
    PageHeadBack
  },
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
    goBack() {
      this.$router.back()
    },
    publish() {
      commentApi
        .submitComment(this.currentComment.postId, {
          body: this.replyData,
          parentCommentId: this.currentComment.id
        })
        .then((res) => {
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
  <PageHeadBack title="评论">
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
  </PageHeadBack>
</template>
<style scoped>
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
