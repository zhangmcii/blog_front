<script>
import ComNew from '@/views/comment/ComNew.vue'
export default {
  props: {
    postId: {
      type: Number,
      default() {
        return 1
      }
    }
  },
  components: {
    ComNew
  },
  data() {
    return {}
  },
  mounted() {}
}
</script>

<template>
  <ComNew :postId="postId" />
</template>
<style scoped></style>
