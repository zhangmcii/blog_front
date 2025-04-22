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
      <el-text> {{ post.body }} </el-text>
    </el-row>

    <div class="preview">
      <el-row :gutter="1" class="images">
        <el-col :span="8" v-for="(url, index) in postUrls" :key="index">
          <el-image
            :src="url"
            lazy
            fit="cover"
            :preview-src-list="postUrls"
            :initial-index="index"
          />
        </el-col>
      </el-row>
    </div>
    <CommentCard />
  </PageHeadBack>
</template>

<script>
import date from '@/utils/date.js'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
import CommentCard from '@/views/comment/ComCard.vue'
import postApi from '@/api/posts/postApi.js'
export default {
  name: 'BlogPost',
  props: {
    postId: {
      type: Number,
      default: 2
    }
  },
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
        author: '张三',
        nick_name: '',
        commentCount: 20,
        disabled: false,
        image: '/src/asset/image_1.ico',
        praise_num: 0,
        has_praised: false,
        post_images: []
      }
    }
  },
  mounted() {
    this.getPostById(this.postId)
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
    }
  }
}
</script>

<style scoped>
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
  margin: 10px 0px 10px 0px;
}
.preview {
  width: 370px;
}
.el-image {
  width: 121px;
  height: 121px;
}
</style>
