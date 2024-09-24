<script>
import followApi from '@/api/user/followApi.js'
export default {
  data() {
    return {
      userName: '',
      action: 'follower',
      follows: []
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.action = to.params.action
      vm.userName = to.params.userName
      // 持久化保存 防止用户刷新本页面导致传入的username丢失
      //   vm.otherUser.saveUserName(to.params.userName)
      vm.$nextTick(() => {})
    })
  },
  mounted() {
    this.getFollowList()
  },
  methods: {
    load() {},
    getFan() {
      followApi.getFan(this.userName).then((res) => {
        if (res.data.msg == 'success') {
          this.follows = res.data.data
        }
      })
    },
    getFollowing() {
      followApi.getFollowing(this.userName).then((res) => {
        if (res.data.msg == 'success') {
          this.follows = res.data.data
        }
      })
    },
    getFollowList() {
      if (this.action == 'follower') {
        this.getFan()
      } else if (this.action == 'followed') {
        this.getFollowing()
      }
    }
  }
}
</script>

<template>
  <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
    <el-link
      :underline="false"
      v-for="i in follows"
      :key="i"
      class="infinite-list-item"
      @click="this.$router.push(`/user/${i.username}`)"
      >{{ i.username }}</el-link
    >
  </ul>
</template>
<style scoped>
.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>
