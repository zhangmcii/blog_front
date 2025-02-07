<script>
import followApi from '@/api/user/followApi.js'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
import FollowsList from '@/views/user/components/FollowsList.vue'
export default {
  components: {
    PageHeadBack,
    FollowsList
  },
  data() {
    return {
      userName: '',
      action: 'follower',
      follows: {
        fan: [],
        followed: []
      },
      fanTab: {
        finished: false
      },
      followedTab: {
        finished: false
      },
      loading: false,
      error: false,
      refreshing: false,
      currentPage: 1
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.action = to.params.action
      vm.userName = to.params.userName
    })
  },
  methods: {
    getFan() {
      followApi
        .getFan(this.userName, this.currentPage)
        .then((res) => {
          if (res.data.msg == 'success') {
            res.data.data.map((item) => {
              this.follows.fan.push(item)
            })
          }
          this.loading = false
          this.currentPage++
          if (this.follows.fan.length >= res.data.total) {
            this.fanTab.finished = true
          }
        })
        .catch(() => {
          this.loading = false
          this.error = true
          this.fanTab.finished = true
        })
    },
    getFollowing() {
      followApi
        .getFollowing(this.userName, this.currentPage)
        .then((res) => {
          if (res.data.msg == 'success') {
            res.data.data.map((item) => {
              this.follows.followed.push(item)
            })
          }
          this.loading = false
          this.currentPage++
          if (this.follows.followed.length >= res.data.total) {
            this.followedTab.finished = true
          }
        })
        .catch(() => {
          this.loading = false
          this.error = true
          this.followedTab.finished = true
        })
    },
    getFollowList() {
      if (this.refreshing) {
        if (this.action == 'follower') {
          this.follows.fan = []
        } else {
          this.follows.followed = []
        }
        this.refreshing = false
      }
      if (this.action == 'follower') {
        this.getFan()
      } else if (this.action == 'followed') {
        this.getFollowing()
      }
    },
    onRefresh() {
      if (this.action == 'follower') {
        this.fanTab.finished = false
      } else if (this.action == 'followed') {
        this.followedTab.finished = false
      }
      this.loading = true

      this.currentPage = 1
      this.getFollowList()
    },
    onClickTab() {
      this.currentPage = 1
    }
  }
}
</script>

<template>
  <PageHeadBack>
    <van-tabs
      v-model:active="action"
      @click-tab="onClickTab"
      animated
      sticky
      :offset-top="50"
      title-active-color="rgb(51.2, 126.4, 204)"
    >
      <van-tab title="粉丝" name="follower">
        <FollowsList
          v-model:refreshing="refreshing"
          v-model:loading="loading"
          v-model:error="error"
          v-model:finished="fanTab.finished"
          @refresh="onRefresh"
          @load="getFollowList"
        >
          <el-link
            :underline="false"
            v-for="i in follows.fan"
            :key="i"
            class="infinite-list-item"
            @click="this.$router.push(`/user/${i.username}`)"
          >
            <el-avatar :src="i.image" />
            {{ i.username }}
          </el-link>
        </FollowsList>
      </van-tab>
      <van-tab title="关注" name="followed">
        <FollowsList
          v-model:refreshing="refreshing"
          v-model:loading="loading"
          v-model:error="error"
          v-model:finished="followedTab.finished"
          @refresh="onRefresh"
          @load="getFollowList"
        >
          <el-link
            :underline="false"
            v-for="i in follows.followed"
            :key="i"
            class="infinite-list-item"
            @click="this.$router.push(`/user/${i.username}`)"
          >
            <el-avatar :src="i.image" />
            {{ i.username }}
          </el-link>
        </FollowsList>
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
