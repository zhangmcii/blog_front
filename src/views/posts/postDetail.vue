<template>
  <el-row class="head">
    <el-col :span="3">
      <el-avatar :src="image" @click.stop="$router.push(`/user/${post.author}`)" />
    </el-col>

    <el-col :span="16" class="head-name">
      {{ post.nick_name ? post.nick_name : post.author }}
    </el-col>

    <el-col :xs="4" :sm="3" :md="2" :lg="3" :xl="3" :push="2" class="head-time">
      <el-text class="mx-1" size="small">{{ from_now }}</el-text>
    </el-col>
  </el-row>

  <el-row class="text">
    <el-text> 文字区 </el-text>
  </el-row>

  <!-- <div class="demo-image__lazy">
    <el-image
      v-for="(url, index) in urls"
      :key="url"
      :src="url"
      lazy
      :preview-src-list="urls"
      :initial-index="index"
      show-progress
    >
      <template #error>
        <div class="image-slot">
          <el-icon><i-ep-picture /></el-icon>
        </div>
      </template>
    </el-image>
  </div> -->

  <el-row :gutter="1" class="images">
    <el-col :span="8" v-for="(url, index) in urls" :key="index">
      <el-image :src="url" lazy :preview-src-list="urls" />
    </el-col>
  </el-row>

  <CommentCard :postId="1" />
</template>

<script>
import date from '@/utils/date.js'
import CommentCard from '@/views/comment/ComCard.vue'
export default {
  name: 'BlogPost',
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
          image: '/src/asset/image_1.ico',
          praise_num: 0,
          has_praised: false
        }
      }
    }
  },
  components: {
    CommentCard
  },
  data() {
    return {
      urls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
        'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
        'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
      ]
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
  }
}
</script>

<style scoped>
.head {
  height: 40px;
}
.head-name,
.head-time {
  display: flex;
  align-items: center;
}

.text {
  margin: 10px 0px 10px 0px;
}
.el-image {
  /* height: 111.66px; */
}
</style>
