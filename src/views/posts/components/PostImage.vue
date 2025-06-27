<script>
export default {
  props: {
    postImages: {
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
  methods: {}
}
</script>

<template>
  <div class="container">
    <div class="preview">
      <photo-provider :photo-closable="true" :should-transition="true">
        <photo-consumer v-for="(url, index) in postImages" :intro="url" :key="url" :src="url">
          <el-image alt="文章图片" :src="url" lazy fit="cover">
            <template #error>
              <div class="image-slot">
                <el-icon><i-ep-picture /></el-icon>
              </div>
            </template>
          </el-image>
        </photo-consumer>
      </photo-provider>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  width: 370px;
  .preview {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 每行 3 列 */
    gap: 5px; /* 图片之间的间距 */
    width: 100%;
    margin: 0 auto; /* 居中对齐 */
    .el-image {
      width: 100%;
      aspect-ratio: 1; /* 保持图片为正方形 */
      .image-slot {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: var(--el-fill-color-light);
        color: var(--el-text-color-secondary);
        font-size: 14px;
        .el-icon {
          font-size: 30px;
        }
      }
    }
  }
}
</style>
