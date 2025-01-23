<script>
import followApi from '@/api/user/followApi.js'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
export default {
  components:{
    PageHeadBack
  },
  data() {
    return {
      userName: '',
      action: 'follower',
      follows: [],
      loading: false,
      finished: false,
      error:false,
      refreshing:false
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.action = to.params.action
      vm.userName = to.params.userName
      vm.getFollowList()
      vm.$nextTick(() => {})
    })
  },
  computed: {
    followEmpty() {
      return this.follows.length == 0 && this.action == 'follower'
    },
    followedEmpty() {
      return this.follows.length == 0 && this.action == 'followed'
    }
  },
  methods: {
    getFan() {
      followApi.getFan(this.userName).then((res) => {
        // if (res.data.msg == 'success') {
        //   this.follows = res.data.data
        // }
        if (res.data.msg == 'success') {
          res.data.data.map((item) => {
            this.follows.push(item)
          })
        }
        this.loading = false
        this.finished = true
      }).catch(() => {
        this.loading = false;
        this.error = true;
      });
    },
    getFollowing() {
      followApi.getFollowing(this.userName).then((res) => {
        if (res.data.msg == 'success') {
          res.data.data.map((item) => {
            this.follows.push(item)
          })
        }
        this.loading = false
        this.finished = true
      }).catch(() => {
        this.loading = false;
        this.error = true;
        this.finished = true
      });
    },
    getFollowList() {
      this.loading = true
      if(this.refreshing){
        this.refreshing = false
      }
      if (this.action == 'follower') {
        this.getFan()
      } else if (this.action == 'followed') {
        this.getFollowing()
      }
    },
    onRefresh(){
      this.refreshing = true
      this.finished = false
      this.loading = true;
      this.follows = []
      this.getFollowList()
    }
  }
}
</script>

<template>
  <PageHeadBack>
  <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
  <van-list
    v-model:loading="loading"
     v-model:error="error"
    :finished="finished"
    finished-text="没有更多了"
    error-text="请求失败，点击重新加载"
    @load="getFollowList"
  >
    <van-cell-group v-for="item in follows" :key="item"   >
      <van-cell :title="item.username"  is-link :to="`/user/${item.username}`"/> 
    </van-cell-group>
  </van-list>
  <!-- <ul>
    <el-empty :image-size="200" description="还没有粉丝哦" v-if="followEmpty" />
    <el-empty :image-size="200" description="还未关注他人呢" v-if="followedEmpty" />
  </ul> -->
</van-pull-refresh>

</PageHeadBack>
</template>
<style scoped>
.van-cell{
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 50px;
  margin: 10px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

</style>
