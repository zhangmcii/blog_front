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
    <FloatButton shape="square" description="HELP" :right="96" menu-trigger="click">
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
    </FloatButton>

    <div
      class="hamburger"
      id="hamburger-3"
      :class="{ 'is-active': hamburgerActive }"
      @click="hamburgerActive = !hamburgerActive"
    >
      <span class="line"></span>
      <span class="line"></span>
      <span class="line"></span>
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
  width: 56px;
  height: 27px;
  margin: 0px auto;
  background-color: #00000033;
  display: flex;
  flex-direction: column;
  justify-content: center; // 垂直居中
  align-items: center;
}
.hamburger .line {
  width: 24px;
  height: 1px;
  background-color: #ecf0f1;
  display: block;
   margin: 4px 0; 
  -webkit-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}


.hamburger:hover {
  cursor: pointer;
}

#hamburger-3 {
  -webkit-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
#hamburger-3.is-active {
  animation: smallbig 0.6s forwards;
}
@keyframes smallbig {
  0%,
  100% {
    -webkit-transform: scale(1);
    -ms-transform: scale(1);
    -o-transform: scale(1);
    transform: scale(1);
  }
  50% {
    -webkit-transform: scale(0);
    -ms-transform: scale(0);
    -o-transform: scale(0);
    transform: scale(0);
  }
}
#hamburger-3.is-active .line:nth-child(1),
#hamburger-3.is-active .line:nth-child(2),
#hamburger-3.is-active .line:nth-child(3) {
  -webkit-transition-delay: 0.2s;
  -o-transition-delay: 0.2s;
  transition-delay: 0.2s;
}
#hamburger-3.is-active .line:nth-child(2) {
  opacity: 0;
}
#hamburger-3.is-active .line:nth-child(1) {
  -webkit-transform: translateY(13px) rotate(45deg);
  -ms-transform: translateY(13px) rotate(45deg);
  -o-transform: translateY(13px) rotate(45deg);
  transform: translateY(9px) rotate(45deg);
}
#hamburger-3.is-active .line:nth-child(3) {
  -webkit-transform: translateY(-13px) rotate(-45deg);
  -ms-transform: translateY(-13px) rotate(-45deg);
  -o-transform: translateY(-13px) rotate(-45deg);
  transform: translateY(-9px) rotate(-45deg);
}
</style>
