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
  primaryColor: '#4C5F99',
  buttonDefaultBackground: 'linear-gradient(180deg, #FFFFFF, #EAEEFA)', // default按钮背景
  buttonDefaultBorderColor: '#EAEEFA', // default按钮边框
  buttonPrimaryBackground: '#4C5F99', // primary按钮背景
  buttonPrimaryBorderColor: '#4C5F99', // primary按钮边框
  cellBorderColor: '#DADDE7', // 输入框下边框
  pickerConfirmActionColor: '#4C5F99', // picker选择器确认操作
  pickerActionFontSize: '14px', // picker选择器操作按钮字体大小
  radioSize: '18px', // radio单选框大小
  radioDotSize: '6px', // radio单选框圆点到边界的距离
  radioCheckedIconColor: '#4C5F99', // radio单选框选中图标颜色
  cascaderTabColor: '#4C5F99' // 级联选择器标签颜色
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
