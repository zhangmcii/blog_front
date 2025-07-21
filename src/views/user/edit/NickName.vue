<script setup>
import { useCurrentUserStore } from '@/stores/user'
import { cloneDeep } from '@pureadmin/utils'
import { useRouter, useRoute } from 'vue-router'
import editApi from '@/api/user/editApi.js'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
import socialLinks from '@/config/socialLinks.json'

const user = useCurrentUserStore()
const router = useRouter()
const route = useRoute()

const data = reactive({
  type: 1,
  localUserInfo: {
    nickname: '',
    about_me: '',
    social_account: {
      qq: '',
      wechat: '',
      bilibili: '',
      github: '',
      twitter: '',
      email: ''
    }
  }
})

onMounted(() => {
  data.localUserInfo = cloneDeep(user.userInfo)
  data.type = Number(route.query.type)
})

async function saveNickname() {
  await editApi.editUser({ nickname: data.localUserInfo.nickname })
}
async function saveAboutMe() {
  await editApi.editUser({ about_me: data.localUserInfo.about_me })
}
async function saveSocialLinks() {
  await editApi.editUser({ social_account: data.localUserInfo.social_account })
}
async function save() {
  if (data.type === 1) {
    await saveNickname()
  } else if (data.type === 2) {
    await saveAboutMe()
  } else if (data.type === 3) {
    await saveSocialLinks()
  }
  user.setUserInfo(data.localUserInfo)
  router.back()
}
</script>
<template>
  <PageHeadBack>
    <template #action><el-button @click="save">保存</el-button></template>
    <div v-if="data.type === 1">
      <div class="title">修改昵称</div>
      <el-input v-model="data.localUserInfo.nickname" />
    </div>

    <div v-if="data.type === 2">
      <div class="title">修改签名</div>
      <el-input v-model="data.localUserInfo.about_me" autosize type="textarea" show-word-limit maxlength="30" />
    </div>

    <div v-if="data.type === 3">
      <div class="title">修改社交账号</div>
      <van-cell-group inset>
        <van-field v-model="data.localUserInfo.social_account.github" label="github">
          <template #left-icon>
            <img class="icon" :src="socialLinks[0].icon" height="20" />
          </template>
        </van-field>
        <van-field v-model="data.localUserInfo.social_account.email" label="邮箱">
          <template #left-icon>
            <img class="icon" :src="socialLinks[1].icon" height="20" />
          </template>
        </van-field>
        <van-field v-model="data.localUserInfo.social_account.qq" type="digit" label="qq">
          <template #left-icon>
            <img class="icon" :src="socialLinks[2].icon" height="20" />
          </template>
        </van-field>
        <van-field v-model="data.localUserInfo.social_account.wechat" label="微信">
          <template #left-icon>
            <img class="icon" :src="socialLinks[3].icon" height="20" />
          </template>
        </van-field>
        <van-field v-model="data.localUserInfo.social_account.bilibili" label="bilibili">
          <template #left-icon>
            <img class="icon" :src="socialLinks[4].icon" height="20" />
          </template>
        </van-field>
        <van-field v-model="data.localUserInfo.social_account.twitter" label="twitter">
          <template #left-icon>
            <img class="icon" :src="socialLinks[5].icon" height="20" />
          </template>
        </van-field>
      </van-cell-group>
    </div>
  </PageHeadBack>
</template>

<style lang="scss" scoped>
.title {
  text-align: center;
  margin-bottom: 20px;
}
img {
  background-color: black;
}
</style>
