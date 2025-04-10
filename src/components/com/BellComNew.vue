<script>
import { connectSocket, disconnectSocket } from '@/utils/socket'
import notificationApi from '@/api/notification/notificationApi.js'
import { useCurrentUserStore } from '@/stores/user'
import NotificationDetail from '@/components/com/NotificationDetail.vue'
export default {
  components: {
    NotificationDetail
  },
  data() {
    return {
      socket: null,
      activeName: 'first',
      notifications: [],
      classification: {
        comment: [],
        praise: [],
        at: [],
        chat: []
      }
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
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
      return this.notifications.some((item) => !item.isRead)
    }
  },
  mounted() {
    this.initSocket()
  },
  unmounted() {
    if (this.socket) {
      disconnectSocket()
      this.socket = null
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
      this.$router.push(`/share/${item.postId}`)
    },
    initSocket() {
      if (!this.currentUser.isLogin) {
        return
      }
      this.socket = connectSocket()
      this.initLoad()
      this.socket.on('new_notification', (data) => {
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
      })
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
      this.classification.comment = this.notifications.filter((item) => item.type === '评论' || item.type === '回复')
      this.classification.praise = this.notifications.filter((item) => item.type === '点赞')
      this.classification.at = this.notifications.filter((item) => item.type === '@')
      this.classification.chat = this.notifications.filter((item) => item.type === '聊天')
    },
    handleClick(tab, event) {
      this.activeName = tab.name
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
                <van-badge :dot="false"> @我的 </van-badge>
              </template>
              <NotificationDetail :notifications="classification.at" @read="handleNoticeRead" />
            </el-tab-pane>
            <el-tab-pane name="second">
              <template #label>
                <van-badge :dot="false">评论 </van-badge>
              </template>
              <NotificationDetail
                :notifications="classification.comment"
                @read="handleNoticeRead"
              />
            </el-tab-pane>
            <el-tab-pane name="third">
              <template #label>
                <van-badge :dot="false"> 赞 </van-badge>
              </template>
              <NotificationDetail :notifications="classification.praise" @read="handleNoticeRead" />
            </el-tab-pane>
            <el-tab-pane name="fourth">
              <template #label>
                <van-badge :dot="false"> 私信 </van-badge>
              </template>
              <NotificationDetail :notifications="classification.chat" @read="handleNoticeRead" />
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
  width: 330px;
}
.container {
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
</style>
