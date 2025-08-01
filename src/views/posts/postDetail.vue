<script>
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
import PostImage from '@/views/posts/components/PostImage.vue'
import PostAction from '@/views/posts/components/PostAction.vue'
import CommentCard from '@/views/comment/ComCard.vue'
import PostHeader from '@/views/posts/components/PostHeader.vue'
import PostContent from '@/views/posts/components/PostContent.vue'
import postApi from '@/api/posts/postApi.js'
import { Scrollbar } from 'vue-amazing-ui'

export default {
  components: {
    PageHeadBack,
    CommentCard,
    PostImage,
    PostAction,
    PostHeader,
    PostContent
  },
  data() {
    return {
      post: {
        id: 1,
        body: '',
        body_html: null,
        timestamp: '',
        author: '--',
        nick_name: '',
        commentCount: 20,
        disabled: false,
        image: '',
        praise_num: 0,
        has_praised: false,
        post_images: []
      },
      postId: -1
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
  computed: {},
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
    <PostHeader :post="post" />
    <PostContent :postContent="post.body" />
    <PostImage :postImages="post.post_images" />

    <PostAction :post="post" :showShare="true" :showEdit="true" />
    <CommentCard :post-id="postId" />
  </PageHeadBack>
</template>
<style scoped lang="scss">
.el-button {
  margin-top: 10px;
}
.Scrollbar {
  height: calc(100vh - var(--el-main-padding) * 2 - 50px);
}
</style>
