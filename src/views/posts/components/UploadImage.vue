<script>
export default {
  components: {},
  data() {
    return {
      fileList: [],
      uploadToken: '',
      imageUrls: [],
      uploading: false,
      imageKey: [],

      dialogVisible: false,
      dialogImageUrl: '',
    }
  },
  mounted() {
    this.getUploadToken()
  },
  methods:{
    async getUploadToken() {
      try {
        const response = await uploadApi.get_upload_token()
        this.uploadToken = response.data.upload_token
        console.log('获取上传凭证成功:', this.uploadToken)
      } catch (error) {
        console.error('Failed to get upload token:', error)
      }
    },
    beforePicUpload(fileList) {
      for (const file of fileList) {
        const limitPic =
          file.raw.type === 'image/png' ||
          file.raw.type === 'image/jpg' ||
          file.raw.type === 'image/jpeg'
        if (!limitPic) {
          this.$message.warning('请上传格式为png/jpg/jpeg的图片')
          return false
        }
      }
      return true
    },
    async uploadFiles() {
      if (!this.beforePicUpload(this.fileList)) {
        return
      }
      const domin = import.meta.env.VITE_QINIU_DOMAIN
      this.uploading = true
      try {
        const putExtra = {}
        const config = {
          // 存储区域
          region: qiniu.region.z0
        }
        for (const file of this.fileList) {
          // uuid保证存储的文件名唯一
          const uniqueFileName = `${uuidv4()}.${file.name.split('.').pop()}`
          const observable = qiniu.upload(file.raw, uniqueFileName, this.uploadToken, putExtra, config)
          await new Promise((resolve, reject) => {
            // 保存 this 上下文
            const self = this
            observable.subscribe({
              next() {},
              error(err) {
                reject(err)
              },
              complete(res) {
                console.log('Upload complete:', res)
                self.imageKey.push(res.key)
                const imageUrl = `http://${domin}/${res.key}`
                self.imageUrls.push(imageUrl)
                resolve()
              }
            })
          })
        }
      } catch (error) {
        console.error('Upload failed:', error)
      } finally {
        console.log('上传完成的图片', this.imageUrls)
        this.uploading = false
      }
    },
  }
}
</script>
<template>
  <el-upload
    ref="uploadRef"
    v-model:file-list="fileList"
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :auto-upload="false"
    :limit="9"
    :on-exceed="handleExceed"
    multiple
  >
    <el-icon><i-ep-Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>
<style scoped></style>
