<template>
  <div class="burger-menu">
    <!-- "Home" 标签始终显示 -->
    <a href="/posts" class="home">主页</a>
    <!-- 汉堡按钮，只在屏幕尺寸小于500px时显示 -->
    <button
      class="menu-toggle"
      v-if="windowWidth < 500"
      :class="{ active: isActive }"
      @click="toggleMenu"
    >
      <div class="line" v-for="line in 3" :key="line"></div>
    </button>
    <!-- 菜单项容器 -->
    <div class="menu-container">
      <!-- 其他菜单项，响应式显示 -->
      <div class="menu" :class="{ 'is-active': isActive || windowWidth >= 500 }">
        <ul class="menu-list">
          <li v-show="login">
            <a :href="`/user/${currentUser.username}`">个人资料</a>
          </li>
          <li v-if="isCommentManage">
            <a href="/commentManagement">评论管理</a>
          </li>
          <li v-if="!login" class="login-text"><a href="/login">登录</a></li>
          <li v-else>
            <a href="#" @click.prevent="toggleContactDropdown"
              >{{ accountLabel }}<el-icon><i-ep-CaretBottom /></el-icon
            ></a>
            <transition name="fade">
              <div class="contact-dropdown" v-if="isContactDropdownActive">
                <a href="/changePassword">修改密码</a>
                <a href="/changeEmail" v-if="isConfirmed">修改邮箱</a>
                <a href="/bindEmail" v-else>绑定邮箱</a>
                <a @click="log_out" href="/posts">退出</a>
              </div>
            </transition>
          </li>
          <!-- <li>
            <el-switch
              v-model="isDark"
              style="--el-switch-on-color: #303133; --el-switch-off-color: #c0c4cc"
              :active-action-icon="_Moon"
              :inactive-action-icon="_Sunny"
              @change="toggleDark"
            />
          </li> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useCurrentUserStore } from '@/stores/currentUser'
// import { useDark } from "@pureadmin/utils";
// import { Sunny, Moon } from '@element-plus/icons-vue'
export default {
  name: 'BurgerMenu',
  data() {
    return {
      isActive: false,
      windowWidth: window.innerWidth,
      menuItems: [
        { label: 'About', href: '#' },
        { label: 'Services', href: '#' },
        { label: 'Contact', href: '#' }
      ],
      isContactDropdownActive: false,
      accountLabel: '账户'
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    // const { isDark, toggleDark } = useDark();
    // return { currentUser,isDark, toggleDark }
    return { currentUser }
  },
  computed: {
    login() {
      this.currentUser.loadUserName()
      return this.currentUser.username != ''
    },
    isCommentManage() {
      return this.currentUser.roleId >= 2
    },
    isConfirmed() {
      return this.currentUser.isConfirmed == 'true'
    },
    // _Moon(){
    //   return Moon
    // },
    // _Sunny(){
    //   return Sunny
    // }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.userName = to.params.userName
      vm.$nextTick(() => {})
    })
  },
  mounted() {
    this.currentUser.loadUserName()
    this.currentUser.loadRoleId()
    this.currentUser.loadConfirmed()
  },
  created() {
    window.addEventListener('resize', this.updateWindowWidth)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateWindowWidth)
  },
  methods: {
    toggleMenu() {
      if (this.windowWidth < 500) {
        this.isActive = !this.isActive
        // 添加或移除 .active 类
        this.$el.querySelector('.menu-toggle').classList.toggle('active')
      }
    },
    updateWindowWidth() {
      this.windowWidth = window.innerWidth
    },
    toggleContactDropdown() {
      this.isContactDropdownActive = !this.isContactDropdownActive
      this.accountLabel = this.isContactDropdownActive ? '关闭' : '账户'
    },
    log_out() {
      localStorage.removeItem('token')
      localStorage.removeItem('currentUserName')
      localStorage.removeItem('isAdmin')
      localStorage.removeItem('roleId')
      localStorage.removeItem('userName')
      localStorage.removeItem('isConfirmed')
      localStorage.removeItem('currentComment')
      // 更新pinia
      this.currentUser.loadUserName()
      // 退出后跳转到主页面 隐藏发布文章区域
      this.currentUser.loadToken()
      this.$message({
        message: '已退出',
        type: 'success',
        duration: 1700
      })

      this.$router.push('/posts')
    },
    handleCommand(command) {
      if (command == 'exit') {
        this.log_out()
      }
    }
  }
}
</script>

<style scoped>
.burger-menu {
  width: 100%;
  height: 6vh;
  display: flex;
}
/* 汉堡按钮样式 */
.menu-toggle {
  cursor: pointer;
  background: none;
  border: none;
  padding: 10px;
  display: none; /* 默认隐藏汉堡按钮，只有在屏幕小于500px时显示 */
  margin-left: auto; /* 将汉堡按钮推到右边 */
  margin-bottom: 10px;
}

.menu-toggle.active .line:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.menu-toggle.active .line:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active .line:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* 汉堡按钮的线条样式 */
.menu-toggle .line {
  width: 20px;
  height: 3px;
  background-color: #606266;
  margin: 5px 0;
  transition: transform 0.2s ease-in-out;
}
.menu-toggle:hover .line {
  background-color: #c0c4cc;
}
/* "Home" 标签样式 */
.home {
  margin-right: auto; /* 将 "Home" 标签推到左边 */
  margin-top: 13px;
  text-decoration: none;
  font-size: 1.1rem;
  color: #303133;
}
.home:hover {
  color: #c0c4cc;
}
/* 菜单项容器样式 */
.menu-container {
  display: flex;
  align-items: center;
}

/* 其他菜单项的样式 */
.menu-list {
  display: flex;
  flex-wrap: nowrap;
  padding: 0;
  margin: 0;
  list-style: none;
}

.menu-list li {
  white-space: nowrap;
  margin-left: 20px; /* 为其他菜单项添加一些间距 */
}

.menu-list a {
  text-decoration: none;
  font-size: 1rem;
  color: #303133;
  padding: 10px 15px;
  display: block; /* 使点击区域包括整个<a>标签 */
}

.menu-list a:hover {
  color: #c0c4cc;
}

/* 其他菜单项在屏幕宽度小于500px时，被汉堡按钮控制 */
.menu {
  display: none;
}

.menu.is-active {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
}

/* 下拉框样式 */
.contact-dropdown {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 300px;
}
.contact-dropdown a {
  border-bottom: 2px solid rgb(240, 238, 238);
}
/* 下拉框的过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 媒体查询，小于500px时的样式 */
@media (max-width: 499px) {
  .menu-toggle {
    display: block; /* 显示汉堡按钮 */
  }
  .menu {
    position: absolute;
    top: 50px;
    left: 0;
    z-index: 15;
  }
  .menu-list {
    flex-direction: column;
  }
  .menu-list li {
    border-bottom: 2px solid rgb(240, 238, 238);
  }
  .menu-list a {
    font-size: 0.8rem;
    color: #3c3c43;
  }
  .menu-list a:hover {
    background-color: #a9a5a5;
    color: #606266;
  }
  .login-text {
    margin-right: 20px;
  }
}

/* 媒体查询，大于等于500px时的样式 */
@media (min-width: 500px) {
  .menu {
    display: flex; /* 菜单项始终显示 */
  }
  .menu-toggle {
    display: none; /* 隐藏汉堡按钮 */
  }
  .contact-dropdown {
    position: absolute;
    z-index: 5;
  }
  .contact-dropdown a:hover {
    color: black;
  }
}
</style>
