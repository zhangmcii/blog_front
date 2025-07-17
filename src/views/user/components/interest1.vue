<script>
import InterestPage from '@/views/user/components/InterestPage1.vue'
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
    showInterest: {
      type: String,
      default: ''
    },
    showButton: {
      type: Boolean,
      default: false
    }
  },
  components: {
    InterestPage
  },
  data() {
    return {
      activeName: 'first',
      name: ['苦尽甘来遇见你', '我的大叔', '黑化律师'],
      preList: []
    }
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {}
}
</script>

<template>
  <div class="container">
    <el-button round size="small" @click="$router.push('/editInterest')" v-if="showButton"
      >上传</el-button
    >

    <InterestPage
      :interest="interest.movies"
      v-if="showInterest == 'movie' && interest.movies.length != 0"
    />
    <InterestPage
      :interest="interest.books"
      v-if="showInterest == 'book' && interest.books.length != 0"
    />
  </div>
</template>
<style lang="scss" scoped>
.container {
  position: relative;
  height: 250px;
}
.el-button {
  width: 50px;
  position: absolute;
  right: 35px;
  top: 5px;
  z-index: 3;
}
</style>
