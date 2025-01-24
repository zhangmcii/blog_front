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
      comments: [],

      currentPage: 1,
      pageSize: 10,
      allLoaded: false,

      drawer: false,
      currentComment: '',
      actions: [{ name: '回复', callback: this.jumpReplyPage }, { name: '复制' }],
      
      loading: false,
      finished: false,
      error: false
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.getComment()
    // })
    this.currentUser.loadToken()
  },
  methods: {
    submit() {
      commentApi.submitComment(this.postId, { body: this.submitComment.body }).then((res) => {
        if (res.data.msg == 'success') {
          this.comments.push(res.data.data.at(-1))
          this.submitComment.body = ''
          this.$message.success('评论成功')
        } else {
          this.$message.error(res.data.detail)
        }
      })
    },
    getComment() {
      this.loading = true
      commentApi
        .getComment(this.postId, this.currentPage)
        .then((res) => {
          if (res.data.msg == 'success') {
            res.data.data.map((item) => {
              this.comments.push(item)
            })
          }
          this.loading = false
          this.currentPage++
          if (this.comments.length >= res.data.total) {
            this.finished = true
          }
        })
        .catch(() => {
          this.loading = false
          this.error = true
          this.finished = true
        })
    },
    showDrawer(commentData) {
      if (commentData.disabled || this.currentUser.token == '') {
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
  <el-row>
    <el-col :span="24">
      <el-divider content-position="left">输入您的评论</el-divider>
      <div v-if="currentUser.token != ''">
        <el-input
          v-model="submitComment.body"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        />
        <el-button class="submit-button" :disabled="!submitComment.body" @click="submit"
          >提交</el-button
        >
      </div>
      <div class="not-login" v-else>
        <el-text class="describe">还未登录，</el-text>
        <el-link class="describe-login" @click="$router.push('/login')">去登录？</el-link>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-divider content-position="left" v-if="comments.length">全部评论</el-divider>
    <el-col :span="24">
      <van-list
        v-model:loading="loading"
        v-model:error="error"
        :finished="finished"
        finished-text="没有更多评论了"
        error-text="请求失败，点击重新加载"
        @load="getComment"
      >
        <PostCard
          v-for="item in comments"
          :key="item"
          :post="item"
          :func-switch="false"
          @click="showDrawer(item, $event)"
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
      </van-list>
    </el-col>
    <van-action-sheet
      v-model:show="drawer"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
    />
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
.no-more-comment {
  width: 100%;
  text-align: center;
}

.describe-login {
  color: #006be6;
}

.describe {
  color: #323639;
}
.not-login {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 3vh;
}
</style>
