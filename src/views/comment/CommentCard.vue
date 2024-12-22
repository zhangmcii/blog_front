<script>
import { defineAsyncComponent } from 'vue'
import commentApi from '@/api/comment/commentApi.js'
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
    PostCard: defineAsyncComponent(() => import('../posts/PostCard.vue'))
  },
  data() {
    return {
      submitComment: {
        author: 'zz',
        body: ''
      },
      comments: {},
      currentPage: 1,
      comments_count: 0,
      drawer: false,
      currentComment: ''
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
    },
    showDrawer(commentData) {
      if (commentData.disabled) {
        return
      }
      this.drawer = !this.drawer
      this.currentComment = commentData
      this.currentComment.postId = this.postId
    },
    jumpReplyPage() {
      // 持久化
      let comment = JSON.stringify(this.currentComment)
      localStorage.setItem('currentComment', comment)
      this.$router.push('/reply')
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
      <el-button class="submit-button" @click="submit">提交</el-button>
    </el-col>
  </el-row>

  <el-row>
    <el-divider content-position="left" v-if="comments_count">全部评论</el-divider>
    <el-col :span="24">
      <PostCard
        v-for="item in comments"
        :key="item"
        :post="item"
        :func-switch="false"
        @click="showDrawer(item)"
      >
        <template #default>
          <PostCard
            v-if="item.parent_comment_id"
            :post="comments.find((x) => x.id === item.parent_comment_id)"
            :func-switch="false"
            cardBgColor="rgb(243.9, 244.2, 244.8)"
          >
          </PostCard>
        </template>
      </PostCard>
    </el-col>
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="comments_count"
      @current-change="handleCurrentChange"
      :hide-on-single-page="true"
      :pager-count="5"
    />
    <el-drawer v-model="drawer" direction="btt" :with-header="false" size="15%">
      <el-row
        ><el-button type="primary" text class="comment-button" @click="jumpReplyPage"
          >回复</el-button
        ></el-row
      >
      <el-row><el-button type="primary" text class="comment-button">复制</el-button></el-row>
    </el-drawer>
  </el-row>
</template>
<style scoped>
.el-row {
  margin: 10px 0px;
}
.el-pagination {
  float: right;
}
.submit-button {
  margin: 10px 0px;
}

.comment-button {
  width: 100%;
  font-size: 16px;
  margin-bottom: 10px;
}

:deep(.el-drawer__body) {
  padding: 0px;
}
/* .comment-link:active {
  background: #ccc;
} */
/* .comment-link:hover {
  background: #ccc;
} */
</style>
