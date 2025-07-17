import typewriter from '@/utils/components/Typewriter.vue'
import interest from '@/views/user/components/interest1.vue'
import { FloatButton } from 'vue-amazing-ui'
import socialLinks from '@/utils/components/SocialLinks.vue'
import ButtonAnimate from '@/utils/components/ButtonAnimate.vue'
import { areaList } from '@vant/area-data'
import { useCurrentUserStore } from '@/stores/user'
import { useOtherUserStore } from '@/stores/otherUser'
import SkeletonUtil from '@/utils/components/SkeletonUtil.vue'
import PostImage from '@/views/posts/components/PostImage.vue'
import PostPreview from '@/views/posts/components/PostPreview.vue'
import dayjs from 'dayjs'
import date from '@/utils/date.js'

export default {
  components: {
    typewriter,
    interest,
    FloatButton,
    socialLinks,
    ButtonAnimate,
    SkeletonUtil,
    PostImage,
    PostPreview
  },
  data() {
    return {
      isUserPage: true,
      activeInterest: 'movie',
      socialPlatformIcons: [
        { icon: 'mdi-github', link: 'https://www.github.com/leleo886' },
        { icon: 'mdi-email', link: 'mailto:leleo886@foxmail.com' },
        { icon: 'mdi-qqchat', link: 'https://im.qq.com/' },
        { icon: 'mdi-wechat', link: 'https://wx.qq.com/' },
        { icon: 'mdi-youtube', link: 'https://www.youtube.com' },
        { icon: 'mdi-facebook', link: 'https://www.facebook.com' }
      ],
      but: false,
      hamburgerActive: false,
      personalizedtags: ['乐观开朗', '温柔体贴', '善解人意'],
      user: {
        nickname: '山山水水',
        interest: {
          books: [
            {
              describe: '\u53f2\u8482\u592b\u00b7\u4e54\u5e03\u65af\u4f20',
              disabled: false,
              id: 15,
              related_id: 99,
              timestamp: 'Fri, 13 Jun 2025 12:26:13 GMT',
              type: '\u4e66\u7c4d',
              url: 'http://sxryiuhrz.hd-bkt.clouddn.com/user_image/user_99/interest/8fc817a5-7c5c-4760-84a7-cda88b843745.jpg-slim'
            }
          ],
          movies: [
            {
              describe: '\u82e6\u5c3d\u7518\u6765\u9047\u89c1\u4f60',
              disabled: false,
              id: 12,
              related_id: 99,
              timestamp: 'Fri, 13 Jun 2025 12:25:49 GMT',
              type: '\u7535\u5f71',
              url: 'src/asset/book/book1.webp'
            },
            {
              describe: '\u6211\u7684\u5927\u53d4',
              disabled: false,
              id: 13,
              related_id: 99,
              timestamp: 'Fri, 13 Jun 2025 12:25:49 GMT',
              type: '\u7535\u5f71',
              url: 'src/asset/book/book2.webp'
            },
            {
              describe: '\u9ed1\u8bdd\u5f8b\u5e08',
              disabled: false,
              id: 14,
              related_id: 99,
              timestamp: 'Fri, 13 Jun 2025 12:25:49 GMT',
              type: '\u7535\u5f71',
              url: 'src/asset/book/book3.webp'
            }
          ]
        }
      },
      posts: [
        {
          author: 'Blazing',
          body: '<p>\u5bcc\u6587\u672c\u7f16\u8f91\u56681</p>',
          body_html: '<p>\u5bcc\u6587\u672c\u7f16\u8f91\u56681</p>',
          comment_count: 0,
          has_praised: false,
          id: 115,
          image: 'http://sxryiuhrz.hd-bkt.clouddn.com//static/ico/image_6-CouPu7Rl.ico-slim',
          nick_name: null,
          pos: [],
          post_images: [],
          post_type: '\u7eaf\u6587\u5b57',
          praise_num: 0,
          timestamp: '2025-06-06 12:13:29',
          url: '/api/v1/posts/115'
        },
        {
          author: 'Blazing',
          body: '\u4eca\u5929\u662f2025-06-06 12:13:17',
          body_html: null,
          comment_count: 0,
          has_praised: false,
          id: 114,
          image: 'http://sxryiuhrz.hd-bkt.clouddn.com//static/ico/image_6-CouPu7Rl.ico-slim',
          nick_name: null,
          pos: [],
          post_images: [],
          post_type: '\u7eaf\u6587\u5b57',
          praise_num: 1,
          timestamp: '2025-06-06 12:13:21',
          url: '/api/v1/posts/114'
        },
        {
          author: '1234',
          body: '\u4e09\u4eba\u5403\u996d\uff5e',
          body_html: null,
          comment_count: 0,
          has_praised: false,
          id: 112,
          image:
            'http://sxryiuhrz.hd-bkt.clouddn.com/user_image/user_99/avatars/70664cee-83a8-4c1d-a304-b181365e957c.png-slim',
          nick_name: '\u8424\u706b',
          pos: [],
          post_images: [
            'http://sxryiuhrz.hd-bkt.clouddn.com/user_image/user_99/articles/8e61b556-b4b7-47c6-80b2-85328694b11a.jpg-slim'
          ],
          post_type: '\u56fe\u6587',
          praise_num: 0,
          timestamp: '2025-05-01 19:49:25',
          url: '/api/v1/posts/112'
        },
        {
          author: '1234',
          body: '\u671d\u971e\u7eda\u4e3d\u591a\u5f69',
          body_html: null,
          comment_count: 0,
          has_praised: false,
          id: 110,
          image:
            'http://sxryiuhrz.hd-bkt.clouddn.com/user_image/user_99/avatars/70664cee-83a8-4c1d-a304-b181365e957c.png-slim',
          nick_name: '\u8424\u706b',
          pos: [],
          post_images: [],
          post_type: '\u7eaf\u6587\u5b57',
          praise_num: 0,
          timestamp: '2025-02-18 14:04:14',
          url: '/api/v1/posts/110'
        },
        {
          author: '1234',
          body: '\u4eca\u5929\u591a\u4e91\u8f6c\u6674~',
          body_html: null,
          comment_count: 1,
          has_praised: false,
          id: 109,
          image:
            'http://sxryiuhrz.hd-bkt.clouddn.com/user_image/user_99/avatars/70664cee-83a8-4c1d-a304-b181365e957c.png-slim',
          nick_name: '\u8424\u706b',
          pos: [],
          post_images: [],
          post_type: '\u7eaf\u6587\u5b57',
          praise_num: 2,
          timestamp: '2025-02-12 09:20:23',
          url: '/api/v1/posts/109'
        },
        {
          author: '1234',
          body: '\u6211\u4e0a\u4f20\u4e86\u56fe\u50cf~',
          body_html: null,
          comment_count: 0,
          has_praised: false,
          id: 108,
          image:
            'http://sxryiuhrz.hd-bkt.clouddn.com/user_image/user_99/avatars/70664cee-83a8-4c1d-a304-b181365e957c.png-slim',
          nick_name: '\u8424\u706b',
          pos: [],
          post_images: [],
          post_type: '\u7eaf\u6587\u5b57',
          praise_num: 0,
          timestamp: '2025-01-21 12:28:15',
          url: '/api/v1/posts/108'
        },
        {
          author: '123',
          body: '21212',
          body_html: null,
          comment_count: 0,
          has_praised: false,
          id: 107,
          image:
            'http://sxryiuhrz.hd-bkt.clouddn.com/user_image/user_93/avatars/a5d0ecbb-a4c8-4bcb-96a1-faa7162c5151.png-slim',
          nick_name: '\u67d2\u590f',
          pos: [],
          post_images: [],
          post_type: '\u7eaf\u6587\u5b57',
          praise_num: 0,
          timestamp: '2025-01-17 15:26:37',
          url: '/api/v1/posts/107'
        },
        {
          author: '123',
          body: '\u5f53\u65f6\u7684',
          body_html: null,
          comment_count: 0,
          has_praised: false,
          id: 106,
          image:
            'http://sxryiuhrz.hd-bkt.clouddn.com/user_image/user_93/avatars/a5d0ecbb-a4c8-4bcb-96a1-faa7162c5151.png-slim',
          nick_name: '\u67d2\u590f',
          pos: [],
          post_images: [],
          post_type: '\u7eaf\u6587\u5b57',
          praise_num: 0,
          timestamp: '2025-01-17 15:20:21',
          url: '/api/v1/posts/106'
        },
        {
          author: '123',
          body: '3333',
          body_html: null,
          comment_count: 0,
          has_praised: false,
          id: 105,
          image:
            'http://sxryiuhrz.hd-bkt.clouddn.com/user_image/user_93/avatars/a5d0ecbb-a4c8-4bcb-96a1-faa7162c5151.png-slim',
          nick_name: '\u67d2\u590f',
          pos: [],
          post_images: [],
          post_type: '\u7eaf\u6587\u5b57',
          praise_num: 0,
          timestamp: '2025-01-17 15:13:44',
          url: '/api/v1/posts/105'
        },
        {
          author: '123',
          body: '3333',
          body_html: null,
          comment_count: 1,
          has_praised: false,
          id: 104,
          image:
            'http://sxryiuhrz.hd-bkt.clouddn.com/user_image/user_93/avatars/a5d0ecbb-a4c8-4bcb-96a1-faa7162c5151.png-slim',
          nick_name: '\u67d2\u590f',
          pos: [],
          post_images: [],
          post_type: '\u7eaf\u6587\u5b57',
          praise_num: 0,
          timestamp: '2025-01-17 15:11:32',
          url: '/api/v1/posts/104'
        }
      ],
      loading: {
        userData: false,
        follow: false,
        skeleton: true
      },
      skeletonThrottle: {
        leading: 300,
        trailing: 300,
        initVal: true
      }
    }
  },
  setup() {
    const currentUser = useCurrentUserStore()
    const otherUser = useOtherUserStore()
    return { currentUser, otherUser, areaList }
  },
  async mounted() {
    this.setMainProperty()
  },
  computed: {
    location() {
      if (this.user.location && !isNaN(this.user.location)) {
        return cityUtil.getCodeToName(this.user.location, this.areaList)
      }
      return ''
    },
    member_since() {
      return dayjs(this.user.member_since).format('YYYY-MM-DD')
    },
    from_now() {
      // 防止上线时间与当前时间过于接近而显示"几秒后"
      const time = dayjs(this.user.last_seen).subtract(5, 'second').format('YYYY-MM-DD HH:mm:ss')
      return date.dateShow(time)
    },
    isCurrentUser() {
      return this.user.username == this.currentUser.userInfo.username
    },
    follow() {
      return this.followPerm && this.currentUser.userInfo.username != this.user.username
    },
    isFollowCurrentUser() {
      return (
        this.currentUser.userInfo.username &&
        !this.isCurrentUser &&
        this.user.is_following_current_user
      )
    },
    isFollowEachOther() {
      return (
        this.currentUser.userInfo.username &&
        !this.isCurrentUser &&
        this.user.is_following_current_user &&
        this.user.is_followed_by_current_user
      )
    },
    isFollowOtherUser() {
      return (
        this.currentUser.userInfo.username &&
        !this.isCurrentUser &&
        this.user.is_followed_by_current_user
      )
    }
  },
  methods: {
    setMainProperty() {
      const root = document.documentElement
      root.style.setProperty('--leleo-background-image-url', `url('/src/asset/image.png')`)
    },
    // 每次点击tag触发动画
    playTagAnimation(e) {
      const el = e.currentTarget
      el.classList.remove('animate')
      // 强制重绘
      void el.offsetWidth
      el.classList.add('animate')
    },
    setActive(type) {
      this.activeInterest = type
    },
    handleSwitchChange() {
      const root = document.documentElement
      if (this.isUserPage) {
        root.style.setProperty('--leleo-background-image-url', `url('/src/asset/image.png')`)
      } else {
        root.style.setProperty('--leleo-background-image-url', `none`)
        // 新增：设置为白色
        root.style.setProperty('background-color', '#fff') 
      }
    }
  }
}
