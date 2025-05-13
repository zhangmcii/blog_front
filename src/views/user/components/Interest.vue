<script>
import imageCfg from '@/config/image.js'
export default {
  props: {
    interest: {
      type: Object,
      default() {
        return {
          movies: [],
          books: [],
        }
      }
    }
  },
  data() {
    return {
      activeName: 'first',
      name: ['苦尽甘来遇见你', '我的大叔', '黑化律师']
    }
  },
  computed: {
    srcList() {
      return imageCfg.book
    },
    books() {
      return imageCfg.book.map((item, index) => {
        return {
          url: item,
          bookName: this.name[index]
        }
      })
    }
  },
  mounted() {},
  methods: {}
}
</script>

<template>
  <el-tabs v-model="activeName" class="demo-tabs">
    <el-tab-pane label="喜欢的电影" name="first">
      <el-row :gutter="1" class="bookshelf">
        <el-col :span="8" v-for="(book, index) in books" :key="index">
          <div class="book">
            <el-text class="book-badge">{{ index + 1 }}</el-text>
            <el-image
              :src="book.url"
              fit="cover"
              :preview-src-list="srcList"
              :initial-index="index"
            ></el-image>
            <el-text class="book-name" truncated>{{ book.bookName }}</el-text>
          </div>
        </el-col>
      </el-row>
    </el-tab-pane>

    <el-tab-pane label="在看的书籍" name="second">书籍</el-tab-pane>
  </el-tabs>
</template>
<style lang="scss" scoped>
.el-tabs {
  height: 300px;
  margin: 20px 0px;
}
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
