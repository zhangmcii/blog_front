<script setup>
import { useLevel } from 'undraw-ui'
defineProps({ scope: Object, loading: Boolean })
</script>

<template>
  <el-skeleton
    :loading="loading"
    :throttle="{ leading: 300, trailing: 300, initVal: true }"
    animated
  >
    <template #template>
      <el-skeleton-item variant="image" style="width: 50px; height: 50px; margin-bottom: 10px" />
      <div>
        <el-skeleton-item variant="h3" style="width: 100px" />
        <el-skeleton-item variant="text" style="margin-right: 16px" />
        <el-skeleton-item variant="text" style="width: 100px" />
      </div>
    </template>
    <template #default>
      <div class="user-card">
        <div class="user-avatar" @click.stop="$router.push(`/user/${scope.jumpId}`)">
          <el-avatar style="margin-top: 5px" :size="40" fit="cover" :src="scope.avatar" />
        </div>
        <div class="user-content">
          <div class="user-info">
            <div href="" class="username">
              <span
                class="name"
                style="max-width: 10em"
                @click.stop="$router.push(`/user/${scope.jumpId}`)"
                >{{ scope.username }}</span
              >
              <span blank="true" class="rank">
                <u-icon size="24" v-html="useLevel(scope.level)"></u-icon>
              </span>
            </div>
          </div>
          <div class="social-info">
            <a href="" class="attention">
              <span>{{ scope.attention }}</span>
              <span>关注</span>
            </a>
            <a href="" class="follower">
              <span>{{ scope.follower }}</span>
              <span>粉丝</span>
            </a>
            <a href="" class="like">
              <span>{{ scope.like }}</span>
              <span>获赞</span>
            </a>
          </div>
          <div class="card-btn">
            <el-button type="primary">关注</el-button>
            <el-button>发消息</el-button>
          </div>
        </div>
      </div>
    </template>
  </el-skeleton>
</template>

<style lang="scss" scoped>
.user-card {
  display: flex;
  .user-content {
    flex: 1;
    margin-left: 16px;
    .user-info {
      .username {
        display: flex;
        align-items: center;
        text-decoration: none;
        .name {
          max-width: 100px;
          font-weight: 500;
          font-size: 15px;
          color: #252933;
          line-height: 32px;
          margin-right: 4px;
        }
      }
    }
    .social-info {
      font-size: 12px;
      margin-bottom: 10px;
      a {
        text-decoration: none;
      }
      a:not(:first-child) {
        margin-left: 18px;
      }
      a span:last-child {
        margin-left: 3px;
        color: #9499a0;
      }
    }
  }
}
</style>
