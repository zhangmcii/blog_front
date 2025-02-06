<script>
import followApi from '@/api/user/followApi.js'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
export default {
  components: {
    PageHeadBack
  },
  data() {
    return {
      userName: '',
      // 0-展示粉丝, 1-展示关注
      action: 0,
      follows: [],
      loading: false,
      finished: false,
      error: false,
      refreshing: false
    }
  },
  //   action: 0  展示粉丝
  //   action: 1  展示关注
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (to.params.action == 'follower') {
        vm.action = 0
      } else {
        vm.action = 1
      }
      vm.userName = to.params.userName
      vm.getFollowList()
      vm.$nextTick(() => {})
    })
  },
  computed: {
    followEmpty() {
      return this.follows.length == 0 && this.action == 0
    },
    followedEmpty() {
      return this.follows.length == 0 && this.action == 1
    }
  },
  methods: {
    getFan() {
      followApi
        .getFan(this.userName)
        .then((res) => {
          if (res.data.msg == 'success') {
            res.data.data.map((item) => {
              this.follows.push(item)
            })
          }
          this.loading = false
          this.finished = true
        })
        .catch(() => {
          this.loading = false
          this.error = true
          this.finished = true
        })
    },
    getFollowing() {
      followApi
        .getFollowing(this.userName)
        .then((res) => {
          if (res.data.msg == 'success') {
            res.data.data.map((item) => {
              this.follows.push(item)
            })
          }
          this.loading = false
          this.finished = true
        })
        .catch(() => {
          this.loading = false
          this.error = true
          this.finished = true
        })
    },
    getFollowList() {
      this.loading = true
      if (this.refreshing) {
        this.refreshing = false
      }
      if (this.action == 0) {
        this.getFan()
      } else if (this.action == 1) {
        this.getFollowing()
      }
    },
    onRefresh() {
      this.refreshing = true
      this.finished = false
      this.loading = true
      this.follows = []
      this.getFollowList()
    },
    onClickTab() {
      this.follows = []
      this.getFollowList()
    }
  }
}
</script>

<template>
  <PageHeadBack>
    <van-tabs v-model:active="action" @click-tab="onClickTab" animated  title-active-color="rgb(51.2, 126.4, 204)">
      <van-tab title="粉丝">
        <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            v-model:error="error"
            :finished="finished"
            finished-text="没有更多了"
            error-text="请求失败，点击重新加载"
            @load="getFollowList"
          >
            <el-link
              :underline="false"
              v-for="i in follows"
              :key="i"
              class="infinite-list-item"
              @click="this.$router.push(`/user/${i.username}`)"
            >
              <el-avatar :src="i.image" />
              {{ i.username }}
              </el-link
            >
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="关注">
        <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            v-model:error="error"
            :finished="finished"
            finished-text="没有更多了"
            error-text="请求失败，点击重新加载"
            @load="getFollowList"
          >
            <el-link
              :underline="false"
              v-for="i in follows"
              :key="i"
              class="infinite-list-item"
              @click="this.$router.push(`/user/${i.username}`)"
            >
              <el-avatar :src="i.image" />
              {{ i.username }}
              <!-- <el-icon class="follow-icon"><i-ep-Plus /></el-icon> -->
              </el-link
            >
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </PageHeadBack>
</template>
<style scoped>
.el-link {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 50px;
  margin: 10px;
}
.el-avatar {
  margin-right: 20px;
}
.el-link:active {
  background: #f5f7fa;
}
/* .follow-icon {
  color: white;
  background-color: #CDD0D6;
} */
</style>
