<template>
  <div class="markdown-editor">
    <mavon-editor
      ref="mavonEditor"
      v-model="markdown"
      @imgAdd="handleImageUpload"
      @change="change"
    />
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import { compressImages } from '@/utils/common.js'
import uploadApi from '@/api/upload/uploadApi.js'
import { v4 as uuidv4 } from 'uuid'
import * as qiniu from 'qiniu-js'
import lrz from 'lrz'

export default {
  name: 'MarkdownEditor',
  props: {
    bodyInit: {
      type: String,
      default: () => ''
    },
    bodyHtmlInit: {
      type: String,
      default: () => ''
    }
  },
  emits: ['content_change'],
  data() {
    return {
      markdown: '',
      md: new MarkdownIt(),
      // 原始文件
      originalFiles: [],
      // 压缩后的文件
      compressedImages: [],
      // 默认压缩比率为80%
      compressedRatio: 80
    }
  },
 
  mounted() {
    this.markdown = this.bodyInit || ''
  },
  methods: {
    debounce(func, wait) {
      let timeout
      return function (...args) {
        const context = this
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          func.apply(context, args)
        }, wait)
      }
    },
    async handleImageUpload(pos, file) {
      // 为每个文件生成唯一标识符
      file.uid = uuidv4() 

      console.log('图片上传:', pos, file)
      // 图片上传逻辑可在此补充
      // 例如上传后调用 this.$refs.mavonEditor.$img2Url(pos, imageUrl)

      // 压缩图片
      
      // 确保只添加新的文件
      const newFiles = fileList.filter(
        (f) => !this.originalFiles.some((of) => of.lastModified === f.lastModified)
      )
      this.originalFiles = [...this.originalFiles, ...newFiles]
      // console.log('文件列表:', this.originalFiles)
       this.compressedImages = await compressImages(this.originalFiles, this.compressedImages)
    },
    change(value) {
      this.$emit('content_change', {
        body: value,
        bodyHtml: this.md.render(value)
      })
    },
    clean() {
      this.markdown = ''
    }
  }
}
</script>

<style scoped></style>
