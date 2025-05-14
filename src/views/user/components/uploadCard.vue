<script>
import ButtonClick from '@/utils/components/ButtonClick.vue'
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
    },
    type: {
      type: String,
      default: 'movie'
    }
  },
  components: {
    ButtonClick
  },
  emits: ['update:formData'],

  data() {
    return {
      uploadToken: '',
      movies: [],
      // 封面对应的名称
      imageNames: [],
      // 原始文件
      originalFiles: [],
      // 压缩后的文件
      compressedImages: [],
      // 默认压缩比率为80%
      compressedRatio: 80,
      // 上传成功后得到的key
      imageKey: [],
      // 上传成功后完整的url
      imageUrls: [],
      button: {
        type: 'primary',
        text: '提交',
        disabled: false,
        loading: false
      },
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
    },
    areaName() {
      if (this.type === 'movie') {
        return '电影封面'
      } else if (this.type === 'book') {
        return '书籍封面'
      } else {
        return '封面'
      }
    },
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
    handleRemove(file) {
      // 删除原始文件
      this.originalFiles = this.originalFiles.filter((f) => f.uid !== file.uid)
      // 删除压缩文件
      this.compressedImages = this.compressedImages.filter((img) => img.uid !== file.uid)
      
      // 删除表单数据
      this.internalFormData.coverImage = this.internalFormData.coverImage.filter((f) => f.uid !== file.uid)
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

        // console.log('压缩后的文件:', compressedFile)
        // console.log(`压缩后大小: ${(compressedFile.file.size / 1024).toFixed(2)} KB`)

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
          // this.internalFormData.coverImage = []
          // this.internalFormData.name = ''
          // this.originalFiles = []
          this.compressedImages = []
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
      this.button.loading = true
      try {
        await this.uploadFiles()
        imageApi
          .saveInterestImage(this.currentUser.userInfo.id, {
            urls: this.imageKey,
            names: this.imageNames,
            type: this.type
          })
          .then((response) => {
            if (response.data.msg === 'success') {
              // const interestType = this.type === 'movie' ? '电影封面' : '书籍封面'
              // this.$message.success(`${interestType}提交成功`)
              this.button.loading = false
              this.button.type = 'success'
              this.button.text = '提交成功'
              this.button.disabled = true
              // 提交成功后改变提交按钮颜色和文字

              // this.originalFiles = []
              // this.$router.push('/user/')
            }
          })
          .catch((error) => {
            this.button.loading = false
            console.log('555', error)
            if (error.response && error.response.status === 429) {
              uploadApi.del_image(this.imageKey)
              this.$message.info('今天的发布次数已达上限～')
            }
          })
      } catch (error) {
        this.button.loading = false
      }
    }
  }
}
</script>
<template>
  <div>
    <el-form ref="formRef" :model="internalFormData" label-width="80px">
      <el-form-item
        :label="areaName"
        prop="coverImage"
        :rules="[{ required: true, message: '图片不能为空' }]"
      >
        <el-upload
          ref="upload"
          v-model:file-list="originalFiles"
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
          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span
                  @click="handleRemove(file)"
                >
                  <el-icon><i-ep-Delete /></el-icon>
                </span>
              </span>
            </div>
          </template>
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
        <ButtonClick
          :type="button.type"
          :disabled="button.disabled"
          :content="button.text"
          :loading="button.loading"
          @do-search="submitForm"
        />
      </el-form-item>
    </el-form>
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
