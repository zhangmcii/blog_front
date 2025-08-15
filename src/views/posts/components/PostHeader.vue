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
  <div class="post-header">
    <div class="author-info">
      <el-avatar 
        class="author-avatar" 
        alt="用户图像" 
        :src="post.image" 
        @click.stop="$router.push(`/user/${post.author}`)" 
      />
      <div class="author-details">
        <div 
          class="author-name" 
          @click.stop="$router.push(`/user/${post.author}`)"
        >
          {{ post.nick_name ? post.nick_name : post.author }}
        </div>
        <div class="post-time">
          <van-icon name="clock-o" class="time-icon" />
          {{ from_now }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  margin-bottom: 12px;
}

.author-info {
  display: flex;
  align-items: center;
}

.author-avatar {
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.05);
  }
}

.author-details {
  margin-left: 12px;
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 500;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  
  &:hover {
    color: #1890ff;
    text-decoration: underline;
  }
}

.post-time {
  font-size: 13px;
  color: #999;
  margin-top: 2px;
  display: flex;
  align-items: center;
}

.time-icon {
  font-size: 14px;
  margin-right: 4px;
}

@media (max-width: 768px) {
  .author-name {
    font-size: 15px;
  }
  
  .post-time {
    font-size: 12px;
  }
}
</style>
