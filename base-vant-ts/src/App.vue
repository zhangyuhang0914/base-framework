<template lang="pug">
router-view(v-slot="{ Component }")
  component(:is="Component")
</template>
<script setup lang="ts">
import { onUnmounted } from 'vue'
import { userCommonStoreHook } from '@/stores/modules/common'
import { $notify } from './plugins/vant'
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
