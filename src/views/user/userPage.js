import typewriter from '@/utils/components/Typewriter.vue'
import interest from '@/views/user/components/interest1.vue'
import { FloatButton } from 'vue-amazing-ui'
import socialLinks from '@/utils/components/SocialLinks.vue'
import ButtonAnimate from '@/utils/components/ButtonAnimate.vue'
export default {
  components: {
    typewriter,
    interest,
    FloatButton,
    socialLinks,
    ButtonAnimate
  },
  data() {
    return {
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
      personalizedtags: [
        '乐观开朗',
        '温柔体贴',
        '随和亲切',
        '冷静沉着',
        '才思敏捷',
        '风趣幽默',
        '刚正不阿',
        '善解人意'
      ],
      user: {
        nickname: '111',
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
      }
    }
  },
  async mounted() {
    this.setMainProperty()
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
    }
  }
}
