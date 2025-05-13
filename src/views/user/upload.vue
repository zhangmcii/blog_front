<template>
    <PageHeadBack>
      <div class="container">
        <div>兴趣</div>
        <el-upload
          ref="uploadRef"
          v-model:file-list="fileList"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :auto-upload="false"
          :limit="3"
          :on-exceed="handleExceed"
          multiple
        >
          <el-icon><i-ep-Plus /></el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </div>
      <template #action>
        <ButtonClick content="发布" size="small" :disabled="ban_pub" @do-search="submitBlog">
          <el-icon><i-ep-Pointer /></el-icon>
        </ButtonClick>
      </template>
    </PageHeadBack>
  </template>
  
  <script>
  import * as qiniu from 'qiniu-js'
  import PageHeadBack from '@/utils/components/PageHeadBack.vue'
  import ButtonClick from '@/utils/components/ButtonClick.vue'
  import { useCurrentUserStore } from '@/stores/user'
  import uploadApi from '@/api/upload/uploadApi.js'
  import imageApi from '@/api/user/imageApi.js'
  import { v4 as uuidv4 } from 'uuid'
  import emitter from '@/utils/emitter.js'
  
  export default {
    name: 'BlogPost',
    props: {},
    components: {
      PageHeadBack,
      ButtonClick
    },
    data() {
      return {
        uploadToken: '',
        imageUrls: [],
        uploading: false,
        imageKey: [],
  
        dialogVisible: false,
        dialogImageUrl: '',
        fileList: []
      }
    },
    setup() {
      const currentUser = useCurrentUserStore()
      return { currentUser }
    },
    computed: {
      ban_pub() {
        return  this.fileList.length === 0
      }
    },
    mounted() {
      this.getUploadToken()
    },
    methods: {
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
          const isImage = file.raw.type.startsWith('image/')
          if (!isImage) {
            this.$message.error('只能上传图片文件！')
            return false
          }
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
        const domin = import.meta.env.VITE_QINIU_DOMAIN
        this.uploading = true
        try {
          const putExtra = {}
          const config = {
            // 存储区域
            region: qiniu.region.z0
          }
          for (const file of this.fileList) {
            const folder = this.currentUser.uploadInterestBaseUrl
            const uniqueFileName = `${uuidv4()}.${file.name.split('.').pop()}`
            const key = folder + uniqueFileName
            const observable = qiniu.upload(file.raw, key, this.uploadToken, putExtra, config)
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
      async submitBlog() {
        if (this.fileList.length === 0) {
          this.$message.error('图片不能为空')
          return
        }
        if (!this.beforePicUpload(this.fileList)) {
          return
        }
        const loadingInstance = this.$loading({
          lock: true,
          text: 'Loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        try {
          await this.uploadFiles()
          imageApi
            .saveInterestImage({ urls: this.imageKey,type:'movie',names:[] })
            .then((response) => {
              if (response.data.msg === 'success') {
                this.$message.success('发布成功')
                this.fileList = []
                emitter.emit('newPost', response.data.data)
                this.$router.push('/posts')
              }
              loadingInstance.close()
            })
            .catch((error) => {
              loadingInstance.close()
              if (error.response.status === 429) {
                uploadApi.del_image(this.imageKey)
                this.$message.info('今天的发布次数已达上限～')
              }
            })
        } catch (error) {
          console.error('Submit blog failed:', error)
          loadingInstance.close()
        }
      },
      handlePictureCardPreview(uploadFile) {
        this.dialogImageUrl = uploadFile.url
        this.dialogVisible = true
      },
      handleExceed() {
        this.$message.info('最多只能上传3张图片')
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
  .note {
    padding: 5px;
  }
  </style>
  