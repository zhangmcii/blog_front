<script>
export default {
  props: {
    // 加载文案
    content: {
      type: String,
      default: 'loading...'
    },
    // true:闪烁   false:停止闪烁
    stop_loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['doSearch']
}
</script>

<template>
  <div v-show="stop_loading">{{ content }}</div>
</template>
<style scoped>
div {
  animation: blink 2s infinite;
}

@keyframes blink {
  0% {
    color: white;
  }

  50% {
    color: black;
  }

  100% {
    color: white;
  }
}
</style>
