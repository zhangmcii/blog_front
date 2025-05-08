<script>
export default {
  props: {
    postContent: {
      type: String,
      default: ''
    },
    preview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
   
  },
  methods: {}
}
</script>

<template>
  <el-row class="text">
    <el-text v-if="preview" line-clamp="4" v-html="postContent"></el-text>
    <el-text v-else v-html="postContent"></el-text>
  </el-row>
</template>

<style lang="scss" scoped>
.text {
  margin: 10px 0px 10px 5px;
  .el-text {
    color: #303133;
    // 0.875rem = 14px
    font-size: 0.875rem;
    line-height: 1.6;
    letter-spacing: 0.04em;
  }
}
</style>
