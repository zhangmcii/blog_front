<script>
import { defineAsyncComponent } from 'vue'
import commentApi from '@/api/comment/commentApi.js'
import { useCurrentUserStore } from '@/stores/currentUser'
import emitter from '@/utils/emitter.js'
import WaitData from '@/utils/components/WaitData.vue'
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
    PostCard: defineAsyncComponent(() => import('../posts/PostCard.vue')),
    WaitData
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
      loading: false,
      allLoaded: false,

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
    emitter.on('scroll', () => {
      if (!this.loading && !this.allLoaded) {
        this.getComment()
      }
    })
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
      commentApi.getComment(this.postId, this.currentPage).then((res) => {
        if (res.data.msg == 'success') {
          this.loading = false
          const d = res.data.data
          if (d.length < this.pageSize) {
            this.allLoaded = true // 如果返回的数据不足一页，标记为全部加载
          }
          this.comments = [...this.comments, ...d]
          this.currentPage++
        }
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
  <el-row v-if="currentUser.token != ''">
    <el-col :span="24">
      <el-divider content-position="left">输入您的评论</el-divider>
      <el-input
        v-model="submitComment.body"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
      />
      <el-button class="submit-button" :disabled="!submitComment.body" @click="submit">提交</el-button>
    </el-col>
  </el-row>

  <el-row>
    <el-divider content-position="left" v-if="comments.length">全部评论</el-divider>
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
    <WaitData content="加载中..." :stop_loading="loading" />
    <div class="no-more-comment">
      <el-text v-if="allLoaded">没有更多内容了</el-text>
    </div>
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
.no-more-comment {
  width: 100%;
  text-align: center;
  /* display: flex;
  justify-content: center; */
}
</style>
