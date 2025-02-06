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
      action: 'follower',
      follows: [],
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      currentPage: 1,
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
  mounted(){
    // const r = this.$refs.list.check
    // console.log('22', r)
  },
  methods: {
    getFan() {
      followApi
        .getFan(this.userName, this.currentPage)
        .then((res) => {
          if (res.data.msg == 'success') {
            res.data.data.map((item) => {
              this.follows.push(item)
            })
          }
          this.loading = false
          this.currentPage++
          if (this.follows.length >= res.data.total) {
            this.finished = true
          }
        })
        .catch(() => {
          this.loading = false
          this.error = true
          this.finished = true
        })
    },
    getFollowing() {
      followApi
        .getFollowing(this.userName,this.currentPage)
        .then((res) => {
          if (res.data.msg == 'success') {
            res.data.data.map((item) => {
              this.follows.push(item)
            })
          }
          this.loading = false
          this.currentPage++
          if (this.follows.length >= res.data.total) {
            this.finished = true
          }
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
        console.log('333',this.refreshing)
        this.refreshing = false
      }
      if (this.action == 'follower') {
        this.getFan()
      } else if (this.action == 'followed') {
        this.getFollowing()
      }
    },
    onRefresh() {
      this.finished = false
      this.follows = []
      this.currentPage = 1
      this.getFollowList()
    },
    onClickTab() {
      this.follows = []
      this.currentPage = 1
      this.getFollowList()
    }
  }
}
</script>

<template>
  <PageHeadBack>
    <van-tabs v-model:active="action" @click-tab="onClickTab" animated sticky :offset-top="50" title-active-color="rgb(51.2, 126.4, 204)">
      <van-tab title="粉丝"  name="follower">
        <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
          <van-list
            ref="list"
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
      <van-tab title="关注" name="followed">
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
  padding: 10px;
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
