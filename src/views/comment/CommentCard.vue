<script>
import commentApi from '@/api/comment/commentApi.js'
import PostCard from '../posts/PostCard.vue'
import { useCurrentUserStore } from '@/stores/currentUser'
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
      comments_count: 0
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  mounted() {
    this.$nextTick(() => {
      this.getComment()
    })
    this.currentUser.loadToken()
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
          this.$message.error(res.data.detail)
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
  <el-row v-if="currentUser.token != ''">
    <el-col :span="24">
      <el-divider content-position="left">输入您的评论</el-divider>
      <el-input
        v-model="submitComment.body"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
      />
      <el-button @click="submit">提交</el-button>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="24">
      <el-divider content-position="left" v-if="comments_count != 0">评论区</el-divider>
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
    </el-col>
  </el-row>
</template>
<style scoped>
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
