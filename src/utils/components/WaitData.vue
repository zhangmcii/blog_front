<!-- 父组件使用
  <WaitData content="加载中..." :stop_loading="loading" />
-->
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
    },
    // 文字出现的位置 'center', 'left', 'right'
    position:{
      type:String,
      default:'center'
    }
  },
  emits: ['doSearch']
}
</script>

<template>
  <div v-show="stop_loading">
    <el-text>
      {{ content }}
    </el-text>
   </div>
</template>
<style scoped>
div {
  width: 100%;
  text-align: v-bind(position);
}
.el-text {
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
