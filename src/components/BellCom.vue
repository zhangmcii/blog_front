<script>
import { connectSocket } from '@/utils/socket'
import NotificationCom from './NotificationCom.vue'
import notificationApi from '@/api/notification/notificationApi.js'
import { useCurrentUserStore } from '@/stores/currentUser'
export default {
  components: {
    NotificationCom
  },
  data() {
    return {
      socket: null,
      notifications: [
        // {
        //   avatar: 'https://avatar.vercel.sh/1',
        //   date: '刚刚',
        //   isRead: false,
        //   message: '描述信息描述信息描述信息',
        //   title: '小明 回复了你'
        // }
      ]
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
  },
  mounted() {
    this.connect()
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
      if (mergedData.length > this.currentUser.MAX_ITEM) {
        this.currentUser.saveNotifications(mergedData.slice(0, 50))
      }
      console.log('收到实时通知:', data)
    })
  },
  methods: {
    async initLoad() {
      // 加载本地数据
      const localData = this.currentUser.loadNotifications()
      // 请求服务器数据
      const unRead = await notificationApi.getUnRead().then((res) => res.data.data)
      console.log('unRead:', unRead)
      // 合并去重
      const allData = [...unRead, ...localData].filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      )
      this.notifications = allData
      this.currentUser.saveNotifications(allData)
      console.log('notifications:', this.notifications)
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
      notificationApi.mark_read({ ids: ids })
    },
    handleNoticeRead(item) {
      item.isRead = true
      console.log('标记已读:', item.id)
      notificationApi.mark_read({ ids: [item.id] })
    },
    connect() {
      console.log('连接socket')
      this.socket = connectSocket()
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
    <van-popover :show-arrow="false" :offset="[-120, 15]">
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
