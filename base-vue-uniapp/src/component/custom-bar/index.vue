<template lang="pug">
.custom-bar(:style="{ height: customBarHeight + 'px' }")
  .custom-bar-status(:style="{ height: statusBarHeight + 'px' }")
  .custom-bar-header(:style="{ height: headerBarHeight + 'px' }")
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'
export default defineComponent({
  name: 'custom-bar',
  props: {
    custom: {
      type: Boolean,
      default: true
    },
    showBack: {
      type: Boolean,
      default: true
    }
  },
  setup (props, context) {
    const { appContext } = getCurrentInstance()
    const global = appContext.config.globalProperties
    const customBarHeight = global.customBarHeight
    const statusBarHeight = global.statusBarHeight
    const headerBarHeight = global.headerBarHeight
    // console.log('custom-bar', global)
    return {
      global,
      customBarHeight,
      statusBarHeight,
      headerBarHeight
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
