<script>
import PostCard from './PostCard.vue'
import PostPublish from './PostPublish.vue'
import postApi from '@/api/posts/postApi.js'
import common from '@/utils/common.js'
import { useCurrentUserStore } from '@/stores/currentUser'
export default {
  components: {
    PostCard,
    PostPublish
  },
  data() {
    return {
      activeName: 'all',
      posts: [],
      posts_count: 0,
      loading: false,
      currentPage: 1
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  mounted() {
    this.currentUser.loadUserName()
    this.getPosts(this.currentPage, this.activeName)
  },
  computed: {
    isLogin() {
      return common.isLogined()
    }
  },
  methods: {
    changeTab(tabName) {
      this.getPosts(this.currentPage, tabName)
    },
    handleCurrentChange() {
      this.getPosts(this.currentPage, this.activeName)
    },
    getPosts(page, tabName) {
      postApi.getPosts(page, tabName).then((res) => {
        this.posts = res.data.data
        this.posts_count = res.data.total
      })
    },
    getPostsResult(res) {
      this.posts = res.data.data
      this.posts_count = res.data.total
      this.loading = false
    }
  }
}
</script>

<template>
  <h1>Hello {{ currentUser.username }}</h1>
  <PostPublish @loading-begin="(flag) => (loading = flag)" @posts-result="getPostsResult" />
  <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-change="changeTab">
    <el-tab-pane label="广场" name="all">
      <div v-if="!loading">
        <PostCard v-for="item in posts" :key="item" :post="item" />
      </div>
      <el-skeleton :rows="5" animated :loading="loading" :throttle="500" />
    </el-tab-pane>
    <el-tab-pane label="关注" name="showFollowed" v-if="isLogin">
      <PostCard v-for="item in posts" :key="item" :post="item" />
    </el-tab-pane>
  </el-tabs>

  <el-pagination
    v-model:current-page="currentPage"
    :page-size="10"
    layout="total, prev, pager, next"
    :total="posts_count"
    @current-change="handleCurrentChange"
  />
</template>
<style scoped>
.el-pagination {
  float: right;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
