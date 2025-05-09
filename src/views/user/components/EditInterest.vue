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
      maxNum: 0
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
    preview() {}
  }
}
</script>

<template>
  <div>
    <!-- <Interest/> -->

    <el-row class="button-row">
      <el-button @click="add">新增封面</el-button>
      <el-button @click="del">删除封面</el-button>
      <el-button @click="preview">预览</el-button>
    </el-row>
    <TransitionGroup name="list" tag="div">
      <upload v-for="(item, index) in maxNum" :key="index"></upload>
    </TransitionGroup>
  </div>
</template>
<style lang="scss" scoped>
.button-row {
  margin-bottom: 10px;
}
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}
</style>
