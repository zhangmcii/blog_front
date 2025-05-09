<script>
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
      fileList: [],
      movies: [],
    }
  },
  computed: {
    selectShow() {
      return this.fileList.length >= 3 - this.interest.length ? 'none' : 'inline-flex'
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
  methods: {
    handleChange(file, fileList) {
      this.internalFormData.coverImage = fileList
      this.fileList = fileList
    },
    handleExceed(files) {
      this.$message.error('最多只能上传3张封面图片')
    },
    submitForm() {
      // 模拟上传图片到云存储成功后，将电影信息添加到 movies 数组中
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.movies = this.internalFormData.coverImage.map((item, index) => {
            return {
              coverImage: URL.createObjectURL(item.raw),
              movieName: this.internalFormData[`name${index + 1}`]
            }
          })
          console.log('预览信息:', this.movies)
          // this.internalFormData.coverImage = null
          // this.internalFormData.movieName = ''
          // this.fileList = []
        }
      })
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
        v-for="(item, index) in fileList"
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
        <div>{{ movie.movieName }}</div>
      </div>
    </div>
    <el-divider></el-divider>
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
