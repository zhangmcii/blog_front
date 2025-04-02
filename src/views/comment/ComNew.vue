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
      <!-- <template #operate="scope">
        <Operate :comment="scope" @remove="remove" />
      </template> -->
      <template #card="scope">
        <UserInfo :scope="scope" :loading="loading" />
      </template>
    </u-comment>
  </u-comment-scroll>
</template>

<script setup>
// 下载表情包资源emoji.zip https://gitee.com/undraw/undraw-ui/releases/tag/v1.0.0
// static文件放在public下,引入emoji.ts文件可以移动assets下引入,也可以自定义到指定位置
// import emoji from '@/utils/emoji.js'
import { reactive, ref } from 'vue'
import { UToast, UComment, UCommentScroll, UCommentNav } from 'undraw-ui'
import Operate from './operate.vue'
import UserInfo from './components/UserInfo.vue'
import commentApi from '@/api/comment/commentApi.js'
import praiseApi from '@/api/praise/praiseApi.js'
import userApi from '@/api/user/userApi.js'
import followApi from '@/api/user/followApi.js'
import imageCfg from '@/config/image.js'
import { useCurrentUserStore } from '@/stores/currentUser'
const userArr = [
  {
    id: 1,
    name: '张三',
    avatar:
      'https://gd-hbimg.huaban.com/cba6c7af94997ba172c32bbe668794553f29e91ef26f-qnroJ7_fw240webp'
  },
  {
    id: 2,
    name: '李四',
    avatar:
      'https://gd-hbimg.huaban.com/d01263d11d07748a2193bbbdd3b9a0c8a4b062b9f39d-PKvV2t_fw240webp'
  },
  {
    id: 3,
    name: '王五',
    avatar:
      'https://gd-hbimg.huaban.com/69d92bfbf36fc111e1f563403311e7943628c9fc108bf-6l34Pa_fw240webp'
  },
  {
    id: 4,
    name: '赵六',
    avatar:
      'https://gd-hbimg.huaban.com/7f5c54a455f61f431ec1f7b7c0e583f4a725fb73adba-5DgU3q_fw240webp'
  },
  {
    id: 5,
    name: '孙七',
    avatar:
      'https://gd-hbimg.huaban.com/edea85f44f3f8bce8d094ed78f390164a9eba229cb2e-1Lc22F_fw240webp'
  },
  {
    id: 6,
    name: '周八',
    avatar:
      'https://gd-hbimg.huaban.com/c1b2131c6977e01a430d6575ba678a4afeabcad222605-UJUwwb_fw240webp'
  },
  {
    id: 7,
    name: '吴九',
    avatar:
      'https://gd-hbimg.huaban.com/4942e77078bda39a458980049b528236bf79183814998-zVzEJv_fw240webp'
  },
  {
    id: 8,
    name: '郑十',
    avatar:
      'https://gd-hbimg.huaban.com/628236086a2ca12d2074bdd29f496f38a4d0c06ae50f-Rj3vsO_fw240webp'
  },
  {
    id: 9,
    name: '王富贵',
    avatar:
      'https://gd-hbimg.huaban.com/0108a6b65d211d3bc602bc0431e84b31f9e62ac08015f-JifENm_fw240webp'
  },
  {
    id: 10,
    name: '赵富贵',
    avatar:
      'https://gd-hbimg.huaban.com/d9643d6181d506ccc159a940e11bdc6b9a2b53ae57139-pxAnk9_fw240webp'
  }
]
const props = defineProps({ postId: Number })
const config = reactive({
  user: {}, // 当前用户信息
  // emoji: emoji, // 表情包数据
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
    data: userArr,
    alias: {
      username: 'name'
    },
    showAvatar: true
  }
})

// 请求接口获取评论数据
const currentUser = useCurrentUserStore()
// 设置当前登录用户数据
config.user = {
  id: localStorage.getItem('currentUserId'),
  username: localStorage.getItem('currentNickName'),
  // level: 6,
  avatar: localStorage.getItem('image')?localStorage.getItem('image'):imageCfg.logOut,
  // 评论id数组 建议:存储方式用户id和文章id和评论id组成关系,根据用户id和文章id来获取对应点赞评论id,然后加入到数组中返回
  // 存储已点赞的评论id
  likeIds: []
}

// 用户信息是否加载
const loading = ref(false)
// 模拟请求获取用户详细信息
const showInfo = (uid, finish) => {
  console.log(loading.value)
  loading.value = true
  console.log('获取用户信息: ' + uid)
  let userInfo
  // 模拟获取后端根据uid查询用户信息

  userApi.getUser(uid).then((res) => {
    if (res.data.msg == 'success') {
      const u = res.data.data
      userInfo = {
        username: u.name,
        jumpId: u.username,
        level: 6,
        avatar: u.image,
        like: u.praised_count,
        attention: u.followed_count,
        follower: u.followers_count
      }
      loading.value = false
      finish(userInfo)
    } else {
      this.$message.error(res.data.detail)
    }
  })
}

// 提交触发搜索: 模拟请求接口返回搜索用户数据
// const mentionSearch = (val) => {
//   config.mention.data = userArr.filter((v) => v.name.includes(val))
// }

const followed = reactive([])
if (currentUser.token != '') {
  followApi.getFollowing(localStorage.getItem('currentUserName')).then((res) => {
    if (res.data.msg == 'success') {
      res.data.data.map((item) =>
        followed.push({
          id: item.id,
          name: item.name ? item.name : item.username,
          avatar: item.image
        })
      )
    } else {
      this.$message.error(res.data.detail)
    }
  })
}

// 提交触发搜索: 模拟请求接口返回搜索用户数据
const mentionSearch = (val) => {
  config.mention.data = followed.filter((v) => v.name.includes(val))
}
// 评论提交事件
const submit = ({ content, parentId, finish }) => {
  let str = '提交评论:' + content + ';\t父id: ' + parentId
  console.log(str)

  commentApi.submitComment(1, { body: content, parentCommentId: parentId }).then((res) => {
    if (res.data.msg == 'success') {
      finish(res.data.data.at(-1))
      UToast({ message: '评论成功!', type: 'info' })
      console.log('结构', res.data.data.at(-1))
    } else {
      this.$message.error(res.data.detail)
    }
  })
}

// 点赞按钮事件
const like = (id, finish) => {
  console.log('点赞: ' + id)

  if (config.user.likeIds.findIndex((item) => item == id) == -1) {
    // 点赞
    praiseApi.submitPraiseComment(id).then((res) => {
      if (res.data.msg == 'success') {
        finish()
      } else {
        this.$message.error(res.data.detail)
      }
    })
  } else {
    // 取消点赞
  }
}

//请求回复分页
const replyPage = ({ parentId, current, size, finish }) => {
  console.log(parentId, current, size)
  commentApi.getReplyComment(parentId, current).then((res) => {
    if (res.data.msg == 'success') {
      console.log('333', res.data.data)
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
  console.log('加载更多', query.current)
  if (query.current <= Math.ceil(query.total / query.size)) {
    commentApi.getComment(props.postId, query.current).then((res) => {
      if (res.data.msg == 'success') {
        console.log('加载...', res.data.data)
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
  console.log('排序', latest)
  if (latest) {
    // 按最新时间排序（时间从新到旧）
    config.comments.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
  } else {
    // 按点赞数量排序（点赞数从高到低）
    config.comments.sort((a, b) => b.likes - a.likes)
  }
}

// const commentRef = ref()
// // 删除评论
// const remove = (comment) => {
//   setTimeout(() => {
//     commentRef.value?.remove(comment)
//   }, 200)
// }

setTimeout(() => {
  commentApi.getComment(props.postId, query.current).then((res) => {
    if (res.data.msg == 'success') {
      config.comments = res.data.data
      console.log('初始加载评论', query.current)
      query.current++
      query.total = res.data.total
    }
  })
  if (currentUser.token != '') {
    // 查找某文章下当前用户已点赞的评论id
    praiseApi.get_has_praised_comment_id(props.postId).then((res) => {
      if (res.data.msg == 'success') {
        config.user.likeIds = res.data.data
        console.log('已点赞', config.user.likeIds)
      }
    })
  }
}, 200)
</script>

<style lang="scss" scoped></style>
