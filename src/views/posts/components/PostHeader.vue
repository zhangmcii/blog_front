<script>
import date from '@/utils/date.js'
export default {
  props: {
    post: {
      type: Object,
      default() {
        return {
          id: 1,
          body: '文章',
          body_html: null,
          timestamp: '2024-9-20 12:14:00',
          author: '张三',
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
      if (date.isYesterday(this.post.timestamp)) {
        let time = this.$dayjs(this.post.timestamp).format('HH:mm')
        return `昨天 ${time}`
      }
      return this.$dayjs(this.post.timestamp).fromNow()
    },
    userAvatars() {
      return 'http://' + import.meta.env.VITE_QINIU_DOMAIN + '/' + this.post.image + '-slim'
    }
  },
  methods: {}
}
</script>

<template>
  <el-row class="head">
    <el-col :span="3">
      <el-avatar :src="userAvatars" @click.stop="$router.push(`/user/${post.author}`)" />
    </el-col>

    <el-col :span="15" class="head-name">
      <el-text @click.stop="$router.push(`/user/${post.author}`)">{{
        post.nick_name ? post.nick_name : post.author
      }}</el-text>
    </el-col>

    <el-col :xs="4" :sm="3" :md="2" :lg="3" :xl="3" :push="2" class="head-time">
      <el-text size="small">{{ from_now }}</el-text>
    </el-col>
  </el-row>
</template>
<style scoped>
.head {
  height: 40px;
  margin: 0px 0px 10px 0px;
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
</style>
