<script>
import connectSocket from '@/utils/socket'
import commentApi from '@/api/comment/commentApi.js'
export default {
  data() {
    return {
      socket: null
    }
  },
  mounted() {
    this.connect()
  },
  methods: {
    connect() {
      console.log('连接socket')
      this.socket = connectSocket()
      
    },
    postComm() {
      commentApi.test_comm().then((res) => {
        console.log('后端返回', res)
      })
    }
  }
}
</script>

<template>
  <div>
    <el-button @click="postComm">提交评论</el-button>
  </div>
</template>
<style scoped></style>
