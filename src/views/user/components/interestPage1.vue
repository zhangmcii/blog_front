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
      deep: true,
      immediate: true
    }
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>

<template>
  <div class="interest-container">
    <el-row :gutter="16" class="bookshelf">
      <el-col :span="8" v-for="(movie, index) in interest" :key="index">
        <div class="book">
          <el-image
            alt="兴趣图片"
            :src="movie.url"
            fit="cover"
            :preview-src-list="preList"
            :initial-index="index"
          ></el-image>
          <el-text class="book-name" truncated>{{ movie.describe }}</el-text>
          <el-text class="book-descirbe">111111{{ movie.describe }}</el-text>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
// .glass {
//   //设置为毛玻璃样式
//   backdrop-filter: blur(5px);
//   -webkit-backdrop-filter: blur(12px);
//   background-color: rgba(255, 255, 255, 0.15);
//   border: 1px solid rgba(255, 255, 255, 0.18);
// }

//设置为毛玻璃样式
.glass {
  backdrop-filter: blur(7px);
  border-radius: 5%;
  color: #ffffff;
  /* 确保背景透明，显示毛玻璃效果 */
  background-color: transparent;
  /* 移除默认边框 */
  border: none;
}
.interest-container {
  margin: 0px auto;
  width: 90%;
}

:deep(.van-badge) {
  border: none;
  color: green;
}

.book {
  @extend .glass;
  width: 117px;

  position: relative;
  display: flex;
  flex-direction: column;
  margin: 10px 0px;
  .el-image {
    width: 117px;
    height: 198px;
  }
  .text-base {
    width: 97%;
    margin-top: 3px 0px 0px 2px;
    color: #ffffff;
    line-height: 1.6;
  }
  .book-name {
    @extend .text-base;
    font-size: 0.9rem;
  }
  .book-descirbe {
    @extend .text-base;
    font-size: 0.6rem;
    opacity:0.6;
  }
}
</style>
