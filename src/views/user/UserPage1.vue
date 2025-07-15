<template>
  <div class="vapp-fullscreen-background">
    <div class="leleo-left-avatar" style="margin-top: 2rem">
      <el-avatar
        src="/src/asset/image.png"
        fit="fill"
        alt="Leleo"
        style="border-radius: 50%; width: 120px; height: 120px"
      />
    </div>

    <!-- tags -->
    <el-card class="leleo-left-card" style="">
      <div class="card-title">
        <span>Tags</span>
      </div>
      <div class="tags">
      <el-tag v-for="item in personalizedtags" :key="item" size="small" round>
        {{ item }}
      </el-tag>
      </div>
    </el-card>
  </div>
</template>

<script src="./userPage.js"></script>

<style lang="scss" scoped>
:root {
  --leleo-background-image-url: none;
}
.vapp-fullscreen-background {
  min-height: 100vh;
  width: 100vw;
  position: relative;
  background-image: var(--leleo-background-image-url);
  background-size: cover;
  background-position: center;
  overflow: hidden;
}
.leleo-left-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.glass {
  //设置为毛玻璃样式
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(12px);
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
.el-card {
  @extend .glass;
  border-radius: 5%;
}
.leleo-left-card {
  max-width: 270px;
  margin: 0 auto; /* 左右边距自动 */
  padding: 2px;
  .card-title {
    text-align: center;
    margin-bottom: 10px;
    color: #ffffff;
    font-size: 20px;
  }
  .tags{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}
:deep(.el-tag__content) {
  color: #ffffff;
  font-family: sans-serif;
}

.el-tag {
  @extend .glass;
  margin: 4px;
}
</style>
