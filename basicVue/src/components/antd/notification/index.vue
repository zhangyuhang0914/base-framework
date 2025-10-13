<template>
  <div class="notification-provider">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, provide } from 'vue'
import { notification } from 'ant-design-vue'
import Notification, {
  createNotification,
  type NotificationContextType,
  type NotificationOptions,
  type NotificationType
} from './notification'

// 创建全局通知实例
const notificationInstance = createNotification()

/**
 * 注入全局通知实例的Hook
 */
export const useNotification = (): NotificationContextType => {
  return createNotification()
}

/**
 * 注入全局通知实例的Hook
 */
export const useGlobalNotification = (): NotificationContextType => {
  return notificationInstance
}

export default defineComponent({
  name: 'NotificationProvider',
  setup() {
    // 提供全局通知实例
    provide('notification', notificationInstance)

    // 全局配置
    const configureNotification = () => {
      notification.config({
        placement: 'topRight',
        top: '50px',
        duration: 4.5,
        rtl: false
      })
    }
    onMounted(() => {
      configureNotification()
    })
    return {}
  }
})

// 重新导出Notification类和类型
export {
  Notification,
  type NotificationContextType,
  type NotificationOptions,
  type NotificationType
}
</script>

<style scoped>
.notification-provider {
  width: 100%;
  height: 100%;
}
</style>
