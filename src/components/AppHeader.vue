<template>
  <div class="burger-menu">
    <!-- "Home" 标签始终显示 -->
    <a @click="goHomePage" class="home">主页</a>
    <MarQuee :text=daySentence :speed="0.7"/>
    <van-popover v-model:show="showPopover" :show-arrow=false placement="bottom-end" :offset="[12,8]"  :actions="actions" @select="onSelect">
      <template #reference>
      <el-avatar class="user-image" size="default" :src="photo.Avatar" @error="errorImage"   />
      </template>
      <template #default v-if="login">
        <van-cell :title="currentUser.name?currentUser.name:'(未设置昵称)'" :label="currentUser.username"  title-style="margin-left:10px">
          <template #icon>
            <el-avatar :src="photo.Avatar" :size="47"/>
          </template>
        </van-cell>
        <van-cell title="个人资料" icon="manager-o" clickable @click="toggleMenu();$router.push(`/user/${currentUser.username}`)"/>
        <van-cell :title="accountLabel" :icon="accountLabel=='账户'?'notes-o':''" is-link arrow-direction="down" @click.prevent="toggleContactDropdown"/>
        <div  v-if="isContactDropdownActive">
          <van-cell title="修改密码" title-style="margin-left:10px" clickable @click="toggleMenu();$router.push('/changePassword')"></van-cell>
          <van-cell title="修改邮箱" title-style="margin-left:10px" clickable @click="toggleMenu();$router.push('/changeEmail')" v-if="isConfirmed"></van-cell>
          <van-cell title="绑定邮箱" title-style="margin-left:10px" clickable @click="toggleMenu();$router.push('/bindEmail')" v-else></van-cell>
        </div>
        <van-cell title="退出登录" icon="peer-pay" clickable @click="log_out" href="/posts"></van-cell>
      </template>
    
    </van-popover>
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
      },
      showPopover:false,
      actions : [
          { text: '登录',icon:'user-o' },
          { text: '注册',icon:'add-o' },
      ],
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
    this.currentUser.loadName()
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
        this.showPopover = !this.showPopover
      }
    },
    closeToggleMenu(){
      if(this.showPopover){
        this.showPopover = false
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
      this.toggleMenu();
      localStorage.removeItem('token')
      localStorage.removeItem('currentUserName')
      localStorage.removeItem('currentName')
      localStorage.removeItem('isAdmin')
      localStorage.removeItem('roleId')
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
      this.initImage()
    },
    goHomePage(){
      // 如果汉堡菜单展开，则关闭
      if(this.showPopover){
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
    },
    onSelect(action){
      if(action.text=='登录'){
        this.$router.push('/login')
      }else if(action.text=='注册'){
        this.$router.push('/register')
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
.home {
  margin-right: auto; /* 将 "Home" 标签推到左边 */
  margin-top: 13px;
  text-decoration: none;
  font-size: 1.1rem;
  color: #303133;
  white-space: nowrap;
  margin-right:3px;
}
.user-image {
  margin-top:2px;
}
.van-cell  {
  width: 200px;
}
.van-divider {
  margin: 10px 0px 0px 0px;
}
</style>
