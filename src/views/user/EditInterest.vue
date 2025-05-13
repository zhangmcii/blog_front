<script>
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
import ButtonClick from '@/utils/components/ButtonClick.vue'
import uploadCard from '@/views/user/components/uploadCard.vue'
import interest from '@/views/user/components/interest.vue'
import { useCurrentUserStore } from '@/stores/user'

export default {
  name: 'BlogPost',
  props: {},
  components: {
    PageHeadBack,
    ButtonClick,
    uploadCard,
    interest
  },
  data() {
    return {
      formDataMovie: {
        coverImage: [],
        name1: '',
        name2: '',
        name3: ''
      },
      formDataBook: {
        coverImage: [],
        name1: '',
        name2: '',
        name3: ''
      },
      showLog: false,
      showPre: false,
      preData: {
        movies: [],
        books: []
      }
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  computed: {
    // 预览按钮可点击
    isPre() {
      return this.formDataMovie.coverImage.length > 0 || this.formDataBook.coverImage.length > 0
    }
  },
  mounted() {},
  methods: {
    log() {
      console.log('表单数据', this.formDataMovie)
      this.showLog = !this.showLog
    },
    pre() {
      if (this.formDataMovie.coverImage) {
        this.preData.movies = this.formDataMovie.coverImage.map((item, index) => {
          return {
            url: item.url,
            describe: this.formDataMovie['name' + (index + 1)]
          }
        })
      }
      if (this.formDataBook.coverImage) {
        this.preData.books = this.formDataBook.coverImage.map((item, index) => {
          return {
            url: item.url,
            describe: this.formDataBook['name' + (index + 1)]
          }
        })
      }
      this.showPre = !this.showPre
    }
  }
}
</script>

<template>
  <PageHeadBack>
    <div>
      <!-- <el-button @click="log">打印</el-button> -->
      <el-text>各分类下图片最多为3张</el-text>
      <uploadCard ref="movie" v-model:formData="formDataMovie"  class="upload-card"/>
      <uploadCard ref="book" v-model:formData="formDataBook" type="book" />
      <el-button  type="primary" plain v-show="isPre" @click="pre">预览</el-button>

      <!-- <div v-if="showLog">{{ formDataMovie }}</div> -->

      <el-dialog v-model="showPre" width="400">
        <interest :interest="preData" />
      </el-dialog>
    </div>
  </PageHeadBack>
</template>

<style scoped>
:deep(.el-dialog) {
  padding: 0px;
}
.upload-card {
  margin: 20px 0px 70px 0px;
}
.el-button{
  width: 98%;
}
</style>
