<script>
import AppAside from './AppAside.vue'
export default {
  components: [AppAside]
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="140px">
        <AppAside />
      </el-aside>
      <el-main>
        main
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>
