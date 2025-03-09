<script setup>
import AppHeader from './AppHeader.vue'
import { Scrollbar } from 'vue-amazing-ui'
import 'vue-amazing-ui/es/scrollbar/Scrollbar.css'
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
          <keep-alive>
            <component v-if="route.meta.keepAlive" :is="Component" :key="route.name" />
          </keep-alive>
          <component v-if="!route.meta.keepAlive" :is="Component" :key="route.name" />
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
  padding:0px;
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
</style>
