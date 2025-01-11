<script>
import editApi from '@/api/user/editApi.js'
import userApi from '@/api/user/userApi.js'
import ButtonClick from '@/utils/components/ButtonClick.vue'
import { areaList } from '@vant/area-data'
import cityUtil from '@/utils/cityUtil.js'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
export default {
  components: {
    ButtonClick,
    PageHeadBack
  },
  data() {
    return {
      formLabelAlign: {},
      originalForm: {},
      user: {},
      userId: -1,
      loading: false,
      isChange: false,
      cityShow: false,
      cityCode: 0,
      cityName: '',
      isLoading: false
    }
  },
  setup() {
    return { areaList }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.userId = to.params.id
      vm.getUserInfo(to.params.id)
      vm.getUserInfo(to.params.id)
      vm.$nextTick(() => {})
    })
  },
  watch: {
    formLabelAlign: {
      deep: true,
      handler(newVal) {
        this.isChange = JSON.stringify(newVal) !== this.originalForm
      }
    }
  },
  methods: {
    getUserInfo(userId) {
      this.isLoading = true
      userApi.getUser(userId).then((res) => {
        if (res.data.msg == 'success') {
          const location = res.data.data.location
          if (location && !isNaN(parseInt(location))) {
            this.cityName = cityUtil.getCodeToName(location, this.areaList)
          }
          this.originalForm = JSON.stringify(res.data.data)
          this.formLabelAlign = res.data.data
          setTimeout(() => {
            this.isLoading = false
          }, 2000)
        }
      })
    },
    submit() {
      this.loading = true
      editApi.editProfile(this.formLabelAlign).then((res) => {
        this.loading = false
        this.isChange = false
        if (res.data.data == 'success') {
          this.$message.success('修改成功')
          this.$router.push(`/user/${this.formLabelAlign.username}`)
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    setCity() {
      this.cityShow = false
      this.cityName = cityUtil.getCodeToName(this.formLabelAlign.location, this.areaList)
    },
  }
}
</script>

<template>
  <PageHeadBack>
    <el-skeleton
      :loading="isLoading"
      animated
    >
      <template #template>
        <el-skeleton-item variant="h3" style="width: 20%" />
        <el-skeleton-item style="width: 100%; height: 25px" class="form-name" />

        <el-skeleton-item variant="h3" style="width: 20%" />
        <el-skeleton-item style="width: 100%; height: 25px" />
        <el-skeleton-item style="width: 100%; height: 25px" class="form-city" />

        <el-skeleton-item variant="h3" style="width: 20%" />
        <el-skeleton-item style="width: 100%; height: 25px" class="form-about"/>

        <el-skeleton-item variant="button" style=" height: 30px" />
      </template>

      <template #default>
        <el-form
          ref="formLabelAlign"
          :model="formLabelAlign"
          label-position="top"
          label-width="auto"
          style="max-width: 600px"
        >
          <el-form-item label="昵称">
            <el-input v-model="formLabelAlign.name" />
          </el-form-item>
          <el-form-item label="城市">
            <el-input v-model="cityName" disabled />
            <el-button style="width: 100%" @click="cityShow = !cityShow"> 选择城市</el-button>
          </el-form-item>
          <el-form-item label="关于我">
            <el-input v-model="formLabelAlign.about_me" show-word-limit maxlength="30" />
          </el-form-item>
          <el-form-item>
            <ButtonClick
              content="提交"
              type="primary"
              :loading="loading"
              :disabled="!isChange"
              @do-search="submit"
            />
          </el-form-item>
        </el-form>
      </template>
    </el-skeleton>
    <van-action-sheet v-model:show="cityShow" title="选择城市">
      <van-area v-model="formLabelAlign.location" :area-list="areaList" @confirm="setCity" />
    </van-action-sheet>
  </PageHeadBack>
</template>
<style scoped>
.form-name,
.form-city,
.form-about {
  margin-bottom: 30px;
}
</style>
