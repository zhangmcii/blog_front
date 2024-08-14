<script>
import AppAside from './AppAside.vue'
export default {
  components: [AppAside]
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside>
        <AppAside />
      </el-aside>
      <el-main>
        main
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<style>
:root {
  --el-aside-width: auto;
}
.el-aside {
  width: var(--el-aside-width);
}
</style>
