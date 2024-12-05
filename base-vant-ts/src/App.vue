<template lang="pug">
vanConfigProvider(:theme-vars="themeVars" heme-vars-scope="global")
  router-view(v-slot="{ Component }")
    component(:is="Component")
</template>
<script setup lang="ts">
import { onUnmounted, reactive } from 'vue'
import { userCommonStoreHook } from '@/stores/modules/common'
import { $notify } from './plugins/vant'
import type { ConfigProviderThemeVars } from 'vant'
/**
 * 初始化主题样式
 * 基础变量只能通过 `root 选择器` 修改，不能通过 `ConfigProvider 组件` 修改。
 * 组件变量可以通过 `root 选择器` 和 `ConfigProvider 组件` 修改。
 */
const themeVars: ConfigProviderThemeVars = reactive({
  rateIconFullColor: '#4C5F99',
  sliderBarHeight: '4px',
  sliderButtonWidth: '20px',
  sliderButtonHeight: '20px',
  sliderActiveBackground: '#4C5F99',
  buttonPrimaryBackground: '#4C5F99',
  buttonPrimaryBorderColor: '#4C5F99'
})
// 初始化网络状态
const updateOnline = () => {
  const commonHook = userCommonStoreHook()
  const onlineState = !!navigator.onLine
  const notify = $notify()
  if (!onlineState) {
    notify.showNotification('网络连接已断开', { duration: 0 })
  } else {
    notify && notify.closeNotification()
  }
  commonHook.setOnlineState(onlineState)
}
// 监听网络变化
window.addEventListener('online', updateOnline)
window.addEventListener('offline', updateOnline)
onUnmounted(() => {
  window.removeEventListener('online', updateOnline)
  window.removeEventListener('offline', updateOnline)
})
</script>

<style lang="stylus">
@import './assets/css/app.styl'
</style>
