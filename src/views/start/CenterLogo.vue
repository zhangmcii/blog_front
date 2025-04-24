<script  setup>
import {GLOBAL_CONFIG} from "@/config";
import { randomNum } from "@/utils/common";
import { onMounted, ref } from "vue";
// import LocalLogo from "@/asset/logo.svg";
import LocalLogo from '@/asset/logo.svg?component'
import { useHead } from "@unhead/vue";

defineOptions({
  name: "CenterLogo",
});

defineProps({
  drawerVisible: Boolean,
  touchable: Boolean
});

const emit = defineEmits({
  backgroundLoaded: []
});

const bgLoaded = ref(false);
const slogan = ref("");

const isLoading = ref(true);
const isLoaded = ref(false);
const initialAnimationDone = ref(false);

if (GLOBAL_CONFIG.LOGO_URL) {
  useHead({
    link: [
      {
        rel: "preload",
        href: GLOBAL_CONFIG.LOGO_URL,
        as: "image",
      },
    ],
  });
}

/**
 * 加载背景图片
 */
function loadBackground() {
  var img = new Image();
  img.src = GLOBAL_CONFIG.BACKGROUND_IMG_URL;
  img.addEventListener("load", () => {
    bgLoaded.value = true;
    emit("backgroundLoaded");
  });
}

/**
 * 前往我的博客
 */
function goToBlog() {
  window.location.href = GLOBAL_CONFIG.BLOG_URL;
}

function randomSlogan() {
  const slogans = GLOBAL_CONFIG.SLOGANS;
  slogan.value = slogans[randomNum(0, slogans.length - 1)];
}
function handleLogoEnterEnd() {
  console.log("handleLogoEnterEnd");
  initialAnimationDone.value = true;
}
function finishLoading() {
  isLoading.value = false;
  isLoaded.value = true;
}

onMounted(() => {
  randomSlogan();
  loadBackground();
  setTimeout(() => {
    finishLoading();
  }, 3000);
});
</script>

<template>
  <div
    :class="[
      'logo-area',
      { 'is-blur': drawerVisible },
      { spin: isLoading && initialAnimationDone },
      { expanded: isLoaded },
    ]"
    :style="{ background: `url(${GLOBAL_CONFIG.BACKGROUND_IMG_URL})` }"
    @animationend="handleLogoEnterEnd"
  >
    <div :class="['img-shadow', { 'img-shadow-show': bgLoaded }]"></div>
    <div class="inner" style="cursor: pointer" @click="goToBlog">
      <!-- <img
        :class="['main-logo', { 'main-logo-top': touchable }]"
        :src="LocalLogo"
      /> -->
      <LocalLogo :class="['main-logo', { 'main-logo-top': touchable }]"/>
      <div :class="['hello', { hello_bottom: touchable }]">
        <div>{{ slogan }}</div>
        <div class="hello_bottom_text">点击以访问 {{ GLOBAL_CONFIG.BLOG_NAME }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url("@/asset/css/animate.scss");
.logo-area {
  background-size: cover !important;
  background-position: center !important;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  display: flex;
  border-radius: 100%;
  /* 初始展开动画 */
  animation: logoEnter 1.2s forwards;
  &.is-blur {
    filter: blur(5px);
  }
  // 加载旋转动画
  &.spin {
    animation: spin 1s infinite, maintainSize 0s forwards;
  }
  // 完成扩展动画
  &.expanded {
    animation: expand 0.5s forwards;
    transition: all 0.3s;
  }
  .img-shadow {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: #fda085;
    overflow: hidden;
    transition: background-color 0.5s;
    border-radius: 100%;
    animation: shadowEnter 1.2s;
    animation-fill-mode: forwards;
  }
  .img-shadow-show {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .inner {
    position: relative;
    .main-logo {
      height: 7rem;
      position: absolute;
      transform: translate(-50%, -50%);
      transition: all 1s;
      top: 0;
    }
    .main-logo-top {
      top: -3.2rem;
    }
    .hello {
      color: #ffffff;
      width: 18.75rem;
      text-align: center;
      position: absolute;
      transform: translate(-50%, -50%);
      font-size: 1.5rem;
      opacity: 0;
      top: 100px;
      transition: all 1s;
    }
    .hello_bottom {
      opacity: 1;
      top: 3.5rem;
      .hello_bottom_text {
        font-size: var(--regular-font-size);
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid #fff;
      }
    }
  }
}
</style>