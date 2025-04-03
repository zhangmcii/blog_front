<script>
import { connectSocket, disconnectSocket } from '@/utils/socket'
import NotificationCom from './NotificationCom.vue'
import notificationApi from '@/api/notification/notificationApi.js'
import { useCurrentUserStore } from '@/stores/user'
export default {
  components: {
    NotificationCom
  },
  data() {
    return {
      socket: null,
      notifications: []
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  computed: {
    showDot() {
      return this.notifications.some((item) => !item.isRead)
    }
    // login() {
    //   this.currentUser.loadUserName()
    //   return this.currentUser.username != ''
    // },
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
      // const localData = this.currentUser.loadNotifications()
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
      console.log('11')
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
        <NotificationCom
          :dot="showDot"
          :notifications="notifications"
          @clear="handleNoticeClear"
          @make-all="handleMakeAll"
          @read="handleNoticeRead"
        />
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
</style>
