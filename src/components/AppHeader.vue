<script>
import common from '@/utils/common.js'
import { useUserStore } from '@/stores/user'
export default {
  data() {
    return {}
  },
  setup() {
    const user = useUserStore()
    return { user }
  },
  computed: {
    isLogin() {
      return common.isLogined()
    }
  },
  mounted() {
    this.user.loadUserName()
  },
  methods: {}
}
</script>

<template>
  <el-row>
    <el-col :span="4"><div>主页</div></el-col>
    <el-col :span="2" v-if="isLogin"
      ><el-button type="" link @click="this.$router.push(`/user/${user.username}`)"
        >我</el-button
      ></el-col
    >
    <el-col :span="4" :push="14"><div>账户</div></el-col>
  </el-row>
</template>
<style scoped>
div {
  color: gray;
}
</style>
