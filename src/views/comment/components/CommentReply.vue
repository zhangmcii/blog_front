<script>
export default {
  data() {
    return {
        drawer:false
    }
  },
  mounted() {},
  methods: {}
}
</script>

<template>
  <el-drawer
    v-model="drawer"
    title="I am the title"
    direction="btt"
    :before-close="handleClose"
  >
    <span>评论</span>
  </el-drawer>
</template>
<style scoped></style>
