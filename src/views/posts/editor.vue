<template>
  <PageHeadBack>
    <div class="container">
      <el-input
        v-model="content"
        :autosize="{ minRows: 8 }"
        type="textarea"
        placeholder="书写片段，温润流年..."
        :input-style="inputStyle"
        minlength="5"
        maxlength="150"
        show-word-limit
      />
      <el-upload
        ref="uploadRef"
        v-model:file-list="fileList"
        list-type="picture-card"
        :action="uploadUrl"
        :headers="{ Authorization: `UpToken ${uploadToken}` }"
        :on-change="handleChange"
        :on-error="handleUploadError"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :auto-upload="false"
        :limit="9"
        :on-exceed="handleExceed"
        multiple
      >
        <el-icon><i-ep-Plus /></el-icon>
      </el-upload>
      <el-button @click="uploadFiles" :disabled="uploading">上传图片</el-button>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </div>
    <template #action>
      <el-button type="primary" class="w-full" @click="submit">发布</el-button>
    </template>
  </PageHeadBack>
</template>

<script>
import * as qiniu from 'qiniu-js'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
import uploadApi from '@/api/upload/uploadApi.js'
export default {
  name: 'BlogPost',
  props: {},
  components: {
    PageHeadBack
  },
  data() {
    return {
      content: '',
      uploadUrl: '',
      uploadToken: '',
      imageUrls: [],
      uploading: false,

      inputStyle: {
        width: '100%',
        marginBottom: '10px',
        borderColor: '#ffffff',
        boxShadow: '0 0 0 0 #ffffff'
      },
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: []
    }
  },
  computed: {},
  mounted() {
    this.getUploadToken()
  },
  methods: {
    async getUploadToken() {
      try {
        const response = await uploadApi.get_upload_token()
        this.uploadToken = response.data.upload_token
        this.uploadUrl = 'https://upload.qiniup.com'
        console.log('获取上传凭证成功:', this.uploadToken)
      } catch (error) {
        console.error('Failed to get upload token:', error)
      }
    },
    handleUploadError(error) {
      console.error('Upload failed:', error)
      this.uploading = false
    },
    handleChange(uploadFile, uploadFiles) {
      console.log('文件', uploadFile)
      console.log('文件列表', uploadFiles)
    },
    async uploadFiles() {
      this.uploading = true
      try {
        const putExtra = {}
        const config = {
          region: qiniu.region.z0 // 根据你的存储区域选择
        }
        for (const file of this.fileList) {
          const observable = qiniu.upload(file.raw, file.name, this.uploadToken, putExtra, config)
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
                const imageUrl = `http://suv95zgla.hd-bkt.clouddn.com/${res.key}`
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
    async submitBlog() {
      // try {
      //   const blogData = {
      //     title: this.title,
      //     content: this.content,
      //     image_urls: this.imageUrls
      //   }
      //   // const response = await axios.post('/save_blog', blogData)
      //   // this.successMessage = response.data.message
      // } catch (error) {
      //   console.error('Save blog failed:', error)
      // }
    },

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
    },
    submit() {
      console.log('发布', this.content, this.fileList)
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
:deep(.el-textarea__inner) {
  /* 去掉去除右下角默认小图标 */
  resize: none;
  /* 隐藏滚动条 */
  /* overflow: hidden; */
}
</style>
