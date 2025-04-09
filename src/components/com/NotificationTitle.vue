<script>
export default {
  props: {
    nItem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    suffix() {
      if (this.nItem.type === '评论') {
        return '的文章'
      } else if (this.nItem.type === '回复') {
        return '评论'
      } else if (this.nItem.type === '点赞' && !this.nItem.commentId) {
        return '的文章'
      } else if (this.nItem.type === '点赞' && this.nItem.commentId && this.nItem.postId) {
        return '的评论'
      }
      return ''
    }
  },
  mounted() {},
  methods: {}
}
</script>

<template>
  <p class="notification-title">
    {{
      `${nItem.triggerNickName ? nItem.triggerNickName : nItem.triggerUsername} ${
        nItem.type
      } 了你${suffix}`
    }}
  </p>
</template>
<style scoped>
.notification-title {
  font-weight: 600; /* font-semibold */
  font-size: 0.875rem; /* 假设基础字体大小 */
}
</style>
