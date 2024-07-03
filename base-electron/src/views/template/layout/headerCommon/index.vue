<template lang="pug">
.header-box-wrap
  HelloWorld(msg="Vite + Vue")
  el-button(type="primary") {{ '按钮' }}
  span {{ `${text}：${week}` }}
</template>

<script>
import { ref } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'
export default {
  name: 'HeaderCommon',
  components: { HelloWorld },
  setup() {
    const text = ref('头部')
    const week = ref('今天周五')
    return {
      text,
      week
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
