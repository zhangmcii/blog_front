<script>
import AppHeader from './AppHeader.vue'
import emitter from '@/utils/emitter.js'
export default {
  components: {
    AppHeader
  },
  mounted() {},
  methods: {
    handleScroll({ scrollLeft, scrollTop }) {
      // 使用$refs获取el-scrollbar组件的根元素
      const scrollbar = this.$refs.scrollbar;
      
      // 获取滚动容器的引用，el-scrollbar组件内部的滚动容器通常有一个类名为.el-scrollbar__wrap
      const scrollbarWrap = scrollbar.$el.querySelector('.el-scrollbar__wrap');

      // 滚动容器的总高度
      const containerHeight = scrollbarWrap.scrollHeight;
      // 滚动容器的可视高度
      const visibleHeight = scrollbarWrap.clientHeight;

      // 检查是否滚动到底部
      if (scrollTop + visibleHeight >= containerHeight - 10) {
        // 执行到底部的相关操作
        emitter.emit('scroll')
      }
    },
    
  }
}
</script>

<template>
  <el-container>
    <el-header>
      <AppHeader />
    </el-header>
    <el-divider />
    <el-main>
      <el-scrollbar ref="scrollbar" @scroll="handleScroll">
        <router-view />
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<style scoped>
body {
  /* 移动端点击可点击元素时，出现蓝色默认背景色 */
  -webkit-tap-highlight-color: transparent;
}
.el-header {
  height: 45px;
}
/* 45px header高度
     3vh 是随机添加的
  */
.el-scrollbar {
  height: calc(100vh - 45px - var(--el-main-padding) * 2 - 3vh);
}

.el-divider--horizontal {
  margin: 2px 0px;
}
</style>
