<script>
import PostCard from './PostCard.vue'
import CommentCard from '../comment/CommentCard.vue'
export default {
  components: {
    PostCard,
    CommentCard
  },
  data() {
    return {
      post: {}
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const params = to.params.obj
      vm.post = params ? JSON.parse(decodeURIComponent(params)) : null
      vm.$nextTick(() => {})
    })
  },
  mounted() {},
  methods: {}
}
</script>

<template>
  <PostCard :post="post" />
  <CommentCard :post-id="post.id" />
</template>
<style scoped>
.el-button {
  margin-top: 10px;
}
</style>
