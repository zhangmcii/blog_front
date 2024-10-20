<script>
import postApi from '@/api/posts/postApi.js'
import ButtonClick from '@/utils/components/ButtonClick.vue'
import RichText from '@/utils/components/RichText.vue'
export default {
  emits: ['postsResult', 'loadingBegin'],
  components: {
    ButtonClick,
    RichText
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
      activeRichEditor: false
    }
  },
  mounted() {},
  methods: {
    normalPublish() {
      this.$emit('loadingBegin', true)
      this.loading = true
      postApi.publish_post({ body: this.content, bodyHtml: null }).then((res) => {
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
    }
  }
}
</script>

<template>
  <h4>你在想什么？</h4>
  <Transition mode="out-in">
    <RichText
      ref="rickText"
      v-if="activeRichEditor"
      @content_change="(n) => (this.rich_content = n)"
    />
    <el-input
      v-else
      v-model="content"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="书写片段,温润流年。"
    />
  </Transition>
  <ButtonClick
    class="custom-button"
    content="发布"
    :disabled="!content && !rich_content.body"
    :loading="loading"
    @do-search="publish"
  >
    <el-icon><i-ep-Pointer /></el-icon>
  </ButtonClick>
  <el-switch
    v-model="activeRichEditor"
    inline-prompt
    inactive-text="普通编辑器"
    active-text="富文本编辑器"
  />
</template>
<style scoped>
:deep(.el-card__body) {
  padding: 5px;
}
.el-input {
  width: 100%;
}
.custom-button {
  margin: 10px 0px;
}
.el-switch {
  margin-top: 10px;
  float: right;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
