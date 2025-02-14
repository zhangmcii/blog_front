<template>
  <div class="container">
  <el-page-header @back="goBack" :title="title"> </el-page-header>
  <slot></slot>
</div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '返回'
    }
  },
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style scoped>
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.el-page-header {
  margin-bottom: 10px;
}
</style>
