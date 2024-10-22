<script>
import postApi from '@/api/posts/postApi.js'
import PostCard from './PostCard.vue'
import CommentCard from '../comment/CommentCard.vue'
export default {
  components: {
    PostCard,
    CommentCard
  },
  data() {
    return {
      post: {},
      postId:-1,
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.postId = Number(to.params.id)
      vm.$nextTick(() => {})
    })
  },
  mounted() {
    if (this.postId != -1) {
      this.getPostById(this.postId)
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
  <PostCard :post="post" />
  <CommentCard :post-id="postId" />
</template>
<style scoped>
.el-button {
  margin-top: 10px;
}
</style>
