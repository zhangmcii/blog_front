<script>
import PostPreview from '@/views/posts/components/PostPreview.vue'
import PostImage from '@/views/posts/components/PostImage.vue'
import notificationApi from '@/api/notification/notificationApi.js'
import postApi from '@/api/posts/postApi.js'
import { useCurrentUserStore } from '@/stores/user'
import { GradientText } from 'vue-amazing-ui'
import 'vue-amazing-ui/es/gradienttext/GradientText.css'
import SkeletonUtil from '@/utils/components/SkeletonUtil.vue'
import ICP from '@/utils/components/ICP.vue'
import PostPublish from './PostPublish.vue'
import emitter from '@/utils/emitter.js'

export default {
  components: {
    PostPreview,
    PostImage,
    PostPublish,
    GradientText,
    SkeletonUtil,
    ICP
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
        leading: 0,
        trailing: 0,
        initVal: false
      },
      showDot: false,
      followPost: []
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  mounted() {
    this.getPosts(this.currentPage, this.activeName)
    // 自己发布的文章
    emitter.on('newPost', (post) => {
      this.posts.unshift(...post)
    })
    // 关注的用户发布了新文章
    emitter.on('followPost', (newPost) => {
      this.showDot = true
      this.followPost = [...newPost]
      console.log('newPost', this.followPost)
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
      if (tabName === 'showFollowed' && this.showDot) {
        const ids = []
        this.followPost.forEach((item) => {
          ids.push(item.id)
        })
        // 全部标记为已读
        notificationApi.markRead({ ids: ids }).then(() => {
          this.showDot = false
        })
      }
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
  <div class="posts-container">
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
        <SkeletonUtil :loading="loading.card" :row="5" :throttle="throttle" :useNew="true">
          <transition-group name="slide-in">
            <PostPreview
              v-for="item in posts"
              :key="item.id"
              :post="item"
              :containerStyle="{ marginBottom: '20px' }"
              @click="$router.push(`/postDetail/${item.id}`)"
              v-slide-in
            >
              <template #image>
                <PostImage :postImages="item.post_images" @click.stop="" />
              </template>
            </PostPreview>
          </transition-group>
        </SkeletonUtil>
      </el-tab-pane>
      <el-tab-pane name="showFollowed" v-if="currentUser.isLogin">
        <template #label>
          <van-badge :dot="showDot" :offset="[1, -1]"> 关注 </van-badge>
        </template>
        <el-empty
          :image-size="200"
          v-if="activeName == 'showFollowed' && posts_count == 0 && !loading.card"
        />
        <SkeletonUtil :loading="loading.card" :row="5" :throttle="throttle" :useNew="true">
          <transition-group name="slide-in">
            <PostPreview
              v-for="item in posts"
              :key="item.id"
              :post="item"
              :containerStyle="{ marginBottom: '20px' }"
              @click="$router.push(`/postDetail/${item.id}`)"
              v-slide-in
            >
              <template #image>
                <PostImage :postImages="item.post_images" @click.stop="" />
              </template>
            </PostPreview>
          </transition-group>
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
    <ICP />
  </div>
</template>
<style lang="scss" scoped>
@import './components/PostCard.scss';

.posts-container {
  padding: 10px;
}

.gradient-text {
  margin: 0px 0px 10px 0px;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #09c8ce, #eb2f96);
    border-radius: 2px;
  }
}
</style>
