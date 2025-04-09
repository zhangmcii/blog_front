<script>
import NotificationDetail from '@/components/com/NotificationDetail.vue'
export default {
  props: {
    noticficationData: {
      type: Array,
      default() {
        return {
          comment: [
            {
              id: 1,
              image: 'https://img.yzcdn.cn/vant/cat.jpeg',
              triggerNickName: '小明',
              triggerUsername: '小明',
              type: '评论',
              time: '2023-10-01 12:00',
              isRead: false,
              content:'',
              postId:1,
              commentId:1
            },
            {
              id: 2,
              image: 'https://img.yzcdn.cn/vant/cat.jpeg',
              triggerNickName: '小红',
              triggerUsername: '小红',
              type: '评论',
              time: '2023-10-01 12:00',
              isRead: false,
              content:'',
              postId:1,
              commentId:1
            }
            
          ],
          praise: [],
          at: [],
          chat: []
        }
      }
    }
  },
  components: {
    NotificationDetail
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
      this.activeName = tab.name
    }
  }
}
</script>

<template>
  <div class="container">
    <el-tabs v-model="activeName" class="demo-tabs" :stretch="true" @tab-click="handleClick">
      <el-tab-pane name="first">
        <template #label>
          <van-badge :dot="false"> @我的 </van-badge>
        </template>
        <NotificationDetail />
      </el-tab-pane>
      <el-badge value="new" class="item">
        <el-tab-pane name="second">
          <template #label>
            <van-badge :dot="false">评论 </van-badge>
          </template>
          <NotificationDetail />
        </el-tab-pane>
      </el-badge>
      <el-tab-pane name="third">
        <template #label>
          <van-badge :dot="false"> 赞 </van-badge>
        </template>
        <NotificationDetail />
      </el-tab-pane>
      <el-tab-pane name="fourth">
        <template #label>
          <van-badge :dot="false"> 私信 </van-badge>
        </template>
        <NotificationDetail />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style scoped>
.container {
  padding: 10px;
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
