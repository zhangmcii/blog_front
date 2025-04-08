<script>
export default {
  components: {
  },
  methods: {
    clear() {
        localStorage.clear('blog')
        this.$message.sucess('清除成功')
  }
}
}
</script>
<template>
  <div class="container">
    <el-button round type="primary"  @click="clear"
      >清空缓存</el-button
    >
  </div>
</template>
<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
}
.el-button {
    width: 50%;
}
</style>
