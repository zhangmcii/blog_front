<script>
import PostCard from './PostCard.vue'
import PostPublish from './PostPublish.vue'
import postApi from '@/api/posts/postApi.js'
import common from '@/utils/common.js'
import { useUserStore } from '@/stores/user'
export default {
  components: {
    PostCard,
    PostPublish
  },
  data() {
    return {
      activeName: 'first',
      posts: [],
      posts_count: 0,
      loading: false,
      currentPage: 1
    }
  },
  setup() {
    const currentUser = useUserStore()
    return { currentUser }
  },
  mounted() {
    this.currentUser.loadUserName()
    this.getPosts()
  },
  computed: {
    isLogin() {
      return common.isLogined()
    }
  },
  methods: {
    handleCurrentChange() {
      this.getPosts(this.currentPage)
    },
    getPosts(page) {
      postApi.get_posts(page).then((res) => {
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
  <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="广场" name="first">
      <div v-if="!loading">
        <PostCard v-for="item in posts" :key="item" :post="item" />
      </div>
      <el-skeleton :rows="5" animated :loading="loading" :throttle="500" />
    </el-tab-pane>
    <el-tab-pane label="关注" name="second" v-if="isLogin">Config</el-tab-pane>
  </el-tabs>

  <el-pagination
    v-model:current-page="currentPage"
    :page-size="20"
    :size="size"
    :disabled="disabled"
    layout="total, prev, pager, next"
    :total="posts_count"
    @size-change="handleSizeChange"
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
