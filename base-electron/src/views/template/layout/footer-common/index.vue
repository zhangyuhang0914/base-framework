<template lang="pug">
.footer-box-wrap
  .footer-left
    span {{ '底部' }}
  .footer-right
    span {{ '底部' }}
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'FooterCommon',
  setup() {
    return {}
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
