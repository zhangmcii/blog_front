<script>
import upload from '@/views/user/upload.vue'
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
    <upload />
  </div>
</template>
<style lang="scss" scoped>
.button-row {
  margin-bottom: 10px;
}
</style>
