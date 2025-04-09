<script>
import { Scrollbar } from 'vue-amazing-ui'
import NotificationTitle from './NotificationTitle.vue'
export default {
  props: {
    notifications: {
      type: Array,
      default: () => []
    },
    dot: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Scrollbar,
    NotificationTitle
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    handleClick(item) {
      this.$emit('read', item)
    }
  }
}
</script>

<template>
  <Scrollbar class="Scrollbar" v-if="notifications.length > 0">
    <ul class="notifications-list">
      <template v-for="item in notifications" :key="item.title">
        <li class="notification-item" @click="handleClick(item)">
          <span v-if="!item.isRead" class="unread-dot"></span>

          <span class="avatar-container">
            <img :src="item.image" class="avatar-image" role="img" />
          </span>

          <div class="message-content">
            <NotificationTitle :nItem="item"/>
            <p class="notification-date">{{ item.time }}</p>
          </div>
        </li>
      </template>
    </ul>
  </Scrollbar>

  <template v-else>
    <div class="empty-state">无数据</div>
  </template>
</template>
<style scoped>
.notifications-list {
  display: flex !important;
  max-height: 360px;
  width: 100%;
  flex-direction: column;
  list-style: none; /* 移除默认列表样式 */
  padding: 0; /* 移除默认内边距 */
  margin: 0; /* 移除默认外边距 */
}

.notification-item {
  position: relative;
  display: flex;
  width: 90%;
  cursor: pointer;
  align-items: flex-start;
  gap: 1.25rem; /* Tailwind gap-5 = 1.25rem */
  border-top: 1px solid #e5e7eb; /* 假设边框颜色 */
  padding: 0.75rem; /* px-3 + py-3 = 12px */
  background: transparent;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f3f4f6; /* 悬停背景色 */
}

.unread-dot {
  position: absolute;
  right: 0.5rem; /* right-2 = 0.5rem */
  top: 0.5rem;
  width: 0.5rem; /* w-2 = 0.5rem */
  height: 0.5rem;
  border-radius: 50%;
  background-color: red; /* 假设主色 */
}

.avatar-container {
  position: relative;
  display: flex;
  height: 2.5rem; /* h-10 = 40px = 2.5rem */
  width: 2.5rem;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 1/1;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem; /* gap-1 = 4px */
  line-height: 1; /* leading-none */
}

.notification-title {
  font-weight: 600; /* font-semibold */
  font-size: 0.875rem; /* 假设基础字体大小 */
}

.notification-message {
  color: #6b7280; /* text-muted-foreground */
  font-size: 0.75rem; /* text-xs */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin: 0.25rem 0; /* my-1 = 4px */
}

.notification-date {
  color: #6b7280;
  font-size: 0.75rem;
  line-height: 1rem;
}

/* ----- */

.notifications-container {
  position: relative;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
}

.title {
  color: var(--foreground);
}

.icon {
  width: 1rem;
  height: 1rem;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted-foreground);
  min-height: 150px;
  width: 100%;
}
</style>
