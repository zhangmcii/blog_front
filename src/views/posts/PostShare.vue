<script>
import PostCard from './PostCard.vue'
export default {
  components: {
    PostCard
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
  <div>评论...</div>
</template>
<style scoped></style>
