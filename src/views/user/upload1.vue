<template>
  <div>
    <el-form ref="form" :model="formData" label-width="80px">
      <el-form-item label="电影封面">
        <el-upload
          action=""
          :on-change="handleChange"
          :before-upload="beforeUpload"
          list-type="picture-card"
          :file-list="fileList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="电影名称">
        <el-input v-model="formData.movieName"></el-input>
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
  </div>
</template>

<script>
export default {
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
  methods: {
    handleChange(file, fileList) {
      this.formData.coverImage = file.raw
      this.fileList = fileList
    },
    beforeUpload(file) {
      // 这里可以进行一些图片上传前的验证操作
      return true
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
</style>
