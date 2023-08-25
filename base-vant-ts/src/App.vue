<template lang="pug">
router-view(v-slot="{ Component }")
  component(:is="Component")
</template>
<script setup lang="ts">
import { onUnmounted } from 'vue'
import { showNotify } from 'vant'
import { userCommonStoreHook } from '@/stores/modules/common'
let noticyObj: any = null
const updateOnline = () => {
  const commonHook = userCommonStoreHook()
  const onlineState = !!navigator.onLine
  if (!onlineState) {
    noticyObj = showNotify({
      type: 'danger',
      message: '网络连接已断开',
      duration: 0
    })
  } else {
    noticyObj && noticyObj.closeNotify()
  }
  commonHook.setNetwork(onlineState)
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
