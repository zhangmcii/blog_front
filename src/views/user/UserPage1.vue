<template>
  <div class="vapp-fullscreen-background">
    <div class="nickname">{{ user.nickname }}</div>
    <div class="avatar" style="margin-top: 2rem">
      <el-avatar
        src="/src/asset/image1.png"
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
    <!-- <typewriter class="typewriter"></typewriter> -->
    <ButtonAnimate
      content="喜欢的电影"
      :isActive="activeInterest === 'movie'"
      @click="setActive('movie')"
    />
    <ButtonAnimate
      content="在看到书籍"
      :isActive="activeInterest === 'book'"
      @click="setActive('book')"
    />
   
    <interest :showInterest="activeInterest" :interest="user.interest" :showButton="false" />
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
  // background-color: rgb(95, 96, 95);
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

//设置为毛玻璃样式
.glass {
  backdrop-filter: blur(7px);
  border-radius: 5%;
  color: #ffffff;
  /* 确保背景透明，显示毛玻璃效果 */
  background-color: transparent;
  /* 移除默认边框 */
  border: none;
}

.el-card {
  @extend .glass;

  max-width: 270px;
  margin: 0 auto; /* 左右边距自动 */
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
:deep(.el-card__body) {
  padding: 8px;
}
.el-tag {
  background-color: transparent;
  margin: 4px;
  padding: 0px 10px;
  border: 1px solid rgb(216.8, 235.6, 255);
  border-color: rgba(0, 0, 0, 0.12);
}
:deep(.el-tag__content) {
  color: #ffffff;
  font-family: Roboto, sans-serif;
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

.hamburger {
  // position: absolute;
  // bottom: 8%;
  // right: 43%;

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
