<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    throttle: {
      type: Object,
      default() {
        return { leading: 300, trailing: 300, initVal: true }
      }
    },
    showAvatar: {
      type: Boolean,
      default: true
    },
    row: {
      type: Number,
      default: 4
    },
    count: {
      type: Number,
      default: 3
    },
    cardStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    useNew: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<template>
  <el-skeleton
    :loading="loading"
    animated
    class="skeleton"
    :rows="3"
    :row-width="['100%', '100%', '100%']"
  >
    <template #template>
    <div>
        <el-skeleton-item variant="circle" style="--el-skeleton-circle-size: 50px" />
        <el-skeleton-item variant="text" style="width: 20%" />

    </div>


    <!-- 评论区 -->
      <div class="comment">
        <el-skeleton-item variant="h1" style="width: 15%" />
        <div class="comment-input">
          <el-skeleton-item variant="circle" style="--el-skeleton-circle-size: 50px" />
          <el-skeleton-item variant="text" style="width: 80%; height: 72px" />
        </div>
        <el-skeleton-item variant="text" style="width: 100%" />
        <el-skeleton-item variant="text" style="width: 100%" />
        <el-skeleton-item variant="text" style="width: 100%" />
      </div>
    </template>
    <slot></slot>
  </el-skeleton>
</template>

<style lang="scss" scoped>
.comment {
  padding-top: 20px;
  .comment-input {
    display: flex;
    justify-content: space-between;
    padding: 20px 0px 40px 0px;
  }
}
</style>
