<!-- 这个组件只用作首页文章预览 。可以不用加上PostCard中复杂的逻辑
 prop只接受文章的json

 图像和用户名跳转至个人主页
 最底下增加评论和点赞按钮
-->
<script>
import { useCurrentUserStore } from '@/stores/user'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
import { copy } from '@/utils/common.js'
import requestUrl from '@/config/requestUrl.js'
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
  components: {
    PageHeadBack
  },
  data() {
    return {
      showShare: false,
      shareOptions: [
        { name: '微信', icon: 'wechat' },
        { name: '朋友圈', icon: 'wechat-moments' },
        { name: '微博', icon: 'weibo' },
        { name: 'QQ', icon: 'qq' },
        { name: '复制链接', icon: 'link' }
      ],
      urls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
        'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
        'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
      ],
      iconSize: 15,
      praiseNum: 0,
      hasPraised: false
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
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
    },
    postUrls() {
      const urls = []
      const domain = import.meta.env.VITE_QINIU_DOMAIN
      this.post.post_images.forEach((key) => {
        const imageUrl = `http://${domain}/${key}-slim`
        urls.push(imageUrl)
      })
      return urls
    }
  },
  methods: {
    comment() {
      this.$router.push(`/share/${this.post.id}`)
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
    shareSelect(option) {
      if (option.name === '复制链接') {
        copy(`${requestUrl.baseUrl}:${requestUrl.frontPort}/share/${this.postId}`)
      } else {
        this.$message.info(option.name)
      }
      this.showShare = false
    }
  }
}
</script>

<template>
  <el-card shadow="never">
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
      <el-text line-clamp="4"
        >孩子或者像孩子一样单纯的人，目的意识淡薄，沉浸在过程中，过程和目的浑然不分，他们能够随遇而安，即事起兴，不易感到无聊。商人或者像商人一样精明的人，有非常明确实际的目的，以此指导行动,当白日依山尽，夕阳余辉便透过朵朵云层，像万道金光，如霞光万丈，把天空白云染得红彤彤</el-text
      >
    </el-row>

    <el-row :gutter="4" class="preview">
      <el-col :span="8" v-for="(url, index) in urls" :key="index">
        <el-image :src="url" lazy fit="cover" :preview-src-list="postUrls" :initial-index="index">
          <template #error>
            <div class="image-slot">
              <el-icon><i-ep-picture /></el-icon>
            </div>
          </template>
        </el-image>
      </el-col>
    </el-row>
    <el-row justify="end">
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
            <van-icon
              name="good-job-o"
              @click.stop="praise"
              :size="iconSize"
              v-else
              key="unPraise"
            />
          </transition>
          <el-text>{{ praiseNum }}</el-text>
        </el-space>
      </el-col>
    </el-row>
  </el-card>
</template>
<style scoped lang="scss">
// 用户名 13px
// 时间 12px
// 文字 14px
// 图片 121px
:deep(.el-card__body) {
  padding: 0px;
}
.el-card {
  border-color: white;
}
.el-button {
  margin-top: 10px;
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
    letter-spacing: 0.05em;
  }
}
.preview {
  width: 370px;
  margin: 0px 0px 50px 0px;
}
.el-image {
  width: 100%;
  height: 121px;
  margin-left: 5px;
  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 14px;
    .el-icon {
      font-size: 30px;
    }
  }
}

.praise-enter-active,
.praise-leave-active {
  transition: all 0.15s cubic-bezier(0.42, 0, 0.34, 1.55);
}
.praise-enter-from,
.praise-leave-to {
  transform: scale(0);
}
.praise-enter-to,
.praise-leave-from {
  transform: scale(1);
}
</style>
