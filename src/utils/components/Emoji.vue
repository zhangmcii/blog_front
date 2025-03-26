<template>
  <div>
    <transition name="body">
      <div v-show="showEmoji" class="emoji-body">
        <span
          v-for="value in emojiListURL"
          :key="index"
        >
          <img loading="lazy" class="emoji" :src="value" :title="key" width="30" height="30" />
        </span>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props:{
    showEmoji: {
        type: Boolean,
        default: false
    }
  },
  data() {
    return {
      emojiListURL: [
        'https://emotion.acs.pw/emotion/Heo-100/亲亲.png',
        'https://emotion.acs.pw/emotion/Heo-100/再见.png',
        'https://emotion.acs.pw/emotion/Heo-100/加班.png',
        'https://emotion.acs.pw/emotion/Heo-100/发红包.png',
        'https://emotion.acs.pw/emotion/Heo-100/吃瓜.png',
        'https://emotion.acs.pw/emotion/Heo-100/吐血.png',
        'https://emotion.acs.pw/emotion/Heo-100/吵架.png',
        'https://emotion.acs.pw/emotion/Heo-100/呲牙笑.png',
        'https://emotion.acs.pw/emotion/Heo-100/哈士奇.png',
        'https://emotion.acs.pw/emotion/Heo-100/哭泣.png',
        'https://emotion.acs.pw/emotion/Heo-100/唱歌.png',
        'https://emotion.acs.pw/emotion/Heo-100/喜欢.png',
        'https://emotion.acs.pw/emotion/Heo-100/大笑.png',
        'https://emotion.acs.pw/emotion/Heo-100/头秃.png',
        'https://emotion.acs.pw/emotion/Heo-100/奋斗.png',
        'https://emotion.acs.pw/emotion/Heo-100/害羞.png',
        'https://emotion.acs.pw/emotion/Heo-100/尴尬.png',
        'https://emotion.acs.pw/emotion/Heo-100/开心.png',
        'https://emotion.acs.pw/emotion/Heo-100/微笑.png',
        'https://emotion.acs.pw/emotion/Heo-100/思考.png',
        'https://emotion.acs.pw/emotion/Heo-100/恶心.png',
        'https://emotion.acs.pw/emotion/Heo-100/惊吓.png',
        'https://emotion.acs.pw/emotion/Heo-100/惊讶.png',
        'https://emotion.acs.pw/emotion/Heo-100/感动.png',
        'https://emotion.acs.pw/emotion/Heo-100/愤怒.png',
        'https://emotion.acs.pw/emotion/Heo-100/我看好你.png',
        'https://emotion.acs.pw/emotion/Heo-100/抠鼻.png',
        'https://emotion.acs.pw/emotion/Heo-100/捂嘴笑.png',
        'https://emotion.acs.pw/emotion/Heo-100/捂脸.png',
        'https://emotion.acs.pw/emotion/Heo-100/擦汗.png',
        'https://emotion.acs.pw/emotion/Heo-100/滑稽.png',
        'https://emotion.acs.pw/emotion/Heo-100/烦恼.png',
        'https://emotion.acs.pw/emotion/Heo-100/熬夜.png',
        'https://emotion.acs.pw/emotion/Heo-100/爆炸.png',
        'https://emotion.acs.pw/emotion/Heo-100/牛年进宝.png',
        'https://emotion.acs.pw/emotion/Heo-100/狗头.png',
        'https://emotion.acs.pw/emotion/Heo-100/狗头围脖.png',
        'https://emotion.acs.pw/emotion/Heo-100/狗头胖次.png',
        'https://emotion.acs.pw/emotion/Heo-100/狗头花.png',
        'https://emotion.acs.pw/emotion/Heo-100/狗头草.png',
        'https://emotion.acs.pw/emotion/Heo-100/生病.png',
        'https://emotion.acs.pw/emotion/Heo-100/疑问.png',
        'https://emotion.acs.pw/emotion/Heo-100/眩晕.png',
        'https://emotion.acs.pw/emotion/Heo-100/睡觉.png',
        'https://emotion.acs.pw/emotion/Heo-100/禁言.png',
        'https://emotion.acs.pw/emotion/Heo-100/笑哭.png',
        'https://emotion.acs.pw/emotion/Heo-100/纠结.png',
        'https://emotion.acs.pw/emotion/Heo-100/绿帽.png',
        'https://emotion.acs.pw/emotion/Heo-100/耍酷.png',
        'https://emotion.acs.pw/emotion/Heo-100/被打.png',
        'https://emotion.acs.pw/emotion/Heo-100/送福.png',
        'https://emotion.acs.pw/emotion/Heo-100/阴险.png',
        'https://emotion.acs.pw/emotion/Heo-100/鬼脸.png',
        'https://emotion.acs.pw/emotion/Heo-100/鼓掌.png'
      ]
    }
  },
  methods: {}
}
</script>
<style scoped>
 .body-enter-active, .body-leave-active {
    transition: all 0.3s;
  }

  .body-enter, .body-leave-to {
    opacity: 0;
    transform: scale(0.5);
  }
</style>
