<template>
  <div class="burger-menu">
    <!-- "Home" 标签始终显示 -->
    <a @click="goHomePage" class="home">主页</a>
    <MarQuee :text=daySentence :speed="0.7"/>

    <el-avatar size="default" :src="photo.Avatar" @error="errorImage"   @click="toggleMenu"/>

    <!-- 菜单项容器 -->
    <div class="menu-container">
      <!-- 其他菜单项，响应式显示 -->
      <div class="menu" :class="{ 'is-active': isActive || windowWidth >= 500 }">
        <ul class="menu-list">
          <li v-show="login">
            <a @click="this.toggleMenu();this.$router.push(`/user/${currentUser.username}`)">个人资料</a>
          </li>
          <li v-if="isCommentManage">
            <a @click="this.toggleMenu();this.$router.push('/commentManagement')">评论管理</a>
          </li>
          <li v-if="!login" class="login-text"><a href="/login">登录</a></li>
          <li v-else>
            <a  @click.prevent="toggleContactDropdown"
              >{{ accountLabel }}<el-icon><i-ep-CaretBottom /></el-icon
            ></a>
            <transition name="fade">
              <div class="contact-dropdown" v-if="isContactDropdownActive">
                <a @click="this.toggleMenu();this.$router.push('/changePassword')">修改密码</a>
                <a @click="this.toggleMenu();this.$router.push('/changeEmail')" v-if="isConfirmed">修改邮箱</a>
                <a @click="this.toggleMenu();this.$router.push('/bindEmail')" v-else>绑定邮箱</a>
                <a @click="log_out" href="/posts">退出</a>
              </div>
            </transition>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useCurrentUserStore } from '@/stores/currentUser'
import MarQuee from '@/utils/components/MarQuee.vue'
import daysApi from '@/api/days/daysApi.js'
import emitter from '@/utils/emitter.js'
import imageCfg from '@/config/image.js'
export default {
  name: 'BurgerMenu',
  components: {
    MarQuee
  },
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
      accountLabel: '账户',
      daySentence:'',
      photo:{
        Avatar:'',
        default:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
      }
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
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
    isHomePage(){
      return this.$route.path === '/posts'
    },
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
    this.initImage()
    this.daySentence = daysApi.fetchQuote()
    emitter.on('image', (url) => {
      this.photo.Avatar = url
    })
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
      }
    },
    closeToggleMenu(){
      if(this.isActive){
        this.isActive = false
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
      localStorage.removeItem('image')
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
    },
    goHomePage(){
      // 如果汉堡菜单展开，则关闭
      if(this.isActive){
        this.closeToggleMenu()
      }
      if(this.isHomePage){
        return
      }
      this.$router.push('/posts')
    },
    errorImage(){
      this.photo.Avatar = imageCfg.logOut
    },
    initImage(){
      this.currentUser.loadImage()
      if(!this.currentUser.image){
        this.photo.Avatar = imageCfg.logOut
        return 
      }
      this.photo.Avatar = this.currentUser.image
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
/* "Home" 标签样式 */
.home {
  margin-right: auto; /* 将 "Home" 标签推到左边 */
  margin-top: 13px;
  text-decoration: none;
  font-size: 1.1rem;
  color: #303133;
  white-space: nowrap;
  margin-right:3px;
}
.el-avatar {
  margin-top:2px;
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
