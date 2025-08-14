<script>
import date from '@/utils/date.js'
export default {
  props: {
    post: {
      type: Object,
      default() {
        return {
          id: 1,
          body: '',
          body_html: null,
          timestamp: '',
          author: '--',
          nick_name: '',
          commentCount: 20,
          disabled: false,
          image: '',
          comment_count: 0,
          praise_num: 0,
          has_praised: false,
          post_images: []
        }
      }
    }
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    from_now() {
      return date.dateShow(this.post.timestamp)
    }
  },
  methods: {}
}
</script>

<template>
  <el-row class="head" justify="space-between" align="middle">
    <div class="head-name">
      <el-avatar alt="用户图像" :src="post.image" @click.stop="$router.push(`/user/${post.author}`)" />
      <el-text @click.stop="$router.push(`/user/${post.author}`)">{{
        post.nick_name ? post.nick_name : post.author
      }}</el-text>
    </div>
    <div>
      <el-text size="small" class="head-time">
        <i class="el-icon-time"></i>
        {{ from_now }}
      </el-text>
    </div>
  </el-row>
</template>
<style lang="scss" scoped>
/* 头部样式由 PostCard.scss 统一管理 */
</style>
