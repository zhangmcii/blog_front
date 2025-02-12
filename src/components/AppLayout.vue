<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import routes from '@/router/routes.js'
import AppHeader from './AppHeader.vue'
import { Scrollbar } from 'vue-amazing-ui'
import 'vue-amazing-ui/es/scrollbar/Scrollbar.css'

const route = useRoute()
const transitionName = ref('go')
watch(
  () => route.path,
  (to, from) => {
    //底部tab的按钮，跳转是不需要用动画的
    let noAnimation = [
      '/',
      '/home',
      '/slide',
      '/me',
      '/shop',
      '/message',
      '/publish',
      '/home/live',
      'slide',
      '/test'
    ]

    // 如果路由的from和to在noAnimation中，那么返回 transitionName设置为''
    if (noAnimation.indexOf(from) !== -1 && noAnimation.indexOf(to) !== -1) {
      return (transitionName.value = '')
    }
    const toDepth = routes[0].children.findIndex((v) => v.path === to)
    const fromDepth = routes[0].children.findIndex((v) => v.path === from)
    // go对应左移，from对应右移
    transitionName.value = toDepth > fromDepth ? 'back' : 'go'
  }
)
</script>

<template>
  <el-container>
    <el-header>
      <AppHeader />
    </el-header>
    <el-divider />
    <el-main>
      <Scrollbar ref="scrollbar" class="Scrollbar">
        <router-view v-slot="{ Component, route }">
          <transition :name="transitionName">
            <div :key="route.name">
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </Scrollbar>
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
.Scrollbar {
  height: calc(100vh - 45px - var(--el-main-padding) * 2 - 3vh);
}

.el-divider--horizontal {
  margin: 2px 0px;
}


.go-enter-from {
  transform: translate3d(100%, 0, 0);
}

.back-enter-to,
.back-enter-from,
.go-enter-to,
.go-leave-from {
  transform: translate3d(0, 0, 0);
}

.go-leave-to {
  transform: translate3d(-100%, 0, 0);
}

.go-enter-active,
.go-leave-active,
.back-enter-active,
.back-leave-active {
  transition: all 0.3s;
}

.back-enter-from {
  transform: translate3d(-100%, 0, 0);
}

.back-leave-to {
  transform: translate3d(100%, 0, 0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
