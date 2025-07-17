<template>
  <div class="vapp-fullscreen-background">
    <el-switch
      v-model="isUserPage"
      size="large"
      style="--el-switch-on-color: #424242; --el-switch-off-color: #424242"
      inline-prompt
      active-text="主页"
      inactive-text="文章"
      @change="handleSwitchChange"
    />
    <div class="avatar" style="margin-top: 1rem">
      <el-avatar
        src="/src/asset/image1.png"
        fit="fill"
        alt="Leleo"
        style="border-radius: 50%; width: 120px; height: 120px"
      />
    </div>

    <div v-show="isUserPage">
      <!-- tags -->
      <el-card class="tags-container">
        <div class="card-title"></div>
        <div class="tags">
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
      <div class="user-info-container">
        <el-row :gutter="1">
          <el-col :span="12">
            <el-card class="user-info" shadow="never">
              <div class="card-title">
                <span>个人信息</span>
                <el-button round size="small" v-if="isCurrentUser" @click="editProfile"
                  >编辑资料</el-button
                >
                <el-button
                  type="danger"
                  round
                  size="small"
                  v-if="currentUser.isAdmin"
                  @click="editProfileAdmin"
                  >编辑资料 [管理员]</el-button
                >
              </div>
              <el-skeleton
                :rows="5"
                animated
                :loading="loading.userData"
                :throttle="skeletonThrottle"
              >
                <template #default>
                  <el-row v-if="user.nickname">
                    <el-col :xs="6" :xl="4">昵称</el-col>
                    <el-col :xs="8" :xl="10" :offset="2">{{ user.nickname }}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :xs="6" :xl="4">账号</el-col>
                    <el-col :xs="16" :xl="10" :offset="2">{{ user.username }}</el-col>
                  </el-row>
                  <el-row v-if="user.about_me">
                    <el-col :xs="6" :xl="4">签名</el-col>
                    <el-col :xs="16" :xl="10" :offset="2">{{ user.about_me }}</el-col>
                  </el-row>

                  <el-row v-if="user.email">
                    <el-col :xs="6" :xl="4">电子邮件</el-col>
                    <el-col :xs="8" :xl="10" :offset="2">{{ user.email }}</el-col>
                  </el-row>
                  <el-row v-if="user.location">
                    <el-col :xs="6" :xl="4">城市</el-col>
                    <el-col :xs="16" :xl="10" :offset="2">{{ location }}</el-col>
                  </el-row>

                  <el-row>
                    <el-col :xs="6" :xl="4">生日</el-col>
                    <el-col :xs="8" :xl="10" :offset="2">{{ member_since }}</el-col>
                  </el-row>

                  <el-row>
                    <el-col :xs="6" :xl="4">上线时间</el-col>
                    <el-col :xs="8" :xl="10" :offset="2">{{ from_now }}</el-col>
                  </el-row>
                </template>
              </el-skeleton>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="fans" shadow="never">
              <el-skeleton animated :loading="loading.userData" :throttle="skeletonThrottle">
                <template #template>
                  <div style="display: flex; justify-items: space-between; gap: 15px; height: 47px">
                    <el-skeleton-item variant="text" class="item" />
                    <el-skeleton-item variant="text" class="item" />
                  </div>
                </template>
                <template #default>
                  <el-row>
                    <el-col :span="6">
                      <el-statistic
                        title="粉丝"
                        :value="user.followers_count"
                        @click="followerDetail"
                      />
                    </el-col>
                    <el-col :span="6">
                      <el-statistic
                        title="关注"
                        :value="user.followed_count"
                        @click="followedDetail"
                      />
                    </el-col>
                  </el-row>
                </template>
              </el-skeleton>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <!-- 打字机 -->
      <!-- <typewriter class="typewriter"></typewriter> -->
      <ButtonAnimate
        content="喜欢的电影"
        :isActive="activeInterest === 'movie'"
        @click="setActive('movie')"
      />
      <ButtonAnimate
        content="在看的书籍"
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

    <div v-show="!isUserPage">
      <SkeletonUtil :loading="loading.userData" :row="5" :count="1" :showAvatar="false">
        <PostPreview
          v-for="item in posts"
          :key="item.id"
          :post="item"
          :containerStyle="{ marginBottom: '10px' }"
          @click="$router.push(`/postDetail/${item.id}`)"
          v-slide-in
        >
          <template #image>
            <PostImage :postImages="item.post_images" @click.stop="" />
          </template>
        </PostPreview>
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="posts_count"
          @current-change="handleCurrentChange"
          :hide-on-single-page="true"
          :pager-count="5"
        />
        <el-empty :image-size="200" description="生活总归带点荒谬" v-if="posts.length === 0" />
      </SkeletonUtil>
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
  font-size: 2rem;
  text-align: center;
}

.el-switch {
  position: fixed;
  right: 0;
  z-index: 99;
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
.tags-container {
  @extend .glass;
  max-width: 270px;
  margin: 0 auto; /* 左右边距自动 */

  .tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}
:deep(.el-card__body) {
  padding: 8px;
}
.user-info-container {
  width: 90%;
  margin: 0 auto;
}
.user-info {
  @extend .glass;
  .card-title {
    margin-bottom: 10px;
    color: #ffffff;
    font-size: 20px;
  }
}

.fans {
  @extend .glass;
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
