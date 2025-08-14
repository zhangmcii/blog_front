<script>
import { useCurrentUserStore } from '@/stores/user'
import { loginReminder } from '@/utils/common.js'
import { copy } from '@/utils/common.js'
import praise from '@/api/praise/praiseApi.js'

export default {
  props: {
    post: {
      type: Object,
      default() {
        return {
          id: 1,
          body: '文章',
          body_html: null,
          timestamp: '',
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
    showShare: {
      type: Boolean,
      default: false
    },
    showEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      iconSize: 15,
      praiseNum: 0,
      hasPraised: false,
      show: false,
      shareOptions: [
        { name: '微信', icon: 'wechat' },
        { name: '朋友圈', icon: 'wechat-moments' },
        { name: '微博', icon: 'weibo' },
        { name: 'QQ', icon: 'qq' },
        { name: '复制链接', icon: 'link' }
      ]
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  mounted() {},
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
    isUserRoute() {
      return this.$route.path.startsWith('/user')
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
    },
    edit() {
      this.$router.push(`/editPost/${this.post.id}`)
    },
    shareSelect(option) {
      if (option.name === '复制链接') {
        copy(`${import.meta.env.VITE_DOMIN}/postDetail/${this.post.id}`)
      } else {
        this.$message.info(option.name)
      }
      this.show = false
    }
  }
}
</script>

<template>
  <el-row justify="end" class="footer">
    <el-col
      :xs="4"
      :sm="4"
      :md="2"
      :lg="2"
      :xl="2"
      v-if="showEdit && post.author == currentUser.userInfo.username"
    >
      <van-icon name="edit" @click.stop="edit" :size="iconSize" />
    </el-col>
    <el-col
      :xs="4"
      :sm="4"
      :md="2"
      :lg="2"
      :xl="2"
      v-else-if="showEdit && currentUser.userInfo.isAdmin == 'true'"
    >
      <van-icon name="edit" @click.stop="edit" :size="iconSize" color="red" />
    </el-col>

    <el-col :xs="4" :sm="4" :md="2" :lg="2" :xl="2" v-if="showShare && !isUserRoute">
      <van-icon name="share-o" @click.stop="show = !show" :size="iconSize" />
    </el-col>
    <el-col :xs="4" :sm="3" :md="4" :lg="2" :xl="2">
      <el-space :size="3">
        <van-icon name="notes-o" @click.stop="comment" :size="iconSize" />
        <el-text>{{ post.comment_count }}</el-text>
      </el-space>
    </el-col>
    <el-col :xs="2" :sm="3" :md="2" :lg="2" :xl="2">
      <el-space :size="3">
        <transition :name="hasPraised ? 'praise' : ''" mode="out-in">
          <van-icon
            name="good-job"
            @click.stop=""
            :size="iconSize"
            v-if="hasPraised"
            key="praised"
          />
          <van-icon name="good-job-o" @click.stop="praise" :size="iconSize" v-else key="unPraise" />
        </transition>
        <el-text>{{ praiseNum }}</el-text>
      </el-space>
    </el-col>
  </el-row>
  <van-share-sheet
    v-model:show="show"
    title="立即分享给好友"
    :options="shareOptions"
    @select="shareSelect"
  />
</template>
<style scoped>
/* 底部操作区样式由 PostCard.scss 统一管理 */
</style>
