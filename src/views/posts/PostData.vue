<script>
import PostPreview from '@/views/posts/components/PostPreview.vue'
import PostImage from '@/views/posts/components/PostImage.vue'
import postApi from '@/api/posts/postApi.js'
import { useCurrentUserStore } from '@/stores/user'
import { GradientText } from 'vue-amazing-ui'
import 'vue-amazing-ui/es/gradienttext/GradientText.css'
import SkeletonUtil from '@/utils/components/SkeletonUtil.vue'
import PostPublish from './PostPublish.vue'
import emitter from '@/utils/emitter.js'

export default {
  components: {
    PostPreview,
    PostImage,
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
      },
      showEmoji: false,
      // 延迟渲染会导致与空页面闪烁
      throttle: {
        // leading: 200,
        // trailing: 200,
        // initVal: true
      }
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  mounted() {
    this.getPosts(this.currentPage, this.activeName)
    emitter.on('newPost', (post) => {
      this.posts.unshift(...post)
    })
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
    >你好 {{ currentUser.priorityName }}</GradientText
  >
  <PostPublish
    @loading-begin="(flag) => (loading.publishPost = flag)"
    @posts-result="getPostsResult"
    v-if="currentUser.isLogin"
  />
  <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-change="changeTab">
    <el-tab-pane label="广场" name="all">
      <el-empty :image-size="200" v-if="activeName == 'all' && posts_count == 0 && !loading.card" />
      <SkeletonUtil
        :loading="loading.card"
        :row="5"
        :throttle="throttle"
        :cardStyle="{ marginBottom: '10px' }"
      >
        <PostPreview
          v-for="item in posts"
          :key="item.id"
          :post="item"
          :containerStyle="{ marginBottom: '10px' }"
          @click="$router.push(`/postDetail/${item.id}`)"
          v-slide-in
        >
          <template #image>
            <PostImage :post_images="item.post_images" @click.stop="" />
          </template>
        </PostPreview>
        <el-divider v-if="posts_count !== 0">无更多内容了</el-divider>
      </SkeletonUtil>
    </el-tab-pane>
    <el-tab-pane label="关注" name="showFollowed" v-if="currentUser.isLogin">
      <el-empty
        :image-size="200"
        v-if="activeName == 'showFollowed' && posts_count == 0 && !loading.card"
      />
      <SkeletonUtil
        :loading="loading.card"
        :row="5"
        :throttle="throttle"
        :cardStyle="{ marginBottom: '10px' }"
      >
        <PostPreview
          v-for="item in posts"
          :key="item.id"
          :post="item"
          :containerStyle="{ marginBottom: '10px' }"
          @click="$router.push(`/postDetail/${item.id}`)"
          v-slide-in
        >
          <template #image>
            <PostImage :post_images="item.post_images" @click.stop="" />
          </template>
        </PostPreview>
        <el-divider v-if="posts_count !== 0">无更多内容了</el-divider>
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
  margin: 0px 0px 0px 0px;
}

.el-pagination {
  float: right;
}
.demo-tabs {
  margin-top: 20px;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
