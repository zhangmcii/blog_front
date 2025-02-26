<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    throttle: {
      type: Object,
      default: { leading: 300, trailing: 300, initVal: true }
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
        return {
        }
      }
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<template>
  <el-skeleton animated :loading="loading" :count="count" :throttle="throttle">
    <template #template>
      <el-card shadow="hover" :style="cardStyle">
        <div class="skeleton-container">
          <el-skeleton-item
            variant="circle"
            style="--el-skeleton-circle-size: 40px"
            v-if="showAvatar"
          />
          <div class="item">
            <el-skeleton-item variant="text" style="width: 40%" />
            <el-skeleton-item variant="text" v-for="item in row - 2" :key="item" />
            <el-skeleton-item variant="text" style="width: 60%" />
          </div>
        </div>
      </el-card>
    </template>
    <slot></slot>
  </el-skeleton>
</template>
<style scoped>
:deep(.el-card__body) {
  padding: 5px 20px;
}
.skeleton-container {
  display: flex;
  gap: 10px;
}
.item {
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
