<template>
  <u-comment-scroll :disable="disable" @more="more">
    <u-comment
      ref="commentRef"
      :config="config"
      @submit="submit"
      @like="like"
      @mention-search="mentionSearch"
      @reply-page="replyPage"
      @show-info="showInfo"
    >
      <u-comment-nav v-model="latest" @sorted="sorted"></u-comment-nav>
      <template #avatar="scope">
        <el-avatar :src="scope.user.avatar" style="margin-top: 5px" />
      </template>
      <template #operate="scope">
        <Operate :comment="scope" @remove="remove" />
      </template>
      <template #card="scope">
        <UserInfo :scope="scope" :loading="loading" :config="config" />
      </template>
    </u-comment>
  </u-comment-scroll>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { UToast, UComment, UCommentScroll, UCommentNav } from 'undraw-ui'
import emoji from '@/config/emoji.js'
import Operate from './components/CommentOperate.vue'
import UserInfo from './components/UserInfo.vue'
import commentApi from '@/api/comment/commentApi.js'
import praiseApi from '@/api/praise/praiseApi.js'
import userApi from '@/api/user/userApi.js'
import imageCfg from '@/config/image.js'
import { useCurrentUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { loginReminder } from '@/utils/common.js'

const currentUser = useCurrentUserStore()
const props = defineProps({ postId: Number })
const config = reactive({
  user: {}, // 当前用户信息
  emoji: emoji, // 表情包数据
  comments: [], // 评论数据
  relativeTime: true, // 开启人性化时间
  show: {
    likes: true,
    level: false,
    address: false
  },
  page: true, // 开启分页
  mention: {
    // 开启提交功能
    data: currentUser.userInfo.followed,
    alias: {
      username: 'name'
    },
    showAvatar: true
  }
})

config.user = {
  id: currentUser.userInfo.id,
  username: currentUser.priorityName,
  // level: 6,
  avatar: currentUser.userInfo.image ? currentUser.userInfo.image : imageCfg.logOut,
  // 评论id数组 建议:存储方式用户id和文章id和评论id组成关系,根据用户id和文章id来获取对应点赞评论id,然后加入到数组中返回
  // 存储已点赞的评论id
  likeIds: []
}

// 用户信息是否加载
const loading = ref(false)
// 模拟请求获取用户详细信息
const showInfo = (uid, finish) => {
  loading.value = true
  let userInfo
  // 模拟获取后端根据uid查询用户信息

  userApi.getUser(uid).then((res) => {
    if (res.data.msg == 'success') {
      const u = res.data.data
      userInfo = {
        username: u.name ? u.name : u.username,
        level: 6,
        avatar: u.image,
        like: u.praised_count,
        attention: u.followed_count,
        follower: u.followers_count,

        id: u.id,
        isFollowed:
          currentUser.userInfo.followed.findIndex((item) => item.uName == u.username) != -1,
        uName: u.username,
        nickname: u.nickname
      }
      loading.value = false
      finish(userInfo)
    } else {
      ElMessage.error(res.data.detail)
    }
  })
}

// 提交触发搜索: 模拟请求接口返回搜索用户数据
const mentionSearch = (val) => {
  config.mention.data = currentUser.userInfo.followed.filter((v) => v.name.includes(val))
}
// 评论提交事件
const submit = ({ content, parentId, reply, finish, mentionList }) => {
  if (!currentUser.isLogin) {
    loginReminder('快去登录再发布文章吧')
    return
  }

  const directParentId = reply === undefined ? null : reply.id
  commentApi
    .submitComment(props.postId, { body: content, directParentId: directParentId, at: mentionList })
    .then((res) => {
      if (res.data.msg == 'success') {
        finish(res.data.data.at(0))
        UToast({ message: '评论成功!', type: 'info' })
      } else {
        ElMessage.error(res.data.detail)
      }
    })
}

// 点赞按钮事件
const like = (id, finish) => {
  if (!currentUser.isLogin) {
    loginReminder('快去登录再点赞吧')
    return
  }
  if (config.user.likeIds.findIndex((item) => item == id) == -1) {
    // 点赞
    praiseApi.submitPraiseComment(id).then((res) => {
      if (res.data.msg == 'success') {
        currentUser.addItemLikeIds(id)
        finish()
      } else {
        ElMessage.error(res.data.detail)
      }
    })
  } else {
    // 取消点赞
  }
}

//请求回复分页
const replyPage = ({ parentId, current, finish }) => {
  commentApi.getReplyComment(parentId, current).then((res) => {
    if (res.data.msg == 'success') {
      let tmp = {
        total: res.data.total,
        // 分页提取回复
        list: res.data.data
      }
      finish(tmp)
    }
  })
}

const query = reactive({
  current: 1, // 当前页数
  size: 10, // 页大小
  total: 0 // 评论总数
})
// 是否禁用滚动加载评论
const disable = ref(false)

// 请求接口请求加载更多评论
const more = () => {
  if (query.current <= Math.ceil(query.total / query.size)) {
    commentApi.getComment(props.postId, query.current).then((res) => {
      if (res.data.msg == 'success') {
        config.comments.push(...res.data.data)
        query.current++
      }
    })
  } else {
    disable.value = true
  }
}

//排序
const latest = ref(true)
const sorted = (latest) => {
  if (latest) {
    // 按最新时间排序（时间从新到旧）
    config.comments.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
  } else {
    // 按点赞数量排序（点赞数从高到低）
    config.comments.sort((a, b) => b.likes - a.likes)
  }
}

const commentRef = ref()
// 删除评论
const remove = (comment) => {
  setTimeout(() => {
    commentRef.value?.remove(comment)
  }, 200)
}

let currentRequestId = 0
function getComment() {
  const requestId = ++currentRequestId
  commentApi.getComment(props.postId, query.current).then((res) => {
    if (requestId !== currentRequestId) {
      // 忽略非最新请求的结果
      return
    }

    if (res.data.msg == 'success') {
      config.comments = [...res.data.data]
      query.current++
      query.total = res.data.total

      // 如果已经加载完所有评论，禁用滚动加载
      if (query.current > Math.ceil(query.total / query.size)) {
        disable.value = true
      }
    }
  })
}

watch(
  () => props.postId,
  () => {
    // 重置状态
    config.comments = []
    // 一定要重置页码。否则导致请求的页码不正确，返回的数据为空数组
    query.current = 1
    query.total = 0
    disable.value = false

    setTimeout(getComment, 200)
  }
)
</script>

<style lang="scss" scoped></style>
