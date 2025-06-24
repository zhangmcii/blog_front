<template>
  <div class="markdown-editor">
    <mavon-editor v-model="markdown" @change="change" />
    <div class="preview" v-html="htmlContent"></div>
    <div class="law">markdown:{{ markdown }}</div>
    <div class="transform-law">{{ htmlContent }}</div>
    <!-- <el-button type="primary" size="small">发布</el-button> -->
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import MarkdownIt from 'markdown-it'

const props = defineProps({
  bodyInit: {
    type: String,
    default() {
      return ''
    }
  },
  bodyHtmlInit: {
    type: String,
    default() {
      return ''
    }
  }
})

const emit = defineEmits(['content_change'])

const md = new MarkdownIt()

// 编辑器内容
const markdown = ref('')

// 计算属性：将 Markdown 转换为 HTML
const htmlContent = computed(() => {
  return md.render(markdown.value)
})

onBeforeMount(() => {
  markdown.value = props.bodyInit || ''
})
// 处理图片上传
const handleImageUpload = async (pos, file) => {
  // 创建 FormData 对象
  const formData = new FormData()
  formData.append('image', file)

  try {
    // 上传到后端
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      const result = await response.json()
      if (result.errno === 0 && result.data.length > 0) {
        const imageUrl = result.data[0]
        // 将图片 URL 插入到 Markdown 中
        this.$refs.mavonEditor.$img2Url(pos, imageUrl)
      }
    }
  } catch (error) {
    console.error('图片上传失败:', error)
  }
}

function change(value) {
  console.log('Markdown 内容变化:', value)
  emit('content_change', { body: value, bodyHtml: md.render(value) })
}
</script>

<style scoped></style>
