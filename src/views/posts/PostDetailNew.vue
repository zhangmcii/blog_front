<script>
import postApi from '@/api/posts/postApi.js'
import CommentCard from '../comment/ComCard.vue'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
import { copy } from '@/utils/common.js'
import requestUrl from '@/config/requestUrl.js'
import date from '@/utils/date.js'
export default {
  components: {
    CommentCard,
    PageHeadBack
  },
  data() {
    return {
      post: {
        id: 1,
        body: '文章',
        body_html: null,
        timestamp: '2024-9-20 12:14:00',
        author: '--',
        nick_name: '',
        commentCount: 20,
        disabled: false,
        image: '',
        // image: '/src/asset/image_1.ico',
        praise_num: 0,
        has_praised: false,
        post_images: []
      },
      postId: -1,
      showShare: false,
      shareOptions: [
        { name: '微信', icon: 'wechat' },
        { name: '朋友圈', icon: 'wechat-moments' },
        { name: '微博', icon: 'weibo' },
        { name: 'QQ', icon: 'qq' },
        { name: '复制链接', icon: 'link' }
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.postId = Number(to.params.id)
      vm.getPostById(vm.postId)
    })
  },
  created() {
    this.$watch(
      () => this.$route.params.id,
      (newVal) => {
        this.postId = Number(newVal)
        this.getPostById(this.postId)
      }
    )
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
    getPostById(postId) {
      postApi.getPost(postId).then((res) => {
        if (res.data.msg == 'success') {
          this.post = res.data.data
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
  <PageHeadBack>
    <el-row class="head">
      <el-col :span="3">
        <el-avatar :src="post.image" @click.stop="$router.push(`/user/${post.author}`)" />
      </el-col>

      <el-col :span="15" class="head-name">
        {{ post.nick_name ? post.nick_name : post.author }}
      </el-col>

      <el-col :xs="4" :sm="3" :md="2" :lg="3" :xl="3" :push="2" class="head-time">
        <el-text class="mx-1" size="small">{{ from_now }}</el-text>
      </el-col>
    </el-row>

    <el-row class="text">
      <el-text>{{ post.body }}</el-text>
    </el-row>

    <div class="preview">
      <el-row :gutter="1" class="images">
        <el-col :span="8" v-for="(url, index) in postUrls" :key="index">
          <el-image :src="url" lazy fit="cover" :preview-src-list="postUrls" :initial-index="index">
            <!-- <template #placeholder>
              <div class="image-slot">Loading<span class="dot">...</span></div>
            </template> -->
            <template #error>
              <div class="image-slot">
                <el-icon><i-ep-picture /></el-icon>
              </div>
            </template>
          </el-image>
        </el-col>
      </el-row>
    </div>
    <CommentCard :post-id="postId" />
    <van-share-sheet
      v-model:show="showShare"
      title="立即分享给好友"
      :options="shareOptions"
      @select="shareSelect"
    />
  </PageHeadBack>
</template>
<style scoped lang="scss">
.el-button {
  margin-top: 10px;
}
.head {
  height: 40px;
  margin: 15px 0px 10px 0px;
}
.head-name,
.head-time {
  display: flex;
  align-items: center;
}

.text {
  margin: 20px 0px 10px 5px;
  .el-text {
    color: #303133;
    font-size: 0.875rem;
  }
}
.preview {
  width: 370px;
  margin: 0px 0px 50px 0px;
}
.el-image {
  width: 121px;
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
    // .dot {
    //   animation: dot 2s infinite steps(3, start);
    //   overflow: hidden;
    // }
    .el-icon {
      font-size: 30px;
    }
  }
}
</style>
