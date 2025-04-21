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
      <el-button :disabled="uploading"  @click="submitBlog">上传图片</el-button>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </div>
    <template #action>
      <!-- <el-button type="primary" class="w-full" @click="submitBlog">发布</el-button> -->
    </template>
  </PageHeadBack>
</template>

<script>
import * as qiniu from 'qiniu-js'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
import uploadApi from '@/api/upload/uploadApi.js'
import postApi from '@/api/posts/postApi.js'
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
      imageKey: [],

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
    beforePicUpload(fileList) {
      console.log('beforePicUpload')
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
      console.log('获取的域名', domin)
      this.uploading = true
      try {
        const putExtra = {}
        const config = {
          // 存储区域
          region: qiniu.region.z0
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
                self.imageKey.push(res.key)
                const imageUrl = `http://${domin}/${res.key}`
                self.imageUrls.push(imageUrl)
                console.log('resolve')
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
      try {
        await this.uploadFiles()
        postApi
          .publishRichPost({ content: this.content, imageUrls: this.imageKey })
          .then((response) => {
            if (response.data.msg === 'success') {
              this.$message.success('发布成功')
            }
          })
      } catch (error) {
        console.error('Submit blog failed:', error)
      }
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
<!-- imageMogr2/quality/80 -->

<!-- "{"callback_url":"http://172.18.66.95:8082/upload_callback","callback_bodyType":"application/json",
"callback_body":"filename=\"pic2.jpeg\"\u0026filesize=9176\u0026blog_text=\"这是一张好看的图片\"","token":"","err_code":502,"error":"Post
\"http://172.18.66.95:8082/upload_callback\": dial tcp 172.18.66.95:8082: connect: no route to
host","hash":"FuzKjRDBMYPzs_8BS-zZeOM_sUy0","key":"pic2.jpeg"}" -->
