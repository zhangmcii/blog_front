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
    <div class="post-detail-container">
      <div class="post-main-content">
        <PostHeader :post="post" class="post-header" />
        <PostContent :postContent="post.body" class="post-content" />
        <PostImage :postImages="post.post_images" class="post-images" />
      </div>
      
      <div class="post-actions">
        <PostAction :post="post" :showShare="true" :showEdit="true" />
      </div>
      
      <div class="post-comments">
        <CommentCard :post-id="postId" />
      </div>
    </div>
  </PageHeadBack>
</template>

<style scoped lang="scss">
@use './components/PostDetail.scss' as *;

.post-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: $spacing-md;
  background-color: #fff;
  border-radius: $border-radius-md;
  box-shadow: 0 1px 3px $shadow-color;
  @extend .fade-in;
}

.post-main-content {
  margin-bottom: $spacing-lg;
  @extend .slide-up;
}

.post-header {
  margin-bottom: $spacing-md;
}

.post-content {
  margin-bottom: $spacing-md;
}

.post-images {
  margin-bottom: $spacing-lg;
}

.post-actions {
  padding: $spacing-sm 0;
  border-top: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  margin-bottom: $spacing-md;
}

.post-comments {
  margin-top: $spacing-md;
}

.el-button {
  margin-top: $spacing-sm;
}

.Scrollbar {
  height: calc(100vh - var(--el-main-padding) * 2 - 50px);
}

@include mobile {
  .post-detail-container {
    padding: $spacing-sm;
    border-radius: 0;
    box-shadow: none;
  }
}
</style>
