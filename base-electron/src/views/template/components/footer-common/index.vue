<template lang="pug">
.footer-box-wrap
  .footer-left
    .item-info.after-box
      .current-location
        .label {{ '当前位置：' }}
        .value {{ '襄阳市' }}
      .toggle {{ '切换' }}
    .item-info
      .label {{ '终端编号：' }}
      .value {{ 'XYJT010' }}
  .footer-right
    img(:src="`${BASE_URL}images/common/footer-help.png`")
    span {{ '使用帮助' }}
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'FooterCommon',
  setup() {
    const BASE_URL = import.meta.env.BASE_URL
    return {
      BASE_URL
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
