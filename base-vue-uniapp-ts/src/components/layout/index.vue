<template lang="pug">
.layout-wrap
  CustomHeaderBar(
    :showHeaderBar.sync="showHeaderBar"
    :statusBackground="statusBackground"
    :headerBackground="headerBackground"
    :headerColor="headerColor"
    :showBack="showBack"
    :headerTitle="headerTitle"
    :goBack="goBack"
  )
  .container-main(:style="{ height: mainHeight }")
    slot(name='main')
  CustomTabBar(:showTabBar.sync="showTabBar")
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, computed } from 'vue'
import CustomHeaderBar from '@/components/custom-header-bar/index.vue'
import CustomTabBar from '@/components/custom-tab-bar/index.vue'
import { userCommonStoreHook } from '@/store/modules/common'

export default defineComponent({
  name: 'Layout',
  components: { CustomHeaderBar, CustomTabBar },
  props: {
    showHeaderBar: {
      type: Boolean,
      default: false
    },
    showTabBar: {
      type: Boolean,
      default: false
    },
    statusBackground: {
      type: String,
      default: 'transparent'
    },
    headerBackground: {
      type: String,
      default: 'transparent'
    },
    headerColor: {
      type: String,
      default: '#333'
    },
    showBack: {
      type: Boolean,
      default: false
    },
    headerTitle: {
      type: String,
      default: ''
    },
    goBack: {
      type: Function
    }
  },
  setup(props, context) {
    const instance = getCurrentInstance()
    const globalProperties = instance?.appContext.config.globalProperties
    const commonHook = userCommonStoreHook()
    // 状态栏高度
    const customBarHeight = globalProperties?.customBarHeight
    // 底部tabbar高度
    // 注意：不使用rpx，原因：rpx在style行内样式中，在css编译时自动转换成px，导致计算有偏差
    const customTabBarHeight = computed(() => {
      return `${commonHook.tabBarHeight || 95}px`
    })
    // 计算内容高度
    const mainHeight = computed(() => {
      const topHeight = props.showHeaderBar ? `calc(100% - ${customBarHeight}px)` : '100%'
      const bottomHeight = props.showTabBar ? `calc(${topHeight} - ${customTabBarHeight.value})` : topHeight
      return bottomHeight
    })
    return {
      mainHeight
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
