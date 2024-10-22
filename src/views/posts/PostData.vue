<script>
import { defineAsyncComponent, hydrateOnVisible } from 'vue'
import PostCard from './PostCard.vue'
import postApi from '@/api/posts/postApi.js'
import { useCurrentUserStore } from '@/stores/currentUser'

export default {
  components: {
    PostCard,
    PostPublish: defineAsyncComponent({
      loader: () => import('./PostPublish.vue'),
      hydrate: hydrateOnVisible()
    })
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
    this.currentUser.loadToken()
    this.currentUser.loadUserName()
    this.currentUser.loadConfirmed()
    this.currentUser.loadRoleId()
    this.getPosts(this.currentPage, this.activeName)
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
        this.$nextTick(() => {})
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
  <h1>你好 {{ currentUser.username }}</h1>
  <PostPublish
    @loading-begin="(flag) => (loading = flag)"
    @posts-result="getPostsResult"
    v-if="currentUser.token != ''"
  />
  <Transition name="fade" mode="out-in">
    <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-change="changeTab">
      <el-tab-pane label="广场" name="all">
        <el-empty :image-size="200" v-if="activeName == 'all' && posts_count == 0" />
        <PostCard v-for="item in posts" :key="item.id" :post="item" />
      </el-tab-pane>
      <el-tab-pane label="关注" name="showFollowed" v-if="currentUser.token != ''">
        <el-empty :image-size="200" v-if="activeName == 'showFollowed' && posts_count == 0" />
        <PostCard v-for="item in posts" :key="item.id" :post="item" />
      </el-tab-pane>
    </el-tabs>
  </Transition>
  <el-pagination
    v-model:current-page="currentPage"
    :page-size="10"
    layout="total, prev, pager, next"
    :total="posts_count"
    @current-change="handleCurrentChange"
    :hide-on-single-page="true"
    :pager-count="5"
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
