<template>
  <el-page-header @back="goBack" :title="title"> </el-page-header>
  <slot></slot>
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
.el-page-header {
  margin-bottom: 10px;
}
</style>
