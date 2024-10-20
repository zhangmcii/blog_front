<script>
import { useCurrentUserStore } from '@/stores/currentUser'
import dayjs from 'dayjs'
export default {
  props: {
    post: {
      type: Object,
      default() {
        return {
          id: 1,
          body: '文章',
          body_html: null,
          timestamp: '2024-9-20 12:14:00',
          author: '张三',
          commentCount: 20,
          disabled: false
        }
      }
    },
    funcSwitch: {
      // true 代表post展示
      // false 代表comment展示
      type: Boolean,
      default() {
        return true
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  computed: {
    from_now() {
      if (this.isYesterday(this.post.timestamp)) {
        let time = dayjs(this.post.timestamp).format('HH:mm')
        return `昨天 ${time}`
      }
      return dayjs(this.post.timestamp).fromNow()
    },
    isCommentManage() {
      return this.currentUser.roleId >= 2
    },
    show_body() {
      return this.isCommentManage || !this.post.disabled
    }
  },
  mounted() {
    this.currentUser.loadAdmin()
    this.currentUser.loadRoleId()
  },
  methods: {
    isYesterday(date) {
      // 将输入的日期字符串转换为 dayjs 对象
      const inputDate = dayjs(date).startOf('day')
      // 获取当前日期的 dayjs 对象
      const today = dayjs().startOf('day')
      // 计算 inputDate 与今天日期的差值，单位为天
      const diff = today.diff(inputDate, 'day')
      // 如果差值为 -1，则说明 inputDate 是昨天
      return diff === 1
    },
    share() {
      this.$router.push({
        name: 'share',
        params: { obj: encodeURIComponent(JSON.stringify(this.post)) }
      })
    },
    edit() {
      console.log('编辑')
      this.$router.push({
        name: 'editPost',
        params: { obj: encodeURIComponent(JSON.stringify(this.post)) }
      })
    },
    comment() {
      this.$router.push({
        name: 'share',
        params: { obj: encodeURIComponent(JSON.stringify(this.post)) }
      })
    }
  }
}
</script>

<template>
  <el-card shadow="hover">
    <el-row justify="space-between">
      <el-col :xs="18" :sm="18" :md="10" :lg="10" :xl="10">
        <el-link
          target="_blank"
          type="primary"
          @click="this.$router.push(`/user/${post.author}`)"
          >{{ post.author }}</el-link
        >
      </el-col>
      <el-col :xs="6" :sm="3" :md="2" :lg="3" :xl="3" :push="2">
        <el-text class="mx-1" size="small">{{ from_now }}</el-text>
      </el-col>
    </el-row>
    <el-row v-if="post.disabled">
      <p><i>此评论已被版主禁用</i></p>
    </el-row>
    <el-row><div v-if="post.body_html && show_body" v-html="post.body_html"></div></el-row>
    <el-row v-if="!post.body_html && show_body">{{ post.body }}</el-row>

    <el-row :gutter="35" justify="end" v-if="funcSwitch">
      <el-col :xs="4" :sm="4" :md="2" :lg="2" :xl="2" v-if="post.author == currentUser.username">
        <el-button type="info" size="small" @click="edit">编辑</el-button>
      </el-col>
      <el-col :xs="7" :sm="4" :md="2" :lg="2" :xl="2" v-else-if="currentUser.isAdmin == 'true'">
        <el-button type="danger" size="small" @click="edit">编辑[管理员] </el-button>
      </el-col>
      <el-col :xs="4" :sm="4" :md="2" :lg="2" :xl="2">
        <el-button type="info" size="small" @click="share">分享</el-button>
      </el-col>
      <el-col :xs="6" :sm="6" :md="4" :lg="2" :xl="2">
        <el-button type="primary" size="small" @click="comment"
          >{{ post.comment_count }} 评论</el-button
        >
      </el-col>
    </el-row>
    <slot></slot>
  </el-card>
</template>
<style scoped>
.el-card,
.el-row {
  margin-bottom: 10px;
}

.el-button {
  padding: 0px 5px;
}
:deep(.el-card__body) {
  padding: 5px 20px;
}
</style>
