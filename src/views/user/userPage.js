
import typewriter from '@/utils/components/Typewriter.vue';
export default {
  components:{
    typewriter,
  },
  data() {
    return {
      personalizedtags: [
        '乐观开朗',
        '温柔体贴',
        '随和亲切',
        '冷静沉着',
        '才思敏捷',
        '风趣幽默',
        '刚正不阿',
        '善解人意'
      ]
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
    }
  }
}
