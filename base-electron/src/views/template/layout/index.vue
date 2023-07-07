<template lang="pug">
.layout-wrap
  el-button(type="primary") {{ '按钮' }}
  span {{ conText }}
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'layout',
  setup() {
    const conText = ref('今天周五')
    return {
      conText
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
