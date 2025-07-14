<template>
  <div class="vapp-fullscreen-background">
    <transition name="fade">
      <div class="loading" v-show="isloading">
        <loader></loader>
      </div>
    </transition>

    <video autoplay loop muted class="video-bg" id="bg-video" ref="VdPlayer">
      <source :src="videosrc" type="video/mp4" />
    </video>

    <div class="floating-switch-container">
      <el-switch
        v-model="isClearScreen"
        :style="xs ? 'transform:scale(0.6) translateX(15%)' : ''"
        class="floating-switch"
        @mouseenter="expandSwitch"
        @mouseleave="collapseSwitch"
      />
    </div>

    <div v-show="!isloading && !isClearScreen" :style="xs||sm ? 'overflow-y:auto;overflow-x:hidden' : ''">
      <el-row>
        <el-col :span="24" :md="8" :lg="6" class="leleo-left" style="text-align:center;">
          <div :style="xs||sm ? 'font-size:2.3rem' : 'display:none'" class="leleo-left-welcome">
            {{ configdata.welcometitle }}
          </div>
          <!-- 头像 -->
          <div
            class="leleo-left-avatar"
            :style="xs||sm ? 'margin-top:0' : 'margin-top:2rem'"
            @mouseenter="musicplayershow(1)"
            @mouseleave="musicplayershow(0)"
          >
            <img
              :class="{ 'leleo-spin': isPlaying }"
              :src="configdata.avatar"
              alt="Leleo"
              style="border-radius:50%;width:120px;height:120px;"
            />
            <transition name="fade">
              <el-card v-show="ismusicplayer" class="musicplayer fade-in" shadow="hover">
                <div v-if="audioLoading" class="loading-spinner">
                  <el-icon><i class="el-icon-loading"></i></el-icon>
                </div>
                <span ref="audiotitle" class="musicplayer-text" style="top:1.6rem;font-weight:bolder;">
                  {{ musicinfo?.[0]?.title }}
                </span>
                <span ref="audioauthor" class="musicplayer-text" style="bottom:1.4rem;">
                  {{ musicinfo?.[0]?.author }}
                </span>
                <audio
                  v-show="false"
                  ref="audioPlayer"
                  :src="musicinfo?.[0]?.url"
                  @waiting="onWaiting"
                  @canplay="onCanPlay"
                ></audio>
                <el-button size="small" icon="el-icon-back" @click="previousTrack"></el-button>
                <el-button size="medium" icon="el-icon-video-play" @click="togglePlay">
                  <i :class="isPlaying ? 'el-icon-video-pause' : 'el-icon-video-play'"></i>
                </el-button>
                <el-button size="small" icon="el-icon-right" @click="nextTrack"></el-button>
              </el-card>
            </transition>
          </div>

          <!-- tags -->
          <el-card class="leleo-left-card" :style="xs ? 'max-width:270px' : 'max-width:300px;text-align:center;'">
            <template #header>
              <span>Tags</span>
            </template>
            <el-tag
              v-for="item in personalizedtags"
              :key="item"
              class="ma-1"
              size="small"
              effect="plain"
              style="margin:2px;"
            >
              {{ item }}
            </el-tag>
          </el-card>

          <!-- 图形 -->
          <div class="leleo-left-chart">
            <polarchart :style="xs||sm ? 'height:210px' : 'height:270px'" />
          </div>

          <!-- 社交平台 -->
          <div class="leleo-left-socialIconsContainer">
            <el-row type="flex" justify="center" align="middle">
              <el-col v-for="item in socialPlatformIcons" :key="item.icon" :span="2" class="pa-1">
                <el-button
                  :icon="item.icon"
                  :style="xs ? 'font-size:20px' : 'font-size:25px'"
                  class="leleo-social-bticon"
                  circle
                  @click="jump(item.link)"
                ></el-button>
              </el-col>
            </el-row>
            <!-- 设置齿轮按钮 -->
            <el-row type="flex" justify="center" align="middle" class="setting">
              <el-col class="ma-1" :span="2">
                <el-dropdown trigger="click">
                  <el-button circle icon="el-icon-setting"></el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="dialog1 = true">
                        <el-icon><i class="el-icon-key"></i></el-icon> 样式
                      </el-dropdown-item>
                      <el-dropdown-item @click="dialog2 = true">
                        <el-icon><i class="el-icon-info"></i></el-icon> 关于
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-col>
            </el-row>
          </div>
        </el-col>

        <!-- 右侧内容 -->
        <el-col :span="24" :md="16" :lg="18" style="height:100vh;" :style="xs||sm ? '' : 'overflow:auto'">
          <homeright
            :configdata="configdata"
            :formattedTime="formattedTime"
            :formattedDate="formattedDate"
            :projectcards="projectcards"
          />
        </el-col>
      </el-row>
    </div>

    <!-- 自定义配置 -->
    <el-dialog v-model="dialog1" width="1000px">
      <el-card style="backdrop-filter: blur(10px);">
        <el-tabs v-model="tab" stretch>
          <el-tab-pane
            v-for="item in tabs"
            :key="item.value"
            :label="item.text"
            :name="item.value"
          >
            <div v-if="item.value === 'tab-3' && musicinfoLoading" class="loading-spinner" align="center">
              <el-icon><i class="el-icon-loading"></i></el-icon>
            </div>
            <component
              v-if="item.value !== 'tab-3' || (item.value === 'tab-3' && !musicinfoLoading)"
              :is="item.component"
              @cancel="handleCancel"
              :musicinfo="item.value === 'tab-3' ? musicinfo : []"
              :currentIndex="item.value === 'tab-3' ? playlistIndex : null"
              :isPlaying="item.value === 'tab-3' ? isPlaying : null"
              :audioPlayer="item.value === 'tab-3' ? audioPlayer : null"
              :fromLyrics="item.value === 'tab-3' ? lyrics : null"
              :audioLoading="item.value === 'tab-3' ? audioLoading : null"
              @update:current-index="updateCurrentIndex"
              @update:is-playing="updateIsPlaying"
              @update:current-lyrics="updateLyrics"
            />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-dialog>

    <!-- 关于 -->
    <el-dialog v-model="dialog2" width="700px">
      <el-card class="ma-3 pa-2" style="text-align:center;backdrop-filter: blur(10px);">
        <template #header>
          <span class="leleo-card-title">关于</span>
        </template>
        <div style="display:flex;flex-direction:column;align-items:center;">
          <el-card class="ma-3 pa-2" style="max-width:400px;text-align:center;">
            <template #header>
              <span class="leleo-card-subtitle">本页基于以下技术及服务搭建</span>
            </template>
            <div>
              <el-tooltip v-for="item in stackicons" :key="item.icon" :content="item.tip" placement="top">
                <el-button :icon="item.icon" :style="'background:' + item.color + ';color:white;margin:2px;'" circle></el-button>
              </el-tooltip>
              <!-- 其它自定义图标 -->
              <el-tooltip content="vite" placement="top">
                <el-button circle style="margin:2px;">
                  <img src="/img/stackicon/vite.svg" style="width:23px;" />
                </el-button>
              </el-tooltip>
              <el-tooltip content="less" placement="top">
                <el-button circle style="margin:2px;background:#254B7C;color:white;">
                  <span style="font-size:8px;font-weight:bolder;">{less}</span>
                </el-button>
              </el-tooltip>
              <el-tooltip content="mdi" placement="top">
                <el-button circle style="margin:2px;">
                  <img src="/img/stackicon/mdi.svg" style="width:23px;" />
                </el-button>
              </el-tooltip>
              <el-tooltip content="chartjs" placement="top">
                <el-button circle style="margin:2px;">
                  <img src="/img/stackicon/chartjs.png" style="width:23px;" />
                </el-button>
              </el-tooltip>
              <el-tooltip content="meting" placement="top">
                <el-button circle style="margin:2px;background:#0F1225;">
                  <img src="/img/stackicon/meting.png" style="width:23px;" />
                </el-button>
              </el-tooltip>
              <el-tooltip content="uiverse" placement="top">
                <el-button circle style="margin:2px;background:#070707;">
                  <img src="/img/stackicon/uiverse.png" style="width:23px;" />
                </el-button>
              </el-tooltip>
            </div>
          </el-card>
          <p class="ma-6">
            <span v-for="item in configdata.statement" :key="item">
              {{ item }}<br />
            </span>
          </p>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script src="./app.js"></script>

<style>
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
.floating-switch-container {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 10;
}
.floating-switch {
  background: rgba(255,255,255,0.6);
  border-radius: 20px;
}
.leleo-left-welcome {
  margin-top: 1rem;
  font-weight: bold;
}
.leleo-left-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}
.leleo-spin {
  animation: leleo-spin 2s linear infinite;
}
@keyframes leleo-spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
.musicplayer {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 16px;
  background: rgba(255,255,255,0.8);
}
.musicplayer-text {
  display: block;
  margin: 0.5rem 0;
}
.leleo-left-card {
  margin: 1.5rem 0;
}
.leleo-left-chart {
  margin: 1.5rem 0;
}
.leleo-left-socialIconsContainer {
  margin: 1.5rem 0;
}
.leleo-social-bticon {
  margin: 0 0.2rem;
}
.setting {
  margin-top: 1rem;
}
.leleo-card-title {
  font-size: 1.5rem;
  font-weight: bold;
}
.leleo-card-subtitle {
  font-size: 1rem;
  color: #888;
}
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>