<script>
import postApi from '@/api/posts/postApi.js'
import ButtonClick from '@/utils/components/ButtonClick.vue'
import RichText from '@/utils/components/RichText.vue'
import PageHeadBack from '@/utils/components/PageHeadBack.vue'
export default {
  components: {
    ButtonClick,
    RichText,
    PageHeadBack
  },
  data() {
    return {
      post: {},
      postId: -1,
      rich_content: {
        body: '',
        bodyHtml: ''
      },
      originalPost: '',
      isChange:false,
      loading: false,
      activeRichEditor: false
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.postId = to.params.id
      vm.$nextTick(() => {})
    })
  },
  mounted() {
    if (this.postId != -1) {
      this.getPostById(this.postId)
    }
  },
  watch: {
    'post.body'(newVal){
        this.isChange = newVal !== this.originalPost
    },
    'rich_content.body'(newVal){
        this.isChange = newVal !== this.originalPost
    }
  },
  methods: {
    getPostById(postId) {
      postApi.getPost(postId).then((res) => {
        if (res.data.msg == 'success') {
          this.originalPost = res.data.data.body
          this.post = res.data.data
          if (this.post.body_html) {
            this.activeRichEditor = true
          }
        }
      })
    },
    normalModify() {
      this.loading = true
      postApi.editPost(this.post.id, { body: this.post.body, bodyHtml: null }).then((res) => {
        if (res.data.msg == 'success') {
          this.loading = false
          this.$message.success('修改成功')
          this.$router.push(`/share/${this.postId}`)
        } else {
          this.loading = false
          this.$message.success('修改失败')
        }
      })
    },
    richEditorModify() {
      this.loading = true
      postApi.editPost(this.post.id, this.rich_content).then((res) => {
        if (res.data.msg == 'success') {
          this.loading = false
          this.$message.success('修改成功')
          this.post.body = this.rich_content.body
          this.post.body_html = this.rich_content.bodyHtml
          this.$router.push(`/share/${this.postId}`)
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
  <PageHeadBack>
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
    <ButtonClick content="修改" :loading="loading" :disabled="!isChange" @do-search="modify" />
  </PageHeadBack>
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
