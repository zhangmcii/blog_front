<script>
import 'github-markdown-css/github-markdown.css'

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
  computed: {},
  methods: {}
}
</script>

<template>
  <el-row class="text">
    <el-text
      v-if="preview"
      line-clamp="4"
      v-html="postContent"
      class="markdown-body preview"
    ></el-text>
    <div v-else v-html="postContent" class="markdown-body"></div>
  </el-row>
</template>

<style lang="scss" scoped>
.text {
  margin: 10px 0px 10px 5px;
  .base {
    // 0.875rem = 14px
    font-size: 0.875rem;
    line-height: 1.6;
    letter-spacing: 0.04em;
  }
  .preview {
    @extend .base;
    color: #303133;

    /* 设置最大高度  只会影响特长的表格，不会影响正常的文本段*/
    max-height: 300px; 
    overflow: hidden;
    display: -webkit-box; 
    -webkit-line-clamp: 5; /* 显示的行数 */
    -webkit-box-orient: vertical;
  }
  // 复用.preview样式
  .markdown-body {
    @extend .base;
    box-sizing: border-box;
    width: 99%;
  }
}
</style>
