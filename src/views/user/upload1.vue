<template>
  <div>
    <el-form ref="form" :model="formData" label-width="80px">
      <el-form-item label="电影封面">
        <el-upload
          ref="upload"
          v-model:file-list="fileList"
          list-type="picture-card"
          :auto-upload="false"
          :on-change="handleChange"
          :before-upload="() => false"
          :on-exceed="handleExceed"
          multiple
          :limit="3"
        >
          <el-icon><i-ep-Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item :label="`封面名称${index + 1}`" v-for="(item, index) in fileList" :key="index">
        <el-input v-model="formData.movieName"></el-input>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item> -->
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

<script>
import { genFileId } from 'element-plus'
export default {
  props: {
    interest: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {},
  data() {
    return {
      formData: {
        movieName: '',
        coverImage: null
      },
      fileList: [],
      movies: []
    }
  },
  computed: {
    selectShow() {
      return this.fileList.length >= 3 - this.interest.length ? 'none' : 'inline-flex'
    }
  },
  methods: {
    handleChange(file, fileList) {
      this.formData.coverImage = file.raw
      this.fileList = fileList
    },
    handleExceed(files) {
      // this.$refs.upload.clearFiles()
      // const file = files[0]
      // file.uid = genFileId()
      // this.$refs.upload.handleStart(file)
      this.$message.error('最多只能上传3张封面图片')
    },
    submitForm() {
      // 模拟上传图片到云存储成功后，将电影信息添加到 movies 数组中
      if (this.formData.coverImage && this.formData.movieName) {
        this.movies.push({
          coverImage: URL.createObjectURL(this.formData.coverImage),
          movieName: this.formData.movieName
        })
        this.formData.coverImage = null
        this.formData.movieName = ''
        this.fileList = []
      }
    }
  }
}
</script>

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
