<template lang="pug">
router-view(v-slot="{ Component }")
  component(:is="Component" :key="route.path")
</template>

<script setup lang="ts">
import { storageLocal } from '@/utils/storage'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'
import { userCommonStoreHook } from '@/stores/modules/common'
useI18n().locale.value = storageLocal.getItem('responsive-locale')?.locale ?? 'zh_CN'
const commonHook = userCommonStoreHook()
const route = useRouter()
const updateOnline = () => {
  const onlineState = !!navigator.onLine
  commonHook.setOnlineState(onlineState)
}
onMounted(() => {
  // 监听网络变化
  window.addEventListener('online', updateOnline)
  window.addEventListener('offline', updateOnline)
})
onUnmounted(() => {
  window.removeEventListener('online', updateOnline)
  window.removeEventListener('offline', updateOnline)
})
</script>
<style lang="stylus">
@import './assets/css/app.styl'
</style>
