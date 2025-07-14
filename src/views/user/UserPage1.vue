<template>
  <div class="vapp-fullscreen-background">
  </div>
</template>

<script src="./userPage.js"></script>

<style lang="scss" scoped >
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
.video-bg {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  object-fit: cover;
  z-index: -100;
}
</style>