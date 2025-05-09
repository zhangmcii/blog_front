<script>
import postApi from '@/api/posts/postApi.js'
import ButtonClick from '@/utils/components/ButtonClick.vue'
import RichText from '@/utils/components/RichText.vue'
import Emoji from '@/utils/components/Emoji.vue'
export default {
  emits: ['postsResult', 'loadingBegin'],
  components: {
    ButtonClick,
    RichText,
    Emoji
  },
  data() {
    return {
      content: '',
      posts: [],
      loading: false,
      rich_content: {
        body: '',
        bodyHtml: ''
      },
      activeRichEditor: false,
      showPopover: false,
      showEmoji: false
    }
  },
  mounted() {},
  methods: {
    normalPublish() {
      this.$emit('loadingBegin', true)
      this.loading = true
      // 替换换行符为 <br>
      const formattedContent = this.content.replace(/\n/g, '<br>')
      postApi.publish_post({ body: formattedContent, bodyHtml: null }).then((res) => {
        this.loading = false
        this.$emit('postsResult', res)
        if (res.data.msg == 'success') {
          this.content = ''
          this.$message.success('发布成功!')
        } else {
          this.$message.error('发布失败!')
        }
      })
    },
    richEditorPublish() {
      this.$emit('loadingBegin', true)
      this.loading = true
      postApi.publish_post(this.rich_content).then((res) => {
        this.loading = false
        this.$emit('postsResult', res)
        if (res.data.msg == 'success') {
          // this.$refs.rickText.clean()
          this.$message.success('发布成功!')
        } else {
          this.$message.error('发布失败!')
        }
      })
    },
    publish() {
      if (this.activeRichEditor) {
        this.richEditorPublish()
      } else {
        this.normalPublish()
      }
    },
    insertEmoji(name) {
      this.content += name
    }
  }
}
</script>

<template>
  <div class="text-title">
    <el-text>你在想什么？</el-text>
  </div>
  <Transition mode="out-in">
    <RichText
      ref="rickText"
      v-if="activeRichEditor"
      @content_change="(n) => (rich_content = n)"
    />
    <div v-else>
      <el-input
        v-model="content"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        @focus="() => (showEmoji = true)"
        @blur="() => (showEmoji = false)"
        placeholder="书写片段,温润流年。"
      />
      <!-- <Emoji emoName="Heo_100" :offset="[-5,8]" @selectEmoji="insertEmoji" /> -->
      <!-- <Emoji emoName="dingtalk" :offset="[-35,8]" @selectEmoji="insertEmoji" /> -->
    </div>
  </Transition>

  <ButtonClick
    class="custom-button"
    content="发布"
    size="small"
    :disabled="!content && !rich_content.body"
    :loading="loading"
    @do-search="publish"
  >
    <el-icon><i-ep-Pointer /></el-icon>
  </ButtonClick>
  <div class="switch">
    <el-button size="small" @click="$router.push('/pubImage')">图文 </el-button>
    <el-switch
      v-model="activeRichEditor"
      inline-prompt
      inactive-text="普通编辑器"
      active-text="富文本编辑器"
    />
  </div>
</template>
<style lang="scss" scoped>
.text-title {
  margin: 10px 0px 10px 0px;
}
:deep(.el-card__body) {
  padding: 5px;
}
.el-input {
  width: 100%;
}
.custom-button {
  margin: 10px 0px;
}
.switch {
  margin-top: 10px;
  float: right;
  .el-switch {
    margin-left: 10px;
  }
}
.v-enter-active {
  transition: opacity 0.3s ease;
}
.v-enter-from {
  opacity: 0;
}
</style>
