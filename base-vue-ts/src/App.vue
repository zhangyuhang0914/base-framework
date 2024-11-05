<template lang="pug">
router-view(v-slot="{ Component }")
  component(:is="Component" :key="route.path")
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, onUnmounted } from 'vue'
import { userCommonStoreHook } from '@/stores/modules/common'
const commonHook = userCommonStoreHook()
// 禁用拖拽
const firbitFn = (e: any) => {
  e.preventDefault()
}
document.addEventListener('drop', firbitFn, false)
document.addEventListener('dragover', firbitFn, false)
// 修改网络变化
const updateOnline = () => {
  const onlineState = !!navigator.onLine
  commonHook.setOnlineState(onlineState)
}
onMounted(() => {
  // 监听网络变化
  window.addEventListener('online', updateOnline)
  window.addEventListener('offline', updateOnline)
})
onBeforeUnmount(() => {
  document.removeEventListener('drop', firbitFn, false)
  document.removeEventListener('dragover', firbitFn, false)
})
onUnmounted(() => {
  window.removeEventListener('online', updateOnline)
  window.removeEventListener('offline', updateOnline)
})
</script>
<style lang="stylus">
@import './assets/css/app.styl'
</style>
