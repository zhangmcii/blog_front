<script>
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
import PostImage from '@/views/posts/components/PostImage.vue'
import PostAction from '@/views/posts/components/PostAction.vue'
import CommentCard from '@/views/comment/ComCard.vue'
import postApi from '@/api/posts/postApi.js'
import date from '@/utils/date.js'

export default {
  components: {
    PageHeadBack,
    CommentCard,
    PostImage,
    PostAction
  },
  data() {
    return {
      post: {
        id: 1,
        body: '文章',
        body_html: null,
        timestamp: '2024-9-20 12:14:00',
        author: '--',
        nick_name: '',
        commentCount: 20,
        disabled: false,
        image: '',
        praise_num: 0,
        has_praised: false,
        post_images: []
      },
      postId: -1,

      praiseNum: 0,
      hasPraised: false
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.postId = Number(to.params.id)
      vm.getPostById(vm.postId)
    })
  },
  created() {
    this.$watch(
      () => this.$route.params.id,
      (newVal) => {
        this.postId = Number(newVal)
        this.getPostById(this.postId)
      }
    )
  },
  computed: {
    from_now() {
      if (date.isYesterday(this.post.timestamp)) {
        let time = this.$dayjs(this.post.timestamp).format('HH:mm')
        return `昨天 ${time}`
      }
      return this.$dayjs(this.post.timestamp).fromNow()
    },
    postUrls() {
      const urls = []
      const domain = import.meta.env.VITE_QINIU_DOMAIN
      this.post.post_images.forEach((key) => {
        const imageUrl = `http://${domain}/${key}-slim`
        urls.push(imageUrl)
      })
      return urls
    }
  },
  methods: {
    getPostById(postId) {
      postApi.getPost(postId).then((res) => {
        if (res.data.msg == 'success') {
          this.post = res.data.data
        }
      })
    }
  }
}
</script>

<template>
  <PageHeadBack>
    <el-row class="head">
      <el-col :span="3">
        <el-avatar :src="post.image" @click.stop="$router.push(`/user/${post.author}`)" />
      </el-col>

      <el-col :span="15" class="head-name">
        <el-text @click.stop="$router.push(`/user/${post.author}`)">{{
          post.nick_name ? post.nick_name : post.author
        }}</el-text>
      </el-col>

      <el-col :xs="4" :sm="3" :md="2" :lg="3" :xl="3" :push="2" class="head-time">
        <el-text class="mx-1" size="small">{{ from_now }}</el-text>
      </el-col>
    </el-row>

    <el-row class="text">
      <el-text>{{ post.body }}</el-text>
    </el-row>
    <PostImage :post_images="post.post_images" />

    <PostAction :post="post" :showShare="true"/>
    <CommentCard :post-id="postId" />
  </PageHeadBack>
</template>
<style scoped lang="scss">
.el-button {
  margin-top: 10px;
}
.head {
  height: 40px;
  margin: 15px 0px 10px 0px;
}
.head-name,
.head-time {
  display: flex;
  align-items: center;
}
.head-name {
  .el-text {
    font-size: 13px;
  }
}
.text {
  margin: 10px 0px 10px 5px;
  .el-text {
    color: #303133;
    font-size: 0.875rem;
    line-height: 1.6;
    letter-spacing: 0.04em;
  }
}
</style>
