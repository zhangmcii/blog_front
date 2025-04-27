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
      // const urls = [
      //   'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
      //   'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
      //   'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
      //   'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
      //   'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
      //   'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
      //   'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
      // ]
      return urls
    }
  },
  methods: {}
}
</script>

<template>
  <div class="container">
    <div class="preview">
      <photo-provider :photo-closable="true" :should-transition="true">
        <photo-consumer v-for="(url, index) in postUrls" :intro="url" :key="url" :src="url">
          <el-image :src="url" lazy fit="cover">
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
