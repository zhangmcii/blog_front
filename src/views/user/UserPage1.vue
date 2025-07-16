<template>
  <div class="vapp-fullscreen-background">
    <div class="nickname">{{ user.nickname }}</div>
    <div class="avatar" style="margin-top: 2rem">
      <el-avatar
        src="/src/asset/image.png"
        fit="fill"
        alt="Leleo"
        style="border-radius: 50%; width: 120px; height: 120px"
      />
    </div>

    <!-- tags -->
    <el-card>
      <div class="card-title">
        <span>Tags</span>
      </div>
      <div class="tags-container">
        <el-tag
          class="golang"
          v-for="item in personalizedtags"
          :key="item"
          size="small"
          round
          @click="playTagAnimation"
        >
          {{ item }}
        </el-tag>
      </div>
    </el-card>
    <!-- 打字机 -->
    <typewriter class="typewriter"></typewriter>

    <!-- <el-card class="interest-card">
     <interest :interest="user.interest" :showButton="false" />
    </el-card> -->

    <!-- 设置齿轮按钮 -->
    <!-- <FloatButton shape="square" description="HELP" :right="96" menu-trigger="click">
      <template #icon>
        <el-icon><i-ep-Setting /></el-icon>
      </template>
      <template #menu>
        <FloatButton shape="square">
          <template #icon>
            <el-icon><i-ep-Clock /></el-icon>
          </template>
        </FloatButton>
        <FloatButton>
          <template #icon>
            <el-icon><i-ep-Clock /></el-icon>
          </template>
        </FloatButton>
      </template>
    </FloatButton> -->

    <socialLinks />
    <div class="hamburger" @click="but = !but">
      <van-icon name="wap-nav" size="24" v-show="!but" />
      <van-icon name="cross" size="24" v-show="but" />
    </div>
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
.nickname {
  color: #ffffff;
  font-size: 2.3rem;
  text-align: center;
}
.avatar {
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
.el-card {
  max-width: 270px;
  margin: 0 auto; /* 左右边距自动 */
  padding: 2px;
  .card-title {
    text-align: center;
    margin-bottom: 10px;
    color: #ffffff;
    font-size: 20px;
  }
  .tags-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}
.el-tag {
  @extend .glass;
  margin: 4px;
}
:deep(.el-tag__content) {
  color: #ffffff;
  font-family: sans-serif;
}

// 点击tag的动画
.golang {
  transition: all 0.2s ease-in-out;
  position: relative;
  opacity: 1;
  overflow: hidden;
}

.golang:before {
  content: '';
  background-color: rgba(255, 255, 255, 0.5);
  height: 100%;
  width: 3em;
  display: block;
  position: absolute;
  top: 0;
  left: -4.5em;
  transform: skewX(-45deg) translateX(0);
  transition: none;
}

// 如果一个标签中同时使用了这两个类,
// 则响应此样式规则。
.golang.animate:before {
  transform: skewX(-45deg) translateX(260px);
  transition: all 0.7s ease-in-out;
}
.typewriter {
  margin: 12px;
}
.interest-card {
  max-width: 90%;
  margin: 0 auto; /* 左右边距自动 */
  padding: 2px;
}

.setting {
  margin-top: 1rem;
}
.hamburger {
  position: absolute;
  bottom: 8%;
  right: 43%;

  width: 56px;
  height: 27px;
  margin: 0px auto;
  background-color: #00000033;
  display: flex;
  
  // 线条垂直居中
  flex-direction: column;
  justify-content: center; 
  align-items: center;
}
.socialPlatformIcons {
  width: 100%;
}
</style>
