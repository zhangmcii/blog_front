<template>
  <div class="burger-menu">
    <div class="home" @click="goHomePage">
      <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" style="height: 32px; width: 35x;"><path d="M512 512m-414 0a414 414 0 1 0 828 0 414 414 0 1 0-828 0Z" fill="#F0C48A"></path><path d="M477.8 249.4h68.4v199.6h-68.4z" fill="#FFFFFF"></path><path d="M673 90.2c-3 0-6-1.2-8.2-3.4C624 46 569.8 23.4 512 23.4c-57.8 0-112 22.4-152.8 63.2-4.6 4.6-12 4.6-16.6 0-4.6-4.6-4.6-12 0-16.6C387.8 25 448 0 512 0s124.2 25 169.4 70.2c4.6 4.6 4.6 12 0 16.6-2.4 2.2-5.4 3.4-8.4 3.4z" fill="#4C4372"></path><path d="M622 141.2c-3 0-6-1.2-8.2-3.4-56-56-147.2-56-203.4 0-4.6 4.6-12 4.6-16.6 0-4.6-4.6-4.6-12 0-16.6 65.2-65.2 171.2-65.2 236.4 0 4.6 4.6 4.6 12 0 16.6-2.2 2.4-5.2 3.4-8.2 3.4zM546.2 460.8h-68.4c-6.4 0-11.8-5.2-11.8-11.8v-199.6c0-6.4 5.2-11.8 11.8-11.8h68.4c6.4 0 11.8 5.2 11.8 11.8v199.6c0 6.6-5.4 11.8-11.8 11.8z m-56.6-23.4h45v-176.2h-45v176.2z" fill="#4C4372"></path><path d="M497.363941 293.662997a70.8 70.8 0 1 0 29.382275-138.51802 70.8 70.8 0 1 0-29.382275 138.51802Z" fill="#FD919E"></path><path d="M512 306.8c-45.4 0-82.4-37-82.4-82.4S466.6 142 512 142c45.4 0 82.4 37 82.4 82.4s-37 82.4-82.4 82.4z m0-141.4c-32.6 0-59 26.4-59 59s26.4 59 59 59 59-26.4 59-59-26.4-59-59-59z" fill="#4C4372"></path><path d="M738 1012.2H286c-49.8 0-90.2-40.4-90.2-90.2V470c0-49.8 40.4-90.2 90.2-90.2h452c49.8 0 90.2 40.4 90.2 90.2v452c0 50-40.4 90.2-90.2 90.2z" fill="#D3E6F8"></path><path d="M740.6 380v632.2c48.6-1.4 87.6-41.2 87.6-90V470c0-48.8-39-88.6-87.6-90z" fill="#A4CFF2"></path><path d="M586 480.6l-208 208h104l-79.6 223L646 696.2h-112.2z" fill="#FD919E"></path><path d="M402.4 923.4c-2.2 0-4.6-0.6-6.6-2-4.4-3-6.2-8.6-4.4-13.6l74-207.4H378c-4.8 0-9-2.8-10.8-7.2-1.8-4.4-0.8-9.4 2.6-12.8l208-208c3.8-3.8 9.4-4.6 14-2 4.6 2.6 6.8 7.8 5.6 13l-48.8 201H646c4.8 0 9.2 3 11 7.6 1.8 4.6 0.4 9.8-3.2 13L410.2 920.4c-2.2 2-5 3-7.8 3z m3.8-246.4H482c3.8 0 7.4 1.8 9.6 5 2.2 3.2 2.8 7.2 1.4 10.6l-64.4 180.2 186.4-164.8h-81.2c-3.6 0-7-1.6-9.2-4.4-2.2-2.8-3-6.6-2.2-10l42.4-175-158.6 158.4z" fill="#4C4372"></path><path d="M738 1024H286c-56.2 0-101.8-45.6-101.8-101.8V470c0-56.2 45.6-101.8 101.8-101.8h452c56.2 0 101.8 45.6 101.8 101.8v452c0 56.4-45.6 102-101.8 102zM286 391.8c-43.2 0-78.4 35.2-78.4 78.4v452c0 43.2 35.2 78.4 78.4 78.4h452c43.2 0 78.4-35.2 78.4-78.4V470c0-43.2-35.2-78.4-78.4-78.4H286z" fill="#4C4372"></path></svg>
    </div>
    <MarQuee :text=daySentence :speed="0.7"/>

    <van-popover v-model:show="showPopover" :show-arrow=false placement="bottom-end" :offset="[12,8]"  :actions="actions" @select="onSelect">
      <template #reference>
      <el-avatar class="user-image" size="default" :src="photo.Avatar" @error="errorImage"   />
      <!-- <span class="dot"> </span> -->
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
  margin-top: 8px;
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
/* .dot {
  position: absolute;
  top: 25px;
  right: 22px;
  width: 0.55rem;
  height: 0.55rem; 
  border-radius: 50%;
  border: 2px solid;
  background-color: #4ade80;
} */
</style>
