<template>
  <div class="notification-provider">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { notification } from 'ant-design-vue'

// 配置全局通知
const configureNotification = () => {
  notification.config({
    placement: 'topRight',
    top: '50px',
    duration: 4.5,
    rtl: false,
  })
}

// 组件挂载时配置通知
onMounted(() => {
  configureNotification()
})

// 组件卸载时清理
onUnmounted(() => {
  notification.destroy()
})
</script>

<style scoped>
.notification-provider {
  width: 100%;
  height: 100%;
}
</style>