<template lang="pug">
.c-footer-wrap
  .modules-container
    .header-box
      .left
      .label {{ '指导单位' }}
      .right
    .content
      .label {{ '中共湖北省委金融委员会办公室  ' }}
      .label {{ '中共湖北省委金融工作委员会' }}
      .label {{ '湖北省地方金融管理局' }}
  .modules-container
    .header-box
      .left
      .label {{ '运营单位' }}
      .right
    .content
      .label {{ '湖北省征信有限公司' }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CFooter',
  setup(props, context) {
    return {}
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
