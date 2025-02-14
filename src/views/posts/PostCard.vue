<script>
import { useCurrentUserStore } from '@/stores/currentUser'
import common from '@/utils/common.js'
import imageCfg from '@/config/image.js'
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
          disabled: false,
          image: ''
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
    },

    // 卡片的背景颜色
    cardBgColor: {
      type: String,
      default: 'white'
    },
    showImage: {
      type: Boolean,
      default: true
    }
  },
  emits: ['share'],
  data() {
    return {}
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  computed: {
    from_now() {
      if (common.isYesterday(this.post.timestamp)) {
        let time = this.$dayjs(this.post.timestamp).format('HH:mm')
        return `昨天 ${time}`
      }
      return this.$dayjs(this.post.timestamp).fromNow()
    },
    isCommentManage() {
      return this.currentUser.roleId >= 2
    },
    show_body() {
      return this.isCommentManage || !this.post.disabled
    },
    image() {
      if (!this.post.image) {
        return imageCfg.random()
      }
      return this.post.image
    },
    isUserRoute(){
      return this.$route.path.startsWith('/user') 
    }
  },
  mounted() {
    this.currentUser.loadAdmin()
    this.currentUser.loadRoleId()
  },
  methods: {
    share() {
      this.$router.push(`/share/${this.post.id}`)
    },
    edit() {
      this.$router.push(`/editPost/${this.post.id}`)
    },
    comment() {
      this.$router.push(`/share/${this.post.id}`)
    }
  }
}
</script>

<template>
  <el-card shadow="hover">
    <el-skeleton :rows="4" animated :loading="loading">
      <template #default>
        <el-row>
          <el-col :span="4" v-if="showImage">
            <el-avatar :src="image" @click.stop="this.$router.push(`/user/${post.author}`)" />
          </el-col>

          <el-col :span="showImage ? 20 : 24">
            <el-row justify="space-between">
              <el-col :xs="18" :sm="18" :md="10" :lg="10" :xl="10">
                <el-link
                  target="_blank"
                  type="primary"
                  @click.stop="this.$router.push(`/user/${post.author}`)"
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
              <el-col
                :xs="4"
                :sm="4"
                :md="2"
                :lg="2"
                :xl="2"
                v-if="post.author == currentUser.username"
              >
                <el-button type="info" size="small" @click.stop="edit">编辑</el-button>
              </el-col>
              <el-col
                :xs="7"
                :sm="4"
                :md="2"
                :lg="2"
                :xl="2"
                v-else-if="currentUser.isAdmin == 'true'"
              >
                <el-button type="danger" size="small" @click.stop="edit">编辑[管理员] </el-button>
              </el-col>
              <el-col :xs="4" :sm="4" :md="2" :lg="2" :xl="2" v-if="!isUserRoute">
                <el-button type="info" size="small" @click.stop="this.$emit('share',true)">分享</el-button>
              </el-col>
              <el-col :xs="6" :sm="6" :md="4" :lg="2" :xl="2">
                <el-button type="primary" size="small" @click.stop="comment"
                  >{{ post.comment_count }} 评论</el-button
                >
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <slot></slot>
      </template>
    </el-skeleton>
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
.el-card {
  background-color: v-bind(cardBgColor);
}
</style>
