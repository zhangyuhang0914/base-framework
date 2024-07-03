<template lang="pug">
.custom-bar(v-if="showHeaderBar" :style="{ height: customBarHeight + 'px' }" :class="showTop ? 'active-stick' : 'default-stick'")
  .custom-bar-status(:style="{ height: statusBarHeight + 'px', background: statusBackground }")
  .custom-bar-header(:style="{ height: headerBarHeight + 'px', background: headerBackground }")
    .c-header-box
      u-icon.icon-jiantou-zuo(name="arrow-left" v-if="showBack" @click="handleGoBack")
      //- i.iconfont.icon-jiantou-zuo(v-if="showBack" @click="$emit('goBack')")
      .c-title {{ headerTitle }}
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'
import { goBack } from '@/common/common'

export default defineComponent({
  name: 'CustomBar',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  },
  props: {
    showHeaderBar: {
      type: Boolean,
      default: false
    },
    custom: {
      type: Boolean,
      default: true
    },
    showBack: {
      type: Boolean,
      default: false
    },
    showTop: {
      type: Boolean,
      default: false
    },
    showAvatar: {
      type: Boolean,
      default: false
    },
    headerTitle: {
      type: String,
      default: ''
    },
    statusBackground: {
      type: String,
      default: 'transparent'
    },
    headerBackground: {
      type: String,
      default: 'transparent'
    },
    goBack: {
      type: Function
    }
  },
  setup(props, context) {
    const instance = getCurrentInstance()
    const globalProperties = instance.appContext.config.globalProperties
    // 状态栏高度
    const customBarHeight = globalProperties.customBarHeight
    const statusBarHeight = globalProperties.statusBarHeight
    const headerBarHeight = globalProperties.headerBarHeight
    // console.log('custom-bar', global)
    const handleGoBack = () => {
      if (props.goBack) {
        props.goBack()
        return
      }
      goBack()
    }
    return {
      globalProperties,
      customBarHeight,
      statusBarHeight,
      headerBarHeight,
      handleGoBack
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
