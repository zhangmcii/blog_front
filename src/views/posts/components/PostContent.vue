<script>
export default {
  props: {
    postContent: {
      type: String,
      default: ''
    },
    preview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pContent: '',
      truncationTryCount: 0 // 新增
    }
  },
  watch: {
    postContent: {
      handler(newVal) {
        this.pContent = newVal
        this.truncationTryCount = 0 // 重置
        this.$nextTick(() => {
          this.updateTruncation()
        })
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.updateTruncation()
    })
  },
  computed: {},
  methods: {
    updateTruncation() {
      if (!this.preview) return

      this.$nextTick(() => {
        const contentDom = this.$refs.md?.$el?.querySelector('.v-show-content')
        if (!contentDom) return

        // 监听图片加载
        const imgs = contentDom.querySelectorAll('img')
        let loadedCount = 0
        const totalImgs = imgs.length

        const checkAllLoaded = () => {
          loadedCount++
          if (loadedCount === totalImgs && this.truncationTryCount < 10) {
            this.truncationTryCount++
            setTimeout(() => {
              this.updateTruncation()
            }, 50)
          }
        }

        if (totalImgs > 0) {
          imgs.forEach((img) => {
            if (!img._truncationLoaded) {
              img._truncationLoaded = true
              img.addEventListener('load', checkAllLoaded)
              img.addEventListener('error', checkAllLoaded)
            }
          })
        }

        // 先移除旧的遮罩
        const oldMask = contentDom.querySelector('.truncation-mask')
        if (oldMask) oldMask.remove()

        // 判断是否超出最大高度
        const maxHeight = 300
        if (contentDom.scrollHeight > maxHeight) {
          contentDom.style.maxHeight = maxHeight + 'px'
          contentDom.style.overflow = 'hidden'
          contentDom.style.position = 'relative'

          // 添加遮罩和省略号
          const mask = document.createElement('div')
          mask.className = 'truncation-mask'
          mask.style.position = 'absolute'
          mask.style.left = 0
          mask.style.right = 0
          mask.style.bottom = 0
          mask.style.height = '40px'
          mask.style.background = 'linear-gradient(rgba(255,255,255,0), #fff 80%)'
          // mask.style.display = 'flex'
          // mask.style.alignItems = 'flex-end'
          // mask.style.justifyContent = 'flex-end'
          // mask.style.pointerEvents = 'none'
          // mask.innerHTML =
          //   '<div style="color:#888;font-size:18px;padding:20px 10px 10px 10px;">...</div>'
          contentDom.appendChild(mask)
        } else {
          contentDom.style.maxHeight = 'none'
          contentDom.style.overflow = 'auto'
          contentDom.style.position = 'static'
        }

        // 延迟再触发一次，兜底
        if (this.truncationTryCount < 10) {
          this.truncationTryCount++
          setTimeout(() => {
            const dom = this.$refs.md?.$el?.querySelector('.v-show-content')
            if (dom && dom.scrollHeight > maxHeight) {
              this.updateTruncation()
            }
          }, 300)
        }
      })
    }
  }
}
</script>

<template>
  <el-row class="text">
    <mavon-editor
      ref="md"
      v-model="pContent"
      class="detail"
      :subfield="false"
      :editable="false"
      box-shadow-style="#ffffff"
      default-open="preview"
      :toolbars-flag="false"
    />
  </el-row>
</template>

<style lang="scss" scoped>
.text {
  margin: 10px 0px 10px 5px;
}

.base {
  // 0.875rem = 14px
  font-size: 0.875rem;
  // font-size: 1.5rem;
  line-height: 1.6;
  letter-spacing: 0.04em;
}

.v-note-wrapper {
  min-height: 25px;
  @extend .base;
}
// 取消md预览时的背景颜色
:deep().v-show-content {
  padding: 8px 0px 15px 0px !important;
  background-color: #ffffff !important;
}

.detail {
  height: 100% !important;
}
</style>
