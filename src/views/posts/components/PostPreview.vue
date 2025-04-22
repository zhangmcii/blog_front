<!-- 这个组件只用作首页文章预览 。可以不用加上PostCard中复杂的逻辑
 prop只接受文章的json
-->
<script>
import date from '@/utils/date.js'
import praise from '@/api/praise/praiseApi.js'
import { loginReminder } from '@/utils/common.js'
import PostAction from '@/views/posts/components/PostAction.vue'
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
    },
    // 整个容器样式
    containerStyle: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    PostAction
  },
  data() {
    return {
      iconSize: 15,
      praiseNum: 0,
      hasPraised: false
    }
  },
  watch: {
    'post.praise_num': {
      handler(newValue) {
        this.praiseNum = newValue
      },
      immediate: true
    },
    'post.has_praised': {
      handler(newValue) {
        this.hasPraised = newValue
      },
      immediate: true
    }
  },
  computed: {
    from_now() {
      if (date.isYesterday(this.post.timestamp)) {
        let time = this.$dayjs(this.post.timestamp).format('HH:mm')
        return `昨天 ${time}`
      }
      return this.$dayjs(this.post.timestamp).fromNow()
    }
  },
  methods: {
    comment() {
      this.$router.push(`/postDetail/${this.post.id}`)
    },
    praise() {
      if (!this.currentUser.isLogin) {
        loginReminder('快去登录再点赞吧')
        return
      }
      praise.submitPraise(this.post.id).then((res) => {
        if (res.data.msg == 'success') {
          this.praiseNum = res.data.praise_total
          this.hasPraised = res.data.has_praised
        } else {
          this.$message.error(res.data.detail)
        }
      })
    }
  }
}
</script>

<template>
  <div :style="containerStyle">
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
        <el-text size="small">{{ from_now }}</el-text>
      </el-col>
    </el-row>

    <el-row class="text">
      <el-text line-clamp="4">{{ post.body }}</el-text>
    </el-row>

    <slot name="image"></slot>

    <PostAction :post="post" />

    <div class="block"></div>
  </div>
</template>
<style lang="scss" scoped >
// 用户名13px  时间12px  文字14px  图片121px
.block {
  width: 100%;
  height: 5px;
  background-color: #f5f7fa;
}
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
.text {
  margin: 10px 0px 10px 5px;
  .el-text {
    color: #303133;
    // 0.875rem = 14px
    font-size: 0.875rem;
    line-height: 1.6;
    letter-spacing: 0.04em;
  }
}
</style>
