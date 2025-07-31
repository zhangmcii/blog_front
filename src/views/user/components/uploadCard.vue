<script>
import ButtonClick from '@/utils/components/ButtonClick.vue'
import imageApi from '@/api/user/imageApi.js'
import uploadApi from '@/api/upload/uploadApi.js'
import { useCurrentUserStore } from '@/stores/user'
import { compressImages, uploadFiles, beforePicUpload } from '@/utils/common.js'

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
      // 上传成功后得到的key
      imageKey: [],
      // 上传成功后完整的url
      imageUrls: [],
      button: {
        type: 'primary',
        text: '提交',
        disabled: false,
        loading: false,
        icon: 'Pointer'
      }
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
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
    }
  },
  methods: {
    async getUploadToken() {
      const response = await uploadApi.get_upload_token()
      this.uploadToken = response.data.upload_token
    },
    async handleChange(file, fileList) {
      if (!beforePicUpload([file])) {
        return
      }
      this.internalFormData.coverImage = fileList
      this.originalFiles = fileList

      // 确保只添加新的文件
      const newFiles = fileList.filter((f) => !this.originalFiles.some((of) => of.uid === f.uid))
      this.originalFiles = [...this.originalFiles, ...newFiles]
      // console.log('文件列表:', this.originalFiles)
      // 压缩图像
      this.compressedImages = await compressImages(this.originalFiles, this.compressedImages)
    },
    handleRemove(file) {
      // 删除原始文件
      this.originalFiles = this.originalFiles.filter((f) => f.uid !== file.uid)
      // 删除压缩文件
      this.compressedImages = this.compressedImages.filter((img) => img.uid !== file.uid)

      // 删除表单数据
      this.internalFormData.coverImage = this.internalFormData.coverImage.filter(
        (f) => f.uid !== file.uid
      )
    },
    handleExceed(files) {
      this.$message.error('最多只能上传3张封面图片')
    },
    validateForm() {
      return new Promise((resolve) => {
        this.$refs.formRef.validate((valid) => {
          resolve(valid)
        })
      })
    },
    async submitForm() {
      // 模拟上传图片到云存储成功后，将电影信息添加到 movies 数组中
      const valid = await this.validateForm()
      if (valid) {
        this.movies = this.internalFormData.coverImage.map((item, index) => {
          this.imageNames.push(this.internalFormData[`name${index + 1}`])
          return {
            coverImage: URL.createObjectURL(item.raw),
            name: this.internalFormData[`name${index + 1}`]
          }
        })
        // console.log('预览信息:', this.movies)
        // console.log('names:', this.imageNames)
        await this.submitBlog()

        // 清空表单数据
        // this.internalFormData.coverImage = []
        // this.internalFormData.name = ''
        // this.originalFiles = []

        this.compressedImages = []
      }
    },

    async submitBlog() {
      if (!beforePicUpload(this.originalFiles)) {
        return
      }
      this.button.loading = true
      try {
        // 获取上传凭证
        await this.getUploadToken()
        // 上传图片
        const { imageKey, imageUrls } = await uploadFiles(
          this.compressedImages,
          this.currentUser.uploadInterestBaseUrl,
          this.uploadToken
        )
        this.imageKey = imageKey
        this.imageUrls = imageUrls
        console.log('imageUrls', this.imageUrls)
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
              this.button.icon = 'Check'
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
                <span @click="handleRemove(file)">
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
          :round="true"
          width="80px"
          size="small"
          @do-search="submitForm"
        >
          <el-icon>
            <i-ep-Check v-if="button.icon == 'Check'" />
            <i-ep-Pointer v-else />
          </el-icon>
        </ButtonClick>
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
