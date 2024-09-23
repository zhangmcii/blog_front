<script>
import PostCard from './PostCard.vue'
import postApi from '@/api/posts/postApi.js'
import common from '@/utils/common.js'
import { useUserStore } from '@/stores/user'
export default {
  components: {
    PostCard
  },
  data() {
    return {
      activeName: 'first',
      posts: [],
      posts_count: 0
    }
  },
  setup() {
    const user = useUserStore()
    return { user }
  },
  mounted() {
    this.user.loadUserName()
    this.get_posts()
  },
  computed: {
    isLogin() {
      return common.isLogined()
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`${val} items per page`)
    },
    handleCurrentChange(val) {
      console.log(`current page: ${val}`)
    },
    get_posts() {
      postApi.get_posts().then((res) => {
        this.posts = res.data.data
        this.posts_count = res.data.total
      })
    }
  }
}
</script>

<template>
  <h1>Hello {{ user.username }}</h1>
  <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="广场" name="first">
      <PostCard v-for="item in posts" :key="item" :post="item" />
    </el-tab-pane>
    <el-tab-pane label="关注" name="second" v-if="isLogin">Config</el-tab-pane>
  </el-tabs>

  <el-pagination
    v-model:current-page="currentPage1"
    :page-size="20"
    :size="size"
    :disabled="disabled"
    layout="total, prev, pager, next"
    :total="posts_count"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
<style scoped>
.el-pagination {
  float: right;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
