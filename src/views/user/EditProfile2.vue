<script>
import editApi from '@/api/user/editApi.js'
import userApi from '@/api/user/userApi.js'
import { areaList } from '@vant/area-data'
import cityUtil from '@/utils/cityUtil.js'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
import { useCurrentUserStore } from '@/stores/user'
import { cloneDeep } from '@pureadmin/utils'
export default {
  components: {
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
      cityCode: 0,
      cityName: '',
      isLoading: false,
      drawer: false,
      tagList: [],
      selectedTags: [],
      imgList: [],
      sexShow: false,
      cityShow: false,
      tagShow: false,
      // 原始文件
      originalFiles: [],
      // 压缩后的文件
      compressedImages: [],
      localUserInfo: {
        sex: '',
        tags: []
      }
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    return { areaList, currentUser }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.userId = to.params.id
      vm.getUserInfo(vm.userId)
      vm.getTagList()
      vm.$nextTick(() => {})
    })
  },
  watch: {},
  computed: {
    baseInfoChange() {
      return JSON.stringify(this.formLabelAlign) !== this.originalForm
    },
    tagAdd() {
      return this.selectedTags.filter((tag) => !this.localUserInfo.tags.includes(tag))
    },
    tagRemove() {
      return this.localUserInfo.tags.filter((tag) => !this.selectedTags.includes(tag))
    },
    tagChange() {
      return this.tagAdd.length > 0 || this.tagRemove.length > 0
    },
    tag() {
      return this.selectedTags.join(' ')
    }
  },
  mounted() {
    this.localUserInfo = cloneDeep(this.currentUser.userInfo)
  },
  methods: {
    getUserInfo(userId) {
      this.isLoading = true
      userApi.getUser(userId).then((res) => {
        if (res.data.msg == 'success') {
          const location = res.data.data.location
          this.imgList.push(res.data.data.image)
          this.selectedTags = [...res.data.data.tags]
          // if (location && !isNaN(parseInt(location))) {
          //   this.cityName = cityUtil.getCodeToName(location, this.areaList)
          // }
          this.originalForm = JSON.stringify(res.data.data)
          this.formLabelAlign = { ...res.data.data }
          this.isLoading = false
        }
      })
    },

    getTagList() {
      userApi.get_tag_list().then((res) => {
        if (res.data.msg == 'success') {
          this.tagList = res.data.data
        }
      })
    },
    // submit() {
    //   this.loading = true
    //   if (this.baseInfoChange) {
    //     editApi.editProfile(this.formLabelAlign).then((res) => {
    //       this.loading = false
    //       this.isChange = false
    //       if (res.data.msg == 'success') {
    //         this.currentUser.userInfo = { ...this.currentUser.userInfo, ...this.formLabelAlign }
    //         this.$message.success('修改成功')
    //         this.$router.push(`/user/${this.formLabelAlign.username}`)
    //       } else {
    //         this.$message.error('基础信息修改失败')
    //       }
    //     })
    //   }
    //   if (this.tagChange) {
    //     editApi.editUserTag({ tagAdd: this.tagAdd, tagRemove: this.tagRemove }).then((res) => {
    //       this.loading = false
    //       this.isChange = false
    //       if (res.data.msg !== 'success') {
    //         this.$message.error('标签修改失败')
    //       }
    //     })
    //   }
    // },
    async setCity() {
      await editApi.editUser({ location: this.localUserInfo.location })
      this.currentUser.setUserInfo(this.localUserInfo)
      this.cityShow = false
    },
    async selectSex(value) {
      await editApi.editUser({ sex: value })
      this.localUserInfo.sex = value
      this.currentUser.setUserInfo(this.localUserInfo)
      this.sexShow = false
    },
     saveTags() {
      editApi.editUserTag({ tagAdd: this.tagAdd, tagRemove: this.tagRemove }).then((res) => {
        if (res.data.msg === 'success') {
          this.localUserInfo.tags = [...this.selectedTags]
          this.currentUser.setUserInfo(this.localUserInfo)
          this.tagShow = false
        } else {
          this.$message.error('标签修改失败')
        }
      })
    }
  }
}
</script>

<template>
  <PageHeadBack>
    <el-skeleton
      :loading="isLoading"
      animated
      :throttle="{ leading: 300, trailing: 300, initVal: true }"
    >
      <template #template>
        <el-skeleton-item variant="h3" style="width: 20%" />
        <el-skeleton-item style="width: 100%; height: 25px" class="form-name" />

        <el-skeleton-item variant="h3" style="width: 20%" />
        <el-skeleton-item style="width: 100%; height: 25px" />
        <el-skeleton-item style="width: 100%; height: 25px" class="form-city" />

        <el-skeleton-item variant="h3" style="width: 20%" />
        <el-skeleton-item style="width: 100%; height: 25px" class="form-about" />

        <el-skeleton-item variant="button" style="height: 30px" />
      </template>

      <template #default>
        <el-upload
          ref="uploadRef"
          v-model:file-list="originalFiles"
          :auto-upload="false"
          :before-upload="() => false"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          :on-change="handleFileChange"
          :limit="1"
        >
          <template #trigger>
            <van-cell title="图像" is-link>
              <template #value>
                <el-image
                  shape="square"
                  style="width: 30px; height: 30px"
                  :preview-src-list="imgList"
                  alt="用户图像"
                  :src="localUserInfo.image"
                  @click.stop=""
                />
              </template>
            </van-cell>
          </template>
        </el-upload>

        <van-cell
          title="昵称"
          is-link
          :value="localUserInfo.nickname"
          @click="$router.push({ path: '/editNickName', query: { type: 1 } })"
        />
        <van-cell title="账号" :value="localUserInfo.username" />
        <van-cell title="性别" is-link :value="localUserInfo.sex" @click="sexShow = !sexShow" />
        <van-cell
          title="所在地"
          is-link
          :value="currentUser.cityName"
          @click="cityShow = !cityShow"
        />
        <van-cell title="标签" is-link :value="tag" @click="tagShow = !tagShow" />
        <van-cell
          title="签名"
          is-link
          :value="localUserInfo.about_me"
          @click="$router.push({ path: '/editNickName', query: { type: 2 } })"
        />

        <van-cell title="兴趣图片" class="image" is-link @click="$router.push('/editInterest')" />
        <van-cell title="背景图片" is-link :value="localUserInfo.bg_image" />

        <van-cell
          title="社交账号"
          class="socical-link"
          is-link
          @click="$router.push({ path: '/editNickName', query: { type: 3 } })"
        />
      </template>
    </el-skeleton>
    <el-dialog v-model="sexShow" title="设置性别" width="80%" align-center>
      <van-cell title="男" clickable @click="selectSex('男')" />
      <van-cell title="女" clickable @click="selectSex('女')" />
    </el-dialog>
    <van-action-sheet v-model:show="cityShow" title="选择城市">
      <van-area v-model="localUserInfo.location" :area-list="areaList" @confirm="setCity" />
    </van-action-sheet>

    <van-action-sheet v-model:show="tagShow" title="选择标签">
      <div class="tag-container">
        <el-checkbox-group v-model="selectedTags" :min="0" :max="3">
          <el-checkbox v-for="tag in tagList" :key="tag" :value="tag" size="large">
            <template #default>
              <el-tag type="primary" effect="plain" round size="small">{{ tag }}</el-tag>
            </template>
          </el-checkbox>
        </el-checkbox-group>
        <el-button class="tag-but" round @click="saveTags" :disabled="!tagChange">保存</el-button>
      </div>
    </van-action-sheet>
  </PageHeadBack>
</template>
<style scoped>
.form-name,
.form-city,
.form-about {
  margin-bottom: 30px;
}

.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}
:deep(.el-upload) {
  display: flex;
}
.sava-but {
  margin-top: 20px;
}

.el-checkbox-group {
  width: 85%;
  margin: 0 auto;
}
.image {
  margin-top: 35px;
}
.socical-link {
  margin-top: 35px;
}

.tag-container {
  min-height: 10px;
}
.tag-but {
  width: 100%;
  margin: 20px auto;
}
</style>
