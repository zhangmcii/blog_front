<template>
  <van-popover v-model:show="showPopover" placement="bottom-start">
    <template #default>
      <transition name="body">
        <div  class="emoji-body">
          <span
            v-for="(value, key, index) in emojiListURL"
            :key="index"
            @click="$emit('selectEmoji', key)"
          >
            <img loading="lazy" class="emoji" :src="value" :title="key" width="30" height="30" />
          </span>
        </div>
      </transition>
    </template>
    <template #reference>
      <el-button circle class="emoji-button">
        <template #icon>
          <div style="font-size: 24px">
            <EmojiIcon />
          </div>
        </template>
      </el-button>
    </template>
  </van-popover>
</template>
<script>
import emojiCfg from '@/config/emojiCfg.js'
import EmojiIcon from '@/asset/svg/emojiIcon.svg?component'
export default {
  props: {
  },
  components: {
    EmojiIcon
  },
  emits: ['selectEmoji'],
  data() {
    return {
      showPopover: false,
      emojiListURL: {}
    }
  },
  created() {
    this.emojiListURL = this.getEmojiList(emojiCfg.name)
  },
  methods: {
    getEmojiList(emojiList) {
      let emojiName
      let url
      let result = {}
      for (let i = 0; i < emojiList.length; i++) {
        emojiName = '[emotion:' + emojiList[i] + ']'
        url = emojiCfg.baseUrl + emojiList[i] + emojiCfg.suffix
        result[emojiName] = url
      }
      console.log('11', result)
      return result
    }
  }
}
</script>
<style scoped>
.emoji-body {
  max-width: 400px;
}
.body-enter-active,
.body-leave-active {
  transition: all 0.3s;
}

.body-enter,
.body-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.emoji-button {
  margin-top: 2px;
  border: none;
  padding: 0px;
  transition: all 0.5s;
}
.emoji-button:hover {
  background-color: transparent;
  transform: scale(1.2);
}
</style>
