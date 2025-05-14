<script>
import imageCfg from '@/config/image.js'
import InterestPage from '@/views/user/components/InterestPage.vue'
export default {
  props: {
    interest: {
      type: Object,
      default() {
        return {
          movies: [],
          books: []
        }
      }
    },
    showButton: {
      type: Boolean,
      default: false
    } 
  },
  components:{
    InterestPage
  },
  data() {
    return {
      activeName: 'first',
      name: ['苦尽甘来遇见你', '我的大叔', '黑化律师'],
      preList: []
    }
  },
  watch: {
  },
  computed: {
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
  <div class="container"> 
  <el-button round size="small" @click="$router.push('/editInterest')" v-if="showButton">上传</el-button>
  <el-tabs v-model="activeName" class="demo-tabs">
    <el-tab-pane label="喜欢的电影" name="first">
      <InterestPage :interest="interest.movies"/>
    </el-tab-pane>
    <el-tab-pane label="在看的书籍" name="second">
       <InterestPage :interest="interest.books"/>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>
<style lang="scss" scoped>
.container{
  position: relative;
  height: 300px;
  margin: 20px 0px;
}
.el-button {
  width: 50px;
  position: absolute;
  right: 35px;
  top: 5px;
  z-index: 3;
}

</style>
