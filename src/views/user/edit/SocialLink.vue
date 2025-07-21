<script setup>
import { ref, reactive } from 'vue'

import { useCurrentUserStore } from '@/stores/user'
import { cloneDeep } from '@pureadmin/utils'
import { useRouter, useRoute } from 'vue-router'
import editApi from '@/api/user/editApi.js'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
import socialLinks from '@/config/socialLinks.json'

const user = useCurrentUserStore()
const router = useRouter()

const data = reactive({
  social_account: {
    qq: '',
    wechat: '',
    bilibili: '',
    github: '',
    twitter: '',
    email: ''
  }
})

onMounted(() => {
  data.localUserInfo = cloneDeep(user.userInfo)
})
function save() {
  editApi.editUser({ social_account: data.social_account }).then(() => {
    user.setUserInfo(data.localUserInfo)
    router.back()
  })
}
</script>
<template>
  <PageHeadBack>
    <template #action><el-button @click="save">保存</el-button></template>
    <van-cell-group inset>
      <van-field v-model="data.social_account.github" label="github">
        <template #left-icon>
          <img class="icon" :src="socialLinks[0].icon" height="20" />
        </template>
      </van-field>
      <van-field v-model="data.social_account.email" label="邮箱">
        <template #left-icon>
          <img class="icon" :src="socialLinks[1].icon" height="20" />
        </template>
      </van-field>
      <van-field v-model="data.social_account.qq" type="digit" label="qq">
        <template #left-icon>
          <img class="icon" :src="socialLinks[2].icon" height="20" />
        </template>
      </van-field>
      <van-field v-model="data.social_account.wechat" label="微信">
        <template #left-icon>
          <img class="icon" :src="socialLinks[3].icon" height="20" />
        </template>
      </van-field>
      <van-field v-model="data.social_account.bilibili" label="bilibili">
        <template #left-icon>
          <img class="icon" :src="socialLinks[4].icon" height="20" />
        </template>
      </van-field>
      <van-field v-model="data.social_account.twitter" label="twitter">
        <template #left-icon>
          <img class="icon" :src="socialLinks[5].icon" height="20" />
        </template>
      </van-field>
    </van-cell-group>
  </PageHeadBack>
</template>
<style lang="scss" scoped>
img {
  background-color: black;
}
</style>
