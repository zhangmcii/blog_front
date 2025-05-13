<script>
import imageApi from '@/api/user/imageApi.js'
import uploadApi from '@/api/upload/uploadApi.js'
import { useCurrentUserStore } from '@/stores/user'
import { debounce } from '@/utils/common.js'
import { v4 as uuidv4 } from 'uuid'
import * as qiniu from 'qiniu-js'
import lrz from 'lrz'

export default {
  props: {
    // 已有的电影数组
    interest: {
      type: Array,
      default() {
        return []
      }
    },
    // 表单数据
    formData: {
      type: Object,
      default() {
        return {
          coverImage: [],
          name1: '',
          name2: '',
          name3: ''
        }
      }
    }
  },
  components: {},
  emits: ['update:formData'],

  data() {
    return {
      uploadToken: '',
      movies: [],
      // 封面对应的名称
      imageNames:[],
      // 原始文件
      originalFiles: [],
      // 压缩后的文件
      compressedImages: [],
      // 默认压缩比率为80%
      compressedRatio: 80,
      // 上传成功后得到的key
      imageKey: [],
      // 上传成功后完整的url
      imageUrls: []
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  created() {
    this.debounceCompress = debounce(this.compressImages, 100)
  },
  computed: {
    selectShow() {
      return this.originalFiles.length >= 3 - this.interest.length ? 'none' : 'inline-flex'
    },
    internalFormData: {
      get() {
        return this.formData
      },
      set(value) {
        this.$emit('update:formData', value)
      }
    }
  },
  mounted() {
    this.getUploadToken()
  },
  methods: {
    async getUploadToken() {
      const response = await uploadApi.get_upload_token()
      this.uploadToken = response.data.upload_token
    },
    handleChange(file, fileList) {
      this.internalFormData.coverImage = fileList
      this.originalFiles = fileList

      // 确保只添加新的文件
      const newFiles = fileList.filter((f) => !this.originalFiles.some((of) => of.uid === f.uid))
      this.originalFiles = [...this.originalFiles, ...newFiles]
      console.log('文件列表:', this.originalFiles)
      this.debounceCompress()
    },
    handleExceed(files) {
      this.$message.error('最多只能上传3张封面图片')
    },
    async compressImages() {
      const compressionRatio = this.compressedRatio / 100

      // 找出未压缩的文件
      const uncompressedFiles = this.originalFiles.filter(
        (file) => !this.compressedImages.some((img) => img.uid === file.uid)
      )

      for (const file of uncompressedFiles) {
        const rawFile = file.raw
        const compressedFile = await lrz(rawFile, { quality: compressionRatio })

        console.log('压缩后的文件:', compressedFile)
        console.log(`压缩后大小: ${(compressedFile.file.size / 1024).toFixed(2)} KB`)

        // 将 base64 转换为 Blob
        const byteString = atob(compressedFile.base64.split(',')[1])
        const mimeString = compressedFile.base64.split(',')[0].split(':')[1].split(';')[0]
        const arrayBuffer = new ArrayBuffer(byteString.length)
        const uintArray = new Uint8Array(arrayBuffer)
        for (let i = 0; i < byteString.length; i++) {
          uintArray[i] = byteString.charCodeAt(i)
        }
        const blob = new Blob([arrayBuffer], { type: mimeString })

        this.compressedImages.push({
          src: compressedFile.base64,
          blob, // 保存 Blob 对象
          name: rawFile.name,
          uid: rawFile.uid,
          sizeInfo: `压缩后大小: ${(compressedFile.file.size / 1024).toFixed(2)} KB`
        })
      }
    },
    submitForm() {
      // 模拟上传图片到云存储成功后，将电影信息添加到 movies 数组中
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.movies = this.internalFormData.coverImage.map((item, index) => {
            this.imageNames.push(this.internalFormData[`name${index + 1}`])
            return {
              coverImage: URL.createObjectURL(item.raw),
              name: this.internalFormData[`name${index + 1}`]
            }
          })
          console.log('预览信息:', this.movies)
          console.log('names:', this.imageNames)
          this.submitBlog()

          // 清空表单数据
          // this.internalFormData.coverImage = null
          // this.internalFormData.name = ''
          // this.originalFiles = []
        }
      })
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
        for (const file of this.compressedImages) {
          const folder = this.currentUser.uploadArticlesBaseUrl
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
        this.uploading = false
      }
    },

    async submitBlog() {
      const loadingInstance = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        await this.uploadFiles()
        imageApi
          .saveInterestImage(this.currentUser.userInfo.id, {
            urls: this.imageKey,
            names: this.imageNames,
            type: 'movie'
          })
          .then((response) => {
            if (response.data.msg === 'success') {
              this.$message.success('发布成功')
              // this.originalFiles = []
              // this.$router.push('/user/')
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
        loadingInstance.close()
      }
    }
  }
}
</script>
<template>
  <div>
    <el-form ref="formRef" :model="internalFormData" label-width="80px">
      <el-form-item
        label="电影封面"
        prop="coverImage"
        :rules="[{ required: true, message: '图片不能为空' }]"
      >
        <el-upload
          ref="upload"
          v-model:file-list="internalFormData.coverImage"
          list-type="picture-card"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          :auto-upload="false"
          :before-upload="() => false"
          :on-change="handleChange"
          :on-exceed="handleExceed"
          :limit="3"
          multiple
        >
          <el-icon><i-ep-Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item
        :label="`封面名称${index + 1}`"
        label-width="auto"
        v-for="(item, index) in originalFiles"
        :key="index"
        :prop="`name${index + 1}`"
        :rules="[{ required: true, message: '封面名称不能为空' }]"
      >
        <el-input v-model="internalFormData[`name${index + 1}`]"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
    <div class="movie-list">
      <div class="movie-item" v-for="(movie, index) in movies" :key="index">
        <img :src="movie.coverImage" alt="电影封面" />
        <div>{{ movie.name }}</div>
      </div>
    </div>
    <!-- <el-divider></el-divider> -->
  </div>
</template>
<style scoped>
.movie-list {
  display: flex;
  flex-wrap: wrap;
}

.movie-item {
  width: 33.33%;
  padding: 10px;
  box-sizing: border-box;
}

.movie-item img {
  width: 100%;
  height: auto;
}
:deep(.el-upload--picture-card) {
  display: v-bind(selectShow);
}
</style>
