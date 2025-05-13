<script>
export default {
  props: {
    interest: {
      type: Array,
      default() {
        return [
          {
            url: '',
            describe: ''
          }
        ]
      }
    }
  },
  data() {
    return {
      activeName: 'first',
      preList: []
    }
  },
  watch: {
    interest: {
      handler(newVal) {
        this.preList = newVal.map((item) => {
          return item.url
        })
      },
      deep: true
    }
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>

<template>
  <el-row :gutter="1" class="bookshelf">
    <el-col :span="8" v-for="(movie, index) in interest" :key="index">
      <div class="book">
        <!-- <el-text class="book-badge">{{ index + 1 }}</el-text> -->
        <el-image
          :src="movie.url"
          fit="cover"
          :preview-src-list="preList"
          :initial-index="index"
        ></el-image>
        <el-text class="book-name" truncated>{{ movie.describe }}</el-text>
      </div>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.bookshelf {
  width: 100%;
}
:deep(.van-badge) {
  border: none;
  color: green;
}
.book {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 10px 0px;
  .book-badge {
    position: absolute;
    color: green;
    left: 2px;
    top: 0px;
    z-index: 2;
  }
  .el-image {
    width: 117px;
    height: 198px;
  }
  .book-name {
    width: 100%;
    margin-top: 3px;
    color: #303133;
    font-size: 0.875rem;
    line-height: 1.6;
  }
}
</style>
