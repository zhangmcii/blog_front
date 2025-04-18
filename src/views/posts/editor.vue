<template>
  <div class="container">
    <el-input
      v-model="textarea2"
      :autosize="{ minRows: 4, maxRows: 10 }"
      type="textarea"
      placeholder="书写片段，温润流年..."
      :input-style="inputStyle"
    />
    <el-upload
      v-model:file-list="fileList"
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :auto-upload="false"
      multiple
      :limit="9"
      :on-exceed="handleExceed"
    >
      <el-icon><i-ep-Plus /></el-icon>
    </el-upload>

    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script>
import { UEditor } from 'undraw-ui'
export default {
  name: 'BlogPost',
  props: {},
  components: {
    UEditor
  },
  data() {
    return {
        textarea2: '',
      inputStyle: {
        width: '100%',
        marginBottom: '10px',
        borderColor: '#ffffff',
        boxShadow: '0 0 0 0 #ffffff'
      },
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: [
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ]
    }
  },
  computed: {
    imgList() {
      return this.fileList.map((item) => item.url)
    }
  },
  methods: {
    handleRemove(uploadFile, uploadFiles) {
      console.log(uploadFile, uploadFiles)
    },
    handlePictureCardPreview(uploadFile) {
      this.dialogImageUrl = uploadFile.url
      this.dialogVisible = true
    },
    handleExceed() {
      console.log('超过了')
      this.$message.info('最多只能上传9张图片')
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.el-textarea__inner {
  /* 去掉去除右下角默认小图标 */
  resize: none;
  /* 隐藏滚动条 */
  overflow: hidden;
}</style>
