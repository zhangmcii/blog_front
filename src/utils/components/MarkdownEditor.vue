<template>
  <div class="markdown-editor">
    <mavon-editor
      ref="mavonEditor"
      v-model="markdown"
      @imgAdd="handleImageUpload"
      @change="change"
    />
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import { useCurrentUserStore } from '@/stores/user'
import { compressImages, beforePicUpload } from '@/utils/common.js'
import uploadApi from '@/api/upload/uploadApi.js'
import { v4 as uuidv4 } from 'uuid'
import * as qiniu from 'qiniu-js'

export default {
  name: 'MarkdownEditor',
  props: {
    bodyInit: {
      type: String,
      default: () => ''
    },
    bodyHtmlInit: {
      type: String,
      default: () => ''
    }
  },
  emits: ['contentChange'],
  data() {
    return {
      markdown: '',
      md: new MarkdownIt(),

      uploadToken: '',
      imageUrls: [],
      imageKey: [],

      // 原始文件
      originalFiles: [],
      // 压缩后的文件
      compressedImages: [],
      // 默认压缩比率为80%
      compressedRatio: 80
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  mounted() {
    this.markdown = this.bodyInit || ''
    this.getUploadToken()
  },
  methods: {
    async handleImageUpload(pos, file) {
      // 包装成 el-upload 格式
      const uid = uuidv4()
      file.uid = uid
      file.pos = pos
      const uploadFile = {
        name: file.name,
        uid: uid,
        status: 'ready',
        raw: file
      }
      if (!beforePicUpload([uploadFile])) {
        return
      }

      console.log('图片选择:', pos, uploadFile)
      // 图片上传逻辑可在此补充
      // 例如上传后调用 this.$refs.mavonEditor.$img2Url(pos, imageUrl)

      // 压缩图片

      // 确保只添加新的文件
      // const newFiles = fileList.filter(
      //   (f) => !this.originalFiles.some((of) => of.lastModified === f.lastModified)
      // )
      this.originalFiles = [...this.originalFiles, uploadFile]
      // console.log('文件列表:', this.originalFiles)
      this.compressedImages = await compressImages(this.originalFiles, this.compressedImages)
    },

    async uploadPhotos() {
      if (!beforePicUpload(this.originalFiles)) {
        return
      }
      // 上传至七牛云
      await this.uploadFiles()
      return this.imageKey
    },
    change(value) {
      this.$emit('contentChange', {
        body: value,
        bodyHtml: this.md.render(value)
      })
    },
    clean() {
      this.markdown = ''
    },
    async getUploadToken() {
      const response = await uploadApi.get_upload_token()
      this.uploadToken = response.data.upload_token
    },
    async uploadFiles() {
      const domin = import.meta.env.VITE_QINIU_DOMAIN
      try {
        const putExtra = {}
        const config = {
          // 存储区域
          region: qiniu.region.z0
        }
        for (const file of this.compressedImages) {
          const folder = this.currentUser.uploadMarkdownBaseUrl
          const uniqueFileName = `${uuidv4()}.${file.name.split('.').pop()}`
          const key = folder + uniqueFileName
          const observable = qiniu.upload(file.blob, key, this.uploadToken, putExtra, config)
          await new Promise((resolve, reject) => {
            // 保存 this 上下文
            const self = this
            observable.subscribe({
              next() {},
              error(err) {
                reject(err)
              },
              complete(res) {
                self.imageKey.push({ pos: file.pos, url: res.key })
                const imageUrl = `http://${domin}/${res.key}`
                self.imageUrls.push(imageUrl)
                console.log('替换开始' )
                self.$refs.mavonEditor.$img2Url(file.pos, imageUrl)
                console.log('替换结束')
                resolve()
              }
            })
          })
        }
        this.$emit('uploadComplete', this.imageKey)
      } catch (error) {
        console.error('Upload failed:', error)
      } finally {
        console.log('上传完成:', this.imageKey)
      }
    }
  }
}
</script>

<style scoped></style>
