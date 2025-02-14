<script>
import { defineAsyncComponent, hydrateOnVisible } from 'vue'
import PostCard from './PostCard.vue'
import postApi from '@/api/posts/postApi.js'
import { useCurrentUserStore } from '@/stores/currentUser'
import { GradientText } from 'vue-amazing-ui'
import 'vue-amazing-ui/es/gradienttext/GradientText.css'

export default {
  components: {
    PostCard,
    PostPublish: defineAsyncComponent({
      loader: () => import('./PostPublish.vue'),
      hydrate: hydrateOnVisible()
    }),
    GradientText
  },
  data() {
    return {
      activeName: 'all',
      posts: [],
      posts_count: -1,
      currentPage: 1,
      loading: {
        publishPost: false,
        fetchPost: false,
        fetchPostDisabled: false
      },
      showShare: false,
      shareOptions: [
        { name: '微信', icon: 'wechat' },
        { name: '朋友圈', icon: 'wechat-moments' },
        { name: '微博', icon: 'weibo' },
        { name: 'QQ', icon: 'qq' },
        { name: '复制链接', icon: 'link' }
      ],
      pendingPosts: null, // 新增待处理数据
      transitionActive: false // 动画状态标识
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
    async getPosts(page, tabName) {
      if (this.transitionActive) return // 阻止并发请求

      try {
        this.transitionActive = true
        this.pendingPosts = null // 清空待处理数据

        // 阶段1: 触发旧数据离场动画
        const oldPosts = [...this.posts]
        this.posts = [] // 清空数据触发leave动画

        // 等待动画完成（替代setTimeout的方案）
        await this.$nextTick()
        await Promise.all(
          oldPosts.map((_, i) => this.waitForAnimationEnd(`.post-item:nth-child(${i + 1})`))
        )
        
        // 阶段2: 获取新数据
        const res = await postApi.getPosts(page, tabName)
        this.pendingPosts = res.data.data // 暂存不立即渲染

        // 阶段3: 执行入场动画
        this.posts = this.pendingPosts
        this.posts_count = res.data.total
        await this.$nextTick() // 等待DOM更新
      } finally {
        this.transitionActive = false
        this.pendingPosts = null
        this.loading.fetchPost = false
      }
    },

    // 动画结束检测方法
    waitForAnimationEnd(selector) {
      return new Promise((resolve) => {
        const element = document.querySelector(selector)
        if (!element) return resolve()

        const handler = () => {
          element.removeEventListener('transitionend', handler)
          resolve()
        }
        element.addEventListener('transitionend', handler)
      })
    },

    getPostsResult(res) {
      this.posts = res.data.data
      this.posts_count = res.data.total
      this.loading.publishPost = false
    },
    onRefresh() {
      this.loading.fetchPost = true
      this.getPosts(this.currentPage, this.activeName)
    },
    shareSelect(option) {
      this.$message.info(option.name)
      this.showShare = false
      this.loading.publishPost = false
    }
  }
}
</script>

<template>
  <van-pull-refresh
    v-model="loading.fetchPost"
    success-text="刷新成功"
    @refresh="onRefresh"
    :disabled="loading.fetchPostDisabled"
  >
    <GradientText
      class="gradient-text"
      :size="28"
      :weight="500"
      :gradient="{
        deg: '90deg',
        from: '#09c8ce',
        to: '#eb2f96'
      }"
      >你好 {{ currentUser.username }}</GradientText
    >
    <PostPublish
      @loading-begin="(flag) => (loading.publishPost = flag)"
      @posts-result="getPostsResult"
      v-if="currentUser.token != ''"
    />

    <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-change="changeTab">
      <el-tab-pane label="广场" name="all">
        <el-empty :image-size="200" v-if="activeName == 'all' && posts_count == 0" />
        <TransitionGroup name="post" tag="div" class="post-container" >
          <PostCard
            v-for="item in posts"
            :key="item.id"
            :post="item"
            @click="$router.push(`/share/${item.id}`)"
            @share="(flag) => (this.showShare = flag)"
            :class="{ 'pending-item': pendingPosts?.includes(item) }"
          />
        </TransitionGroup>
      </el-tab-pane>
      <el-tab-pane label="关注" name="showFollowed" v-if="currentUser.token != ''">
        <el-empty :image-size="200" v-if="activeName == 'showFollowed' && posts_count == 0" />
        <TransitionGroup name="post" tag="div" class="post-container" >
          <PostCard
            v-for="item in posts"
            :key="item.id"
            :post="item"
            @click="$router.push(`/share/${item.id}`)"
            @share="(flag) => (this.showShare = flag)"
            :class="{ 'pending-item': pendingPosts?.includes(item) }"
          />
        </TransitionGroup>
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
    <van-share-sheet
      v-model:show="showShare"
      title="立即分享给好友"
      :options="shareOptions"
      @select="shareSelect"
    />
  </van-pull-refresh>
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

.post-container {
  position: relative;
  min-height: 300px; /* 防止内容闪动 */
}

.post-item {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 入场动画（从右切入） */
.post-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

/* 离场动画（向左淡出） */
.post-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.post-enter-active,
.post-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 禁用交互状态 */
.post-container.pending-item {
  pointer-events: none;
  opacity: 0.7;
}

</style>
