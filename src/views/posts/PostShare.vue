<script>
import postApi from '@/api/posts/postApi.js'
import PostCard from './PostCard.vue'
import CommentCard from '../comment/CommentCard.vue'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
export default {
  components: {
    PostCard,
    CommentCard,
    PageHeadBack
  },
  data() {
    return {
      post: {},
      postId:-1,
      showShare:false,
      shareOptions: [
        { name: '微信', icon: 'wechat' },
        { name: '朋友圈', icon: 'wechat-moments' },
        { name: '微博', icon: 'weibo' },
        { name: 'QQ', icon: 'qq' },
        { name: '复制链接', icon: 'link' },
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.postId = Number(to.params.id)
      vm.$nextTick(() => {
        vm.getPostById(vm.postId)
      })
      vm.$nextTick(() => {
        vm.getPostById(vm.postId)
      })
    })
  },
  methods: {
    getPostById(postId) {
      postApi.getPost(postId).then((res) => {
        if (res.data.msg == 'success') {
          this.post = res.data.data
        }
      })
    },
    shareSelect(option) {
      this.$message.info(option.name)
      this.showShare = false
    },
  }
}
</script>

<template>
  <PageHeadBack>
  <PostCard :post="post" @share="(flag) => (this.showShare = flag)" :loading="Object.keys(post).length === 0"/>
  <CommentCard :post-id="postId" />
  <van-share-sheet
      v-model:show="showShare"
      title="立即分享给好友"
      :options="shareOptions"
      @select="shareSelect"
    />
</PageHeadBack>
</template>
<style scoped>
.el-button {
  margin-top: 10px;
}
</style>
