<script>
import PostCard from './PostCard.vue'
import postApi from '@/api/posts/postApi.js'
import { useCurrentUserStore } from '@/stores/currentUser'
import { GradientText } from 'vue-amazing-ui'
import 'vue-amazing-ui/es/gradienttext/GradientText.css'
import SkeletonUtil from '@/utils/components/SkeletonUtil.vue'
import PostPublish from './PostPublish.vue'
export default {
  components: {
    PostCard,
    PostPublish,
    GradientText,
    SkeletonUtil
  },
  data() {
    return {
      activeName: 'all',
      posts: [],
      posts_count: -1,
      currentPage: 1,
      loading: {
        publishPost: false,
        card: false
      }
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
      this.loading.card = true
      postApi.getPosts(page, tabName).then((res) => {
        this.loading.card = false
        this.posts = res.data.data
        this.posts_count = res.data.total
      })
    },
    getPostsResult(res) {
      this.posts = res.data.data
      // 首页设置了缓存，手动更新为第一页
      this.currentPage = 1
      this.posts_count = res.data.total
      this.loading.publishPost = false
    }
  }
}
</script>

<template>
  <GradientText
    class="gradient-text"
    :size="28"
    :weight="500"
    :gradient="{
      deg: '90deg',
      from: '#09c8ce',
      to: '#eb2f96'
    }"
    >你好 {{ currentUser.name ? currentUser.name : currentUser.username }}</GradientText
  >
  <PostPublish
    @loading-begin="(flag) => (loading.publishPost = flag)"
    @posts-result="getPostsResult"
    v-if="currentUser.token != ''"
  />
  <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-change="changeTab">
    <el-tab-pane label="广场" name="all">
      <el-empty :image-size="200" v-if="activeName == 'all' && posts_count == 0 && !loading.card" />
      <SkeletonUtil
        :loading="loading.card"
        :row="5"
        :throttle="{}"
        :cardStyle="{ marginBottom: '10px' }"
      >
        <PostCard
          v-for="item in posts"
          :key="item.id"
          :post="item"
          :showEdit="false"
          :showShare="false"
          :cardStyle="{ marginBottom: '10px' }"
          @click="$router.push(`/share/${item.id}`)"
          v-slide-in
        />
      </SkeletonUtil>
    </el-tab-pane>
    <el-tab-pane label="关注" name="showFollowed" v-if="currentUser.token != ''">
      <el-empty
        :image-size="200"
        v-if="activeName == 'showFollowed' && posts_count == 0 && !loading.card"
      />
      <SkeletonUtil
        :loading="loading.card"
        :row="5"
        :throttle="{}"
        :cardStyle="{ marginBottom: '10px' }"
      >
        <PostCard
          v-for="item in posts"
          :key="item.id"
          :post="item"
          :showEdit="false"
          :showShare="false"
          :cardStyle="{ marginBottom: '10px' }"
          @click="$router.push(`/share/${item.id}`)"
          v-slide-in
        />
      </SkeletonUtil>
    </el-tab-pane>
  </el-tabs>
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
.gradient-text {
  margin: 20px 0px 0px 0px;
}

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
