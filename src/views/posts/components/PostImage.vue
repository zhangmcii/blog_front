<script>
export default {
  props: {
    post_images: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    postUrls() {
      const urls = []
      const domain = import.meta.env.VITE_QINIU_DOMAIN
      this.post_images.forEach((key) => {
        const imageUrl = `http://${domain}/${key}-slim`
        urls.push(imageUrl)
      })
      return urls
    }
  },
  methods: {}
}
</script>

<template>
  <el-row :gutter="4" class="preview">
    <el-col :span="8" v-for="(url, index) in postUrls" :key="index">
      <el-image :src="url" lazy fit="cover" :preview-src-list="postUrls" :initial-index="index">
        <template #placeholder>
          <div class="image-slot">Loading<span class="dot">...</span></div>
        </template>
        <template #error>
          <div class="image-slot">
            <el-icon><i-ep-picture /></el-icon>
          </div>
        </template>
      </el-image>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.preview {
  width: 370px;
  margin: 0px 0px 15px 0px;
}
.el-image {
  width: 100%;
  height: 121px;
  margin-left: 5px;
  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 14px;
    .dot {
      animation: dot 2s infinite steps(3, start);
      overflow: hidden;
    }
  
    .el-icon {
      font-size: 30px;
    }
  }
}
</style>
