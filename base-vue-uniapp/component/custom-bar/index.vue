<template lang="pug">
.custom-bar(:style="{ height: customBarHeight + 'px' }" :class="showStick ? 'active-stick' : 'default-stick'")
  .custom-bar-status(:style="{ height: statusBarHeight + 'px' }")
  .custom-bar-header(:style="{ height: headerBarHeight + 'px' }")
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'
export default defineComponent({
  name: 'CustomBar',
  props: {
    custom: {
      type: Boolean,
      default: true
    },
    showBack: {
      type: Boolean,
      default: true
    },
    showStick: {
      type: Boolean,
      default: false
    }
  },
  setup (props, context) {
    const instance = getCurrentInstance()
    const globalProperties = instance.appContext.config.globalProperties
    const customBarHeight = globalProperties.customBarHeight
    const statusBarHeight = globalProperties.statusBarHeight
    const headerBarHeight = globalProperties.headerBarHeight
    // console.log('custom-bar', global)
    return {
      globalProperties,
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
