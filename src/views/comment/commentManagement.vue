<script>
import commentApi from '@/api/comment/commentApi.js'
import PostCard from '../posts/PostCard.vue'
import { useCurrentUserStore } from '@/stores/currentUser'
export default {
  components: {
    PostCard
  },
  data() {
    return {
      comments: {},
      currentPage: 1,
      comments_count: 10
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { currentUser }
  },
  computed: {
    isCommentManage() {
      return this.currentUser.roleId >= 2
    }
  },
  mounted() {
    this.getAllComments()
  },
  methods: {
    getAllComments(page = 1) {
      commentApi.getAllComments(page).then((res) => {
        this.comments = res.data.data
        this.comments_count = res.data.total
      })
    },
    handleCurrentChange() {
      this.getAllComments(this.currentPage)
    },
    disabled(item) {
      commentApi.disable(item.id).then((res) => {
        if (res.data.msg == 'success') {
          this.comments = res.data.data
        }
      })
    },
    enable(item) {
      commentApi.enable(item.id).then((res) => {
        if (res.data.msg == 'success') {
          this.comments = res.data.data
        }
      })
    }
  }
}
</script>

<template>
  <PostCard v-for="item in comments" :key="item" :post="item" :func-switch="false">
    <el-row v-if="isCommentManage">
      <el-button @click="enable(item)" v-if="item.disabled">开启</el-button>
      <el-button type="danger" @click="disabled(item)" v-else>禁用</el-button>
    </el-row>
  </PostCard>
  <el-pagination
    v-model:current-page="currentPage"
    :page-size="10"
    layout="total, prev, pager, next"
    :total="comments_count"
    @current-change="handleCurrentChange"
  />
</template>
<style scoped></style>
