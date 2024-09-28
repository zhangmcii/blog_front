<script>
import commentApi from '@/api/comment/commentApi.js'
import PostCard from '../posts/PostCard.vue'
export default {
  props: {
    postId: {
      type: Number,
      default() {
        return 1
      }
    }
  },
  components: {
    PostCard
  },
  data() {
    return {
      submitComment: {
        author: 'zz',
        body: ''
      },
      comments: {},
      currentPage: 1,
      comments_count: 10
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getComment()
    })
  },
  methods: {
    submit() {
      commentApi.submitComment(this.postId, { body: this.submitComment.body }).then((res) => {
        if (res.data.msg == 'success') {
          this.submitComment.body = ''
          this.comments = res.data.data
          this.currentPage = res.data.currentPage
          this.$message.success('评论成功')
        } else {
          this.$message.error('评论失败')
        }
      })
    },
    getComment(page = 1) {
      commentApi.getComment(this.postId, page).then((res) => {
        if (res.data.msg == 'success') {
          this.comments = res.data.data
          this.comments_count = res.data.total
        }
      })
    },
    handleCurrentChange() {
      this.getComment(this.currentPage)
    }
  }
}
</script>

<template>
  <h4>输入您的评论</h4>
  <el-input v-model="submitComment.body" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" />
  <el-button @click="submit">提交</el-button>
  <PostCard v-for="item in comments" :key="item" :post="item" :func-switch="false" />
  <el-pagination
    v-model:current-page="currentPage"
    :page-size="10"
    layout="total, prev, pager, next"
    :total="comments_count"
    @current-change="handleCurrentChange"
    :hide-on-single-page="true"
    :pager-count="4"
  />
</template>
<style scoped>
.el-card,
.el-row {
  margin: 10px 0px;
}
.el-pagination {
  float: right;
}
.el-button {
  margin: 10px 0px;
}
</style>
