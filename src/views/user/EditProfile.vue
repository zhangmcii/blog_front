<script>
import editApi from '@/api/user/editApi.js'
import userApi from '@/api/user/userApi.js'
import { areaList } from '@vant/area-data'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
import { useCurrentUserStore } from '@/stores/user'
import { useOtherUserStore } from '@/stores/otherUser'
import { cloneDeep } from '@pureadmin/utils'
import { ElLoading } from 'element-plus'
import { compressImages } from '@/utils/common.js'
import uploadApi from '@/api/upload/uploadApi.js'
import imageApi from '@/api/user/imageApi.js'
import emitter from '@/utils/emitter.js'
import { v4 as uuidv4 } from 'uuid'
import * as qiniu from 'qiniu-js'

export default {
  components: {
    PageHeadBack
  },
  data() {
    return {
      loading: {
        tag: false
      },
      tagList: [],
      selectedTags: [],

      imgList: [],
      sexShow: false,
      cityShow: false,
      tagShow: false,

      uploadToken: '',
      imageKey: [],
      imageUrls: [],
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
    const other = useOtherUserStore()
    return { areaList, currentUser, other }
  },
  computed: {
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
    this.selectedTags = [...this.currentUser.userInfo.tags]
    this.imgList.push(this.currentUser.userInfo.image)
  },
  methods: {
    getTagList() {
      this.loading.tag = true
      userApi.get_tag_list().then((res) => {
        if (res.data.msg == 'success') {
          this.tagList = res.data.data
        }
        this.loading.tag = false
      })
    },
    async setCity() {
      const loading = ElLoading.service({
        lock: true,
        text: '正在保存',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await editApi.editUser({ location: this.localUserInfo.location })
      this.currentUser.userInfo = {
        ...this.currentUser.userInfo,
        location: this.localUserInfo.location
      }
      this.other.userInfo = { ...this.other.userInfo, location: this.localUserInfo.location }
      this.cityShow = false
      loading.close()
    },
    async selectSex(value) {
      const loading = ElLoading.service({
        lock: true,
        text: '正在保存',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await editApi.editUser({ sex: value })
      this.localUserInfo.sex = value
      this.currentUser.userInfo = { ...this.currentUser.userInfo, sex: value }
      this.other.userInfo = { ...this.other.userInfo, sex: value }
      this.sexShow = false
      loading.close()
    },
    saveTags() {
      const loading = ElLoading.service({
        lock: true,
        text: '正在保存',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      editApi.editUserTag({ tagAdd: this.tagAdd, tagRemove: this.tagRemove }).then((res) => {
        if (res.data.msg === 'success') {
          this.localUserInfo.tags = [...this.selectedTags]
          this.currentUser.userInfo = { ...this.currentUser.userInfo, tags: [...this.selectedTags] }
          this.other.userInfo = { ...this.other.userInfo, tags: [...this.selectedTags] }
          this.tagShow = false
        } else {
          this.$message.error('标签修改失败')
        }
        loading.close()
      })
    },
    openTag() {
      this.tagShow = !this.tagShow
      this.getTagList()
    },
    beforePicUpload(fileList) {
      for (const file of fileList) {
        const isImage = file.raw.type.startsWith('image/')
        if (!isImage) {
          this.$message.error('只能上传图片格式文件！')
          return false
        }
        const limitPic =
          file.raw.type === 'image/png' ||
          file.raw.type === 'image/jpg' ||
          file.raw.type === 'image/jpeg'
        if (!limitPic) {
          this.$message.warning('请上传格式为png/jpg/jpeg的图片')
          return false
        }
      }
      return true
    },
    async handleFileChange(file, fileList) {
      console.log('文件变化11', file.status)
      // 如果文件列表为空，直接返回
      if (!this.beforePicUpload([file])) {
        return
      }
      const loading = ElLoading.service({
        lock: true,
        text: '正在上传',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.originalFiles = [...fileList]
      // 压缩图像
      this.compressedImages = await compressImages(this.originalFiles, this.compressedImages)
      // 获取上传凭证
      await this.getUploadToken()
      // 上传至七牛云
      await this.uploadFiles()
      // url保存至后端
      await this.submitAvatars()
      loading.close()
    },
    async uploadFiles() {
      console.log('开始上传图片', this.uploadToken)
      const domin = import.meta.env.VITE_QINIU_DOMAIN
      try {
        const putExtra = {}
        const config = {
          // 存储区域
          region: qiniu.region.z0
        }
        for (const file of this.compressedImages) {
          const folder = this.currentUser.uploadAvatarsBaseUrl
          const uniqueFileName = `${uuidv4()}.${file.name.split('.').pop()}`
          const key = folder + uniqueFileName
          const observable = qiniu.upload(file.blob, key, this.uploadToken, putExtra, config)
          await new Promise((resolve, reject) => {
            // 保存 this 上下文
            const self = this
            observable.subscribe({
              next() {},
              error(err) {
                reject(err)
              },
              complete(res) {
                self.imageKey.push(res.key)
                const imageUrl = `http://${domin}/${res.key}`
                self.imageUrls.push(imageUrl)
                resolve()
              }
            })
          })
        }
      } catch (error) {
        console.error('Upload failed:', error)
      }
    },
    async submitAvatars() {
      const domin = import.meta.env.VITE_QINIU_DOMAIN
      const imageUrl = `http://${domin}/${this.imageKey[0]}`
      await imageApi.saveImageUrl({ image: this.imageKey[0] }).then((res) => {
        // 换图像成功后，更新本地image字段
        if (res.data.msg == 'success') {
          this.localUserInfo.image = res.data.image
          this.currentUser.userInfo = { ...this.currentUser.userInfo, image: res.data.image }
          this.other.userInfo = { ...this.other.userInfo, image: res.data.image }
          this.originalFiles = []
          this.compressedImages = []
          this.imgList = []
          this.imgList.push(imageUrl)
          emitter.emit('image', imageUrl)
          this.$message.success('图像上传成功')
        } else {
          this.$message.error('图像上传失败')
        }
      })
    },
    // 改为异步获取上传凭证
    async getUploadToken() {
      await uploadApi.get_upload_token().then((res) => {
        this.uploadToken = res.data.upload_token
      })
    }
  }
}
</script>

<template>
  <PageHeadBack>
    <el-upload
      :show-file-list="false"
      :auto-upload="false"
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
      @click="$router.push({ path: '/editCommonField', query: { type: 1 } })"
    />
    <van-cell title="账号" :value="localUserInfo.username" />
    <van-cell title="性别" is-link :value="localUserInfo.sex" @click="sexShow = !sexShow" />
    <van-cell title="所在地" is-link :value="currentUser.cityName" @click="cityShow = !cityShow" />
    <van-cell title="标签" is-link :value="tag" @click="openTag" />
    <van-cell
      title="签名"
      is-link
      :value="localUserInfo.about_me"
      @click="$router.push({ path: '/editCommonField', query: { type: 2 } })"
    />

    <van-cell title="兴趣图片" class="image" is-link @click="$router.push('/editInterest')" />
    <van-cell title="背景图片" is-link @click="$router.push('/editBackGround')" />

    <van-cell
      title="社交账号"
      class="socical-link"
      is-link
      @click="$router.push({ path: '/editCommonField', query: { type: 3 } })"
    />
    <el-dialog v-model="sexShow" title="设置性别" width="80%" align-center>
      <van-cell title="男" clickable @click="selectSex('男')" />
      <van-cell title="女" clickable @click="selectSex('女')" />
    </el-dialog>
    <van-action-sheet v-model:show="cityShow" title="选择城市">
      <van-area v-model="localUserInfo.location" :area-list="areaList" @confirm="setCity" />
    </van-action-sheet>

    <van-action-sheet v-model:show="tagShow" title="选择标签">
      <div class="tag-container" v-loading="loading.tag">
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
