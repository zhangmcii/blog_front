<template>
  <div class="container">
    <el-input
      v-model="textarea2"
      :autosize="{ minRows: 4, maxRows: 10 }"
      type="textarea"
      placeholder="书写片段，温润流年..."
      :input-style="inputStyle"
    />
    <div class="image-upload">
      <input type="file" @change="previewImage" accept="image/*" />
      <img src="" v-if="imageData" />
    </div>
    <div class="character-count">{{ characterCount }}/150</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      imageData: null,
      textarea2: '',
      inputStyle: {
        width: '100%',
        marginBottom: '10px',
        borderColor: '#ffffff',
        boxShadow: '0 0 0 0 #ffffff'
      }
    }
  },
  computed: {
    characterCount() {
      return this.message.length
    }
  },
  methods: {
    previewImage(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imageData = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.el-textarea__inner {
  /* 去掉去除右下角默认小图标 */
  resize: none;
  /* 隐藏滚动条 */
  overflow: hidden;
}
.image-upload {
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.image-upload input {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.image-upload img {
  max-width: 100%;
  max-height: 100%;
}

.character-count {
  text-align: right;
}
</style>
