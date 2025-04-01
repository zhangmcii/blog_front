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
      <template #operate="scope">
        <Operate :comment="scope" @remove="remove" />
      </template>
      <template #card="scope">
        <el-skeleton :loading="loading" :throttle="200" animated>
          <template #template>
            <el-skeleton-item
              variant="image"
              style="width: 50px; height: 50px; margin-bottom: 10px"
            />
            <div>
              <el-skeleton-item variant="h3" style="width: 100px" />
              <el-skeleton-item variant="text" style="margin-right: 16px" />
              <el-skeleton-item variant="text" style="width: 100px" />
            </div>
          </template>
          <template #default>
            <div class="user-card">
              <div class="user-avatar">
                <el-avatar style="margin-top: 5px" :size="40" fit="cover" :src="scope.avatar">
                  <span>{{ scope.username }}</span>
                </el-avatar>
              </div>
              <div class="user-content">
                <div class="user-info">
                  <a href="" class="username" target="_blank">
                    <span class="name" style="max-width: 10em">{{ scope.username }}</span>
                    <span blank="true" class="rank">
                      <u-icon size="24" v-html="useLevel(scope.level)"></u-icon>
                    </span>
                  </a>
                </div>
                <div class="social-info">
                  <a href="" class="attention">
                    <span>{{ scope.attention }}</span>
                    <span>关注</span>
                  </a>
                  <a href="" class="follower">
                    <span>{{ scope.follower }}</span>
                    <span>粉丝</span>
                  </a>
                  <a href="" class="like">
                    <span>{{ scope.like }}</span>
                    <span>获赞</span>
                  </a>
                </div>
                <div class="card-btn">
                  <el-button type="primary">关注</el-button>
                  <el-button>发消息</el-button>
                </div>
              </div>
            </div>
          </template>
        </el-skeleton>
      </template>
    </u-comment>
  </u-comment-scroll>
</template>

<script setup>
// 下载表情包资源emoji.zip https://gitee.com/undraw/undraw-ui/releases/tag/v1.0.0
// static文件放在public下,引入emoji.ts文件可以移动assets下引入,也可以自定义到指定位置
// import emoji from '@/utils/emoji.js'
import { reactive, ref } from 'vue'
import {
  UToast,
  Time,
  useLevel,
  cloneDeep,
  usePage,
  UComment,
  UCommentScroll,
  UCommentNav
} from 'undraw-ui'
import Operate from './operate.vue'
import commentApi from '@/api/comment/commentApi.js'

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

const config = reactive({
  user: {}, // 当前用户信息
  // emoji: emoji, // 表情包数据
  comments: [], // 评论数据
  relativeTime: true, // 开启人性化时间
  show: {
    likes: true
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

// 用户信息是否加载
const loading = ref(false)
// 模拟请求获取用户详细信息
const showInfo = (uid, finish) => {
  console.log(loading.value)
  loading.value = true
  console.log('获取用户信息: ' + uid)
  let userInfo
  // 模拟获取后端根据uid查询用户信息
  setTimeout(() => {
    userInfo = {
      username: '杜甫 [唐代]',
      level: 6,
      avatar: 'https://static.juzicon.com/images/image-180327173755-IELJ.jpg',
      like: 36011,
      attention: 15,
      follower: 6878
    }
    loading.value = false
    finish(userInfo)
  }, 200)
}

// 提交触发搜索: 模拟请求接口返回搜索用户数据
const mentionSearch = (val) => {
  config.mention.data = userArr.filter((v) => v.name.includes(val))
}

// 评论提交事件
// let temp_id = 100
// 提交评论事件
// const submit = ({ content, parentId, finish }) => {
//   let str = '提交评论:' + content + ';\t父id: ' + parentId
//   console.log(str)

//   // 模拟请求接口生成数据
//   const comment = {
//     id: String((temp_id += 1)),
//     parentId: parentId,
//     uid: config.user.id,
//     address: '来自江苏',
//     content: content,
//     likes: 0,
//     createTime: new Date().toString(),
//     user: config.user,
//     reply: null
//   }
//   setTimeout(() => {
//     finish(comment)
//     UToast({ message: '评论成功!', type: 'info' })
//     console.log('结构', comments)
//   }, 200)
// }

const submit = ({ content, parentId, finish }) => {
  let str = '提交评论:' + content + ';\t父id: ' + parentId
  console.log(str)

  // // 模拟请求接口生成数据
  // const comment = {
  //   id: String((temp_id += 1)),
  //   parentId: parentId,
  //   uid: config.user.id,
  //   address: '来自江苏',
  //   content: content,
  //   likes: 0,
  //   createTime: new Date().toString(),
  //   user: config.user,
  //   reply: null
  // }
  // setTimeout(() => {
  //   finish(comment)
  //   UToast({ message: '评论成功!', type: 'info' })
  //   console.log('结构', comments)
  // }, 200)

  commentApi
    .submitComment(1, { body: content, parentCommentId: parentId })
    .then((res) => {
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
  // 模拟请求接口成功处理
  setTimeout(() => {
    finish()
  }, 200)
}
/**
 * 评论对象数据结构
 * 存储结构: 一个评论表，通过paretnId是否为空判断类型 评论/回复
 * 层数: 两层
 * 第一层：评论 parentId属性为空; 第二层关系: id等于parentId的数据，则为第二层回复的评论数据
 * 第二层: 回复 parentId属性不为空; 第一层关系: parentId等于第一层id，则为第一层评论的回复数据
 *
 */
// --> 初始化评论列表
const comments = [
  {
    id: '1',
    parentId: null,
    uid: '2',
    content:
      '床前明月光，疑是地上霜。<br>举头望明月，低头思故乡。<img class="a" id="a" style="width: 50px" src=a onerror="window.location.href=\'https://baidu.com\'">',
    createTime: new Time().add(-2, 'hour'),
    user: {
      username: '李白 [唐代]',
      level: 6,
      avatar: 'https://static.juzicon.com/images/image-231107185110-DFSX.png',
      homeLink: '/2'
    },
    reply: {
      total: 1,
      list: [
        {
          id: '11',
          parentId: 1,
          uid: '1',
          content: '[狗头][微笑2]',
          likes: 6666,
          createTime: new Time().add(-1, 'hour'),
          user: {
            username: '杜甫 [唐代]',
            level: 6,
            avatar: 'https://static.juzicon.com/images/image-180327173755-IELJ.jpg',
            homeLink: '/1'
          }
        }
      ]
    }
  },
  {
    id: '2',
    parentId: null,
    uid: '1',
    content:
      '国破山河在，城春草木深。<br>感时花溅泪，恨别鸟惊心。<br>烽火连三月，家书抵万金。<br>白头搔更短，浑欲不胜簪。',
    createTime: new Time().add(-6, 'hour'),
    user: {
      username: '杜甫 [唐代]',
      level: 5,
      avatar: 'https://static.juzicon.com/images/image-180327173755-IELJ.jpg',
      homeLink: '/1'
    }
  },
  {
    id: '3',
    parentId: null,
    uid: '2',
    content: '日照香炉生紫烟，遥看瀑布挂前川。<br>飞流直下三千尺，疑是银河落九天。',
    likes: 3411,
    createTime: new Time().add(-12, 'hour'),
    user: {
      username: '李白 [唐代]',
      level: 4,
      avatar: 'https://static.juzicon.com/images/image-231107185110-DFSX.png',
      homeLink: '/2'
    }
  },
  {
    id: '4',
    parentId: null,
    uid: '3',
    content: '明月几时有？把酒问青天。',
    likes: 3422,
    createTime: new Time().add(-1, 'day'),
    user: {
      username: '苏轼[宋代]',
      level: 6,
      avatar: 'https://static.juzicon.com/images/image-180327175138-PCH1.jpg',
      homeLink: '/3'
    },
    reply: {
      total: 7,
      list: [
        {
          id: '41',
          parentId: 4,
          uid: '3',
          content: '不知天上宫阙，今夕是何年。',
          likes: 34116,
          createTime: new Time().add(-23, 'hour'),
          user: {
            username: '苏轼[宋代]',
            level: 6,
            avatar: 'https://static.juzicon.com/images/image-180327175138-PCH1.jpg',
            homeLink: '/3'
          }
        },
        {
          id: '42',
          parentId: 4,
          uid: '3',
          content: '我欲乘风归去，又恐琼楼玉宇，高处不胜寒。',
          likes: 34116,
          createTime: new Time().add(-20, 'hour'),
          user: {
            username: '苏轼[宋代]',
            level: 5,
            avatar: 'https://static.juzicon.com/images/image-180327175138-PCH1.jpg',
            homeLink: '/3'
          }
        },
        {
          id: '43',
          parentId: 4,
          uid: '3',
          content: '起舞弄清影，何似在人间。',
          likes: 34116,
          createTime: new Time().add(-15, 'hour'),
          user: {
            username: '苏轼[宋代]',
            level: 4,
            avatar: 'https://static.juzicon.com/images/image-180327175138-PCH1.jpg',
            homeLink: '/3'
          }
        },
        {
          id: '44',
          parentId: 4,
          uid: '3',
          content: '转朱阁，低绮户，照无眠。',
          likes: 34116,
          createTime: new Time().add(-14, 'hour'),
          user: {
            username: '苏轼[宋代]',
            level: 3,
            avatar: 'https://static.juzicon.com/images/image-180327175138-PCH1.jpg',
            homeLink: '/3'
          }
        },
        {
          id: '45',
          parentId: 4,
          uid: '3',
          content: '不应有恨，何事长向别时圆？',
          likes: 34116,
          createTime: new Time().add(-10, 'hour'),
          user: {
            username: '苏轼[宋代]',
            level: 2,
            avatar: 'https://static.juzicon.com/images/image-180327175138-PCH1.jpg',
            homeLink: '/3'
          }
        },
        {
          id: '46',
          parentId: 4,
          uid: '3',
          content: '人有悲欢离合，月有阴晴圆缺，此事古难全。',
          likes: 34116,
          createTime: new Time().add(-8, 'hour'),
          user: {
            username: '苏轼[宋代]',
            avatar: 'https://static.juzicon.com/images/image-180327175138-PCH1.jpg',
            homeLink: '/3'
          }
        },
        {
          id: '47',
          parentId: 4,
          uid: '3',
          content: '但愿人长久，千里共婵娟。',
          likes: 34116,
          createTime: new Time().add(-4, 'hour'),
          user: {
            username: '苏轼[宋代]',
            avatar: 'https://static.juzicon.com/images/image-180327175138-PCH1.jpg',
            homeLink: '/3'
          }
        }
      ]
    }
  }
]
// // 模拟请求接口获取评论数据
// setTimeout(() => {
//   // 当前登录用户数据
//   config.user = {
//     id: 1,
//     username: '杜甫 [唐代]',
//     level: 6,
//     avatar: 'https://static.juzicon.com/images/image-180327173755-IELJ.jpg',
//     // 评论id数组 建议:存储方式用户id和文章id和评论id组成关系,根据用户id和文章id来获取对应点赞评论id,然后加入到数组中返回
//     likeIds: [1, 2, 3]
//   }
//   config.comments = comments
// }, 500)

//回复分页
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
// <-

// 模拟请求接口部分评论数据； 回复按需提取部分如: 5条回复，总数为总回复10条。
config.comments = usePage(1, 2, comments)

// 当前页数
let pageNum = 3
// 页大小
let pageSize = 1
// 评论总数量
let total = comments.length
// 是否禁用滚动加载评论
const disable = ref(false)
// 模拟接口请求加载更多评论
const more = () => {
  console.log(disable.value)
  if (pageNum <= Math.ceil(total / pageSize)) {
    setTimeout(() => {
      config.comments.push(...usePage(pageNum, 1, comments))
      pageNum++
    }, 200)
  } else {
    disable.value = true
  }
}

//排序
const latest = ref(true)
const sorted = (latest) => {
  console.log(latest)
}

const commentRef = ref()
// 删除评论
const remove = (comment) => {
  setTimeout(() => {
    commentRef.value?.remove(comment)
  }, 200)
}

// 模拟请求接口获取评论数据
setTimeout(() => {
  // 当前登录用户数据
  config.user = {
    id: 1,
    username: '杜甫 [唐代]',
    level: 6,
    avatar: 'https://static.juzicon.com/images/image-180327173755-IELJ.jpg',
    // 评论id数组 建议:存储方式用户id和文章id和评论id组成关系,根据用户id和文章id来获取对应点赞评论id,然后加入到数组中返回
    likeIds: [1, 2, 3]
  }

  commentApi.getComment(1, 1).then((res) => {
    if (res.data.msg == 'success') {
      config.comments = res.data.data
      console.log('222', res.data.data)
    }
  })
}, 500)
</script>

<style lang="scss" scoped>
.user-card {
  display: flex;
  .user-content {
    flex: 1;
    margin-left: 16px;
    .user-info {
      .username {
        display: flex;
        align-items: center;
        text-decoration: none;
        .name {
          max-width: 100px;
          font-weight: 500;
          font-size: 15px;
          color: #252933;
          line-height: 32px;
          margin-right: 4px;
        }
      }
    }
    .social-info {
      font-size: 12px;
      margin-bottom: 10px;
      a {
        text-decoration: none;
      }
      a:not(:first-child) {
        margin-left: 18px;
      }
      a span:last-child {
        margin-left: 3px;
        color: #9499a0;
      }
    }
  }
}
</style>
