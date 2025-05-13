<script>
import upload from '@/views/user/upload1.vue'
import Interest from '@/views/user/components/Interest.vue'
export default {
  props: {
    interest: {
      type: Object,
      default() {
        return {
          book: [
            {
              url: '',
              bookName: ''
            }
          ],
          movie: [
            {
              url: '',
              bookName: ''
            }
          ]
        }
      }
    }
  },
  components: {
    upload,
    Interest
  },
  data() {
    return {
      maxNum: 0,
      formData: {},
      showLog: false
    }
  },
  computed: {},
  mounted() {},
  methods: {
    add() {
      if (this.maxNum >= 3) {
        return
      }
      this.maxNum += 1
    },
    del() {
      if (this.maxNum <= 0) {
        return
      }
      this.maxNum -= 1
    },
    log() {
      console.log('表单数据', this.formData)
      this.showLog = !this.showLog
    }
  }
}
</script>

<template>
  <div>
    <!-- <Interest/> -->
    <el-row class="button-row">
      <!-- <el-button @click="add">新增封面</el-button>
      <el-button @click="del">删除封面</el-button> -->
      <el-button @click="log">打印</el-button>
    </el-row>
    <upload v-model:formData="formData"></upload>
    <div v-if="showLog">{{ formData }}</div>
  </div>
</template>
<style lang="scss" scoped>
.button-row {
  margin-bottom: 10px;
}
</style>
