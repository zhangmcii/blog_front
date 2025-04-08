<template>
  <u-chat :config="config" style="max-height: 83vh" @load-more="loadMore" @submit="submit">
    <template #header>
      <PageHeadBack :title="otherUser.priorityName"/>
    </template>
  </u-chat>
</template>
<!-- 
  满屏高度： height:45vh; 
  无数据：   height:83vh

  所有尺寸： height:83vh
-->
<script setup>
import { reactive } from 'vue'
import { UChat, usePage } from 'undraw-ui'
import chatApi from '@/api/chat/chatApi.js'
import emoji from '@/config/emoji.js'
import imageCfg from '@/config/image.js'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
import { useCurrentUserStore } from '@/stores/user'
import { useOtherUserStore } from '@/stores/otherUser'
const currentUser = useCurrentUserStore()
const otherUser = useOtherUserStore()


const config = reactive({
  user: {
    id: currentUser.userInfo.id,
    username: currentUser.priorityName,
    avatar: currentUser.userInfo.image ? currentUser.userInfo.image : imageCfg.logOut
  },
  data: [],
  emoji: emoji // 可选
})
// 这里的id没什么用。界面是按数组顺序排列的，靠前的数组是最近发送的消息
// let data = [
//   {
//     id: 10,
//     content: 'test10',
//     uid: 1,
//     user: {
//       username: 'user',
//       avatar: 'https://static.juzicon.com/images/image-180327173755-IELJ.jpg'
//     },
//     createTime: '2024-06-29 09:30:00'
//   },
//   {
//     id: 9,
//     content: 'test9',
//     uid: 2,
//     user: {
//       username: 'user2',
//       avatar: 'https://static.juzicon.com/images/image-231107185110-DFSX.png'
//     },
//     createTime: '2024-06-29 09:10:30'
//   },
// ]
let data = reactive([])
chatApi.getMessageHistory(otherUser.userInfo.id, 1).then((res) => {
  if (res.data.msg == 'success') {
    data = res.data.data
  }
})
// config.data = usePage(1, 4, data)

function getRandom(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

let n = 0
function loadMore(finish) {
  if (n <= Math.ceil(data.length / 4)) {
    setTimeout(
      () => {
        finish(usePage(++n, 4, data))
      },
      getRandom(200, 500)
    )
  } else {
    // 传入空数组没有更多消息了
    finish([])
  }
}

function submit(val, finish) {
  let id = data.length
  let chat = {
    id: ++id,
    content: val,
    uid: currentUser.userInfo.id,
    user: {
      username: currentUser.priorityName,
      avatar: currentUser.userInfo.image ? currentUser.userInfo.image : imageCfg.logOut
    },
    createTime: new Date()
  }
  chatApi.sendMsg({ userId: otherUser.userInfo.id, content: val }).then((res) => {
    if (res.data.msg == 'success') {
      finish(chat)
    }
  })
}
</script>

<style lang="scss" scoped></style>
