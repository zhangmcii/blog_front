<script>
import postApi from '@/api/posts/postApi.js'
import ButtonClick from '@/utils/components/ButtonClick.vue'
import RichText from '@/utils/components/RichText.vue'
export default {
  components: {
    ButtonClick,
    RichText
  },
  data() {
    return {
      post: {},
      rich_content: {
        body: '',
        bodyHtml: ''
      },
      loading: false,
      activeRichEditor: false
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const params = to.params.obj
      vm.post = params ? JSON.parse(decodeURIComponent(params)) : null
      if (vm.post.body_html) {
        console.log('body_f', vm.post.body)
        console.log('html', vm.post.body_html)
        vm.activeRichEditor = true
      }
      vm.$nextTick(() => {})
    })
  },
  mounted() {},
  methods: {
    normalModify() {
      this.loading = true
      postApi.editPost(this.post.id, { body: this.post.body, bodyHtml: null }).then((res) => {
        if (res.data.data == 'success') {
          this.loading = false
          this.$message.success('修改成功')
          this.$router.push({
            name: 'share',
            params: { obj: encodeURIComponent(JSON.stringify(this.post)) }
          })
        } else {
          this.loading = false
          this.$message.success('修改失败')
        }
      })
    },
    richEditorModify() {
      this.loading = true
      postApi.editPost(this.post.id, this.rich_content).then((res) => {
        if (res.data.data == 'success') {
          this.loading = false
          this.$message.success('修改成功')
          this.post.body = this.rich_content.body
          this.post.body_html = this.rich_content.bodyHtml
          this.$router.push({
            name: 'share',
            params: { obj: encodeURIComponent(JSON.stringify(this.post)) }
          })
        } else {
          this.loading = false
          this.$message.success('修改失败')
        }
      })
    },
    modify() {
      if (this.activeRichEditor) {
        this.richEditorModify()
      } else {
        this.normalModify()
      }
    }
  }
}
</script>

<template>
  <h1>编辑</h1>
  <h4>你在想什么？</h4>
  <Transition mode="out-in">
    <RichText
      ref="rickText"
      v-if="activeRichEditor"
      :bodyInit="post.body"
      :bodyHtmlInit="post.body_html"
      @content_change="(n) => (this.rich_content = n)"
    />
    <el-input
      v-else
      v-model="post.body"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="发你所想"
    />
  </Transition>
  <ButtonClick content="修改" :loading="loading" @do-search="modify" />
  <!-- <el-switch
    v-model="activeRichEditor"
    inline-prompt
    inactive-text="普通编辑器"
    active-text="富文本编辑器"
  /> -->
  <!-- <el-button @click="modify">修改</el-button> -->
</template>
<style scoped>
.el-button {
  margin-top: 10px;
}
.el-switch {
  margin-top: 10px;
  float: right;
}
</style>
