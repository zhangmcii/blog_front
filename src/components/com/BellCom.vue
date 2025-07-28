<script>
import notificationApi from '@/api/notification/notificationApi.js'
import { useCurrentUserStore } from '@/stores/user'
import { useOtherUserStore } from '@/stores/otherUser'
import NotificationDetail from '@/components/com/NotificationDetail.vue'
import emitter from '@/utils/emitter.js'

export default {
  components: {
    NotificationDetail
  },
  data() {
    return {
      activeName: 'first',
      notifications: [],
      classification: {
        comment: [],
        praise: [],
        at: [],
        chat: [],
        newPost: []
      }
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    const otherUser = useOtherUserStore()
    return { currentUser, otherUser }
  },
  watch: {
    notifications: {
      handler(newVal) {
        this.classify(newVal)
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    showDot() {
      return this.notifications.some((item) => item.type !=='新文章' && !item.isRead)
    },
    atUnreadNum() {
      return this.calculateUnreadCount('at')
    },
    commentUnreadNum() {
      return this.calculateUnreadCount('comment')
    },
    praiseUnreadNum() {
      return this.calculateUnreadCount('praise')
    },
    chatUnreadNum() {
      return this.calculateUnreadCount('chat')
    }
  },
  mounted() {
    this.initSocket()
  },
  beforeUnmount() {
    this.currentUser.socket?.off('new_notification')
    if (this.currentUser.socket) {
      this.currentUser.disconnectSocket()
    }
  },
  methods: {
    async initLoad() {
      // 加载本地数据
      const localData = this.currentUser.notice.Notification_data
      // 请求服务器数据
      const unRead = await notificationApi.getUnRead().then((res) => res.data.data)
      // 合并去重
      const allData = [...unRead, ...localData].filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      )
      this.notifications = allData
      this.currentUser.saveNotifications(allData)
    },

    handleNoticeClear() {
      this.notifications = []
      this.currentUser.clearNotifications()
    },

    handleMakeAll() {
      let ids = []
      this.notifications.forEach((item) => {
        item.isRead = true
        ids.push(item.id)
      })
      notificationApi.markRead({ ids: ids })
    },
    handleNoticeRead(item) {
      if (!item.isRead) {
        item.isRead = true
        notificationApi.markRead({ ids: [item.id] })
      }
    },
    toPost(item) {
      this.handleNoticeRead(item)
      this.$router.push(`/postDetail/${item.postId}`)
    },
    toChat(item) {
      this.handleNoticeRead(item)
      this.otherUser.userInfo.id = item.triggerId
      this.otherUser.userInfo.nickname = item.triggerNickName
      this.otherUser.userInfo.username = item.triggerUsername
      this.$router.push('/chat')
    },
    initSocket() {
      if (!this.currentUser.isLogin) {
        return
      }
      this.currentUser.connectSocket()
      this.initLoad()
      this.currentUser.socket.on('new_notification', this.receiveMessage)
    },
    receiveMessage(data) {
      const d = data
      // 更新前端实时状态
      this.notifications = [d, ...this.notifications]
      const existData = this.currentUser.loadNotifications()
      // 新数据与本地数据合并后去重
      const mergedData = [d, ...existData].filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      )
      this.currentUser.saveNotifications(mergedData)
      if (mergedData.length > this.currentUser.notice.MAX_ITEM) {
        this.currentUser.saveNotifications(mergedData.slice(0, 50))
      }
      if (import.meta.env.DEV) {
        console.log('收到实时通知:', data)
      }
    },
    mergeNotifications(localData, serverUnRead) {
      // 创建映射防止重复
      const map = new Map()
      // 本地数据优先（保证实时性）
      localData.forEach((n) => map.set(n.id, n))
      // 合并远程数据
      serverUnRead.forEach((n) => {
        if (!map.has(n.id) || !map.get(n.id).isRead) {
          // 强制未读状态
          map.set(n.id, { ...n, isRead: false })
        }
      })
      // 转换为数组并排序
      return Array.from(map.values()).sort((a, b) => new Date(b.time) - new Date(a.time))
    },
    classify() {
      this.classification.comment = this.notifications.filter(
        (item) => item.type === '评论' || item.type === '回复'
      )
      this.classification.praise = this.notifications.filter((item) => item.type === '点赞')
      this.classification.at = this.notifications.filter((item) => item.type === '@')
      this.classification.chat = this.notifications.filter((item) => item.type === '私信')
      this.classification.newPost = this.notifications.filter((item) => item.type === '新文章')
      if (this.classification.newPost.length > 0) {
        emitter.emit('followPost', this.classification.newPost)
      }
    },
    handleClick(tab) {
      this.activeName = tab.name
    },
    calculateUnreadCount(type) {
      return this.classification[type].reduce((count, item) => {
        return count + (item.isRead ? 0 : 1)
      }, 0)
    }
  }
}
</script>

<template>
  <div>
    <van-popover :show-arrow="false" close-on-click-action :offset="[-120, 15]">
      <template #reference>
        <van-badge :dot="showDot" :offset="[-6, 5]">
          <el-button circle class="notification">
            <template #icon>
              <el-icon :size="20"><i-ep-Bell /></el-icon>
            </template>
          </el-button>
        </van-badge>
      </template>
      <template #default>
        <div class="container">
          <el-tabs v-model="activeName" class="demo-tabs" :stretch="true" @tab-click="handleClick">
            <el-tab-pane name="first">
              <template #label>
                <van-badge :content="atUnreadNum" :show-zero="false" :offset="[8, 0]">
                  @我的
                </van-badge>
              </template>
              <NotificationDetail
                :notifications="classification.at"
                @read="handleNoticeRead"
                @viewPost="toPost"
              />
            </el-tab-pane>
            <el-tab-pane name="second">
              <template #label>
                <van-badge :content="commentUnreadNum" :show-zero="false" :offset="[8, 0]"
                  >评论
                </van-badge>
              </template>
              <NotificationDetail
                :notifications="classification.comment"
                @read="handleNoticeRead"
                @viewPost="toPost"
              />
            </el-tab-pane>
            <el-tab-pane name="third">
              <template #label>
                <van-badge :content="praiseUnreadNum" :show-zero="false" :offset="[8, 0]"
                  >赞</van-badge
                >
              </template>
              <NotificationDetail
                :notifications="classification.praise"
                @read="handleNoticeRead"
                @viewPost="toPost"
              />
            </el-tab-pane>
            <el-tab-pane name="fourth">
              <template #label>
                <van-badge :content="chatUnreadNum" :show-zero="false" :offset="[8, 0]">
                  私信
                </van-badge>
              </template>
              <NotificationDetail
                :notifications="classification.chat"
                @read="handleNoticeRead"
                @viewPost="toPost"
                @viewChat="toChat"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="footer">
          <el-button class="view-all-btn" :disabled="!showDot" @click="handleMakeAll">
            查看所有消息
          </el-button>
          <el-button
            :disabled="notifications.length <= 0"
            class="clear-btn"
            @click="handleNoticeClear"
          >
            清空
          </el-button>
        </div>
      </template>
    </van-popover>
  </div>
</template>
<style scoped>
.notification {
  border-color: #fff;
}
.van-cell {
  width: 170px;
}
.van-popover {
  width: 370px;
}
.container {
  /* padding: 10px 20px 10px 20px; */
  padding: 10px;
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border);
  padding: 0.75rem 1rem;
}

.clear-btn {
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  background: none;
  border: none;
}

.view-all-btn {
  font-size: 0.875rem;
}
/* 禁用状态样式 */
button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
.praise {
  font-size: 11px;
}
</style>
