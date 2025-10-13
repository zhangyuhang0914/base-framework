/**
 * @Author       : 超人
 * @Description  : Ant Design 组件导出
 * @Date         : 2025-01-27
 * @LastEditTime : 2025-01-27
 */

// 导出通知组件及其工具
import NotificationProvider, {
  Notification,
  useNotification,
  useGlobalNotification,
  type NotificationContextType,
  type NotificationOptions,
  type NotificationType
} from './notification/index.vue'
export {
  NotificationProvider,
  Notification,
  useNotification,
  useGlobalNotification,
  type NotificationContextType,
  type NotificationOptions,
  type NotificationType
}

// 导出抽屉组件
import Drawer, { type DrawerExtendedProps } from './drawer/index.vue'
export { Drawer, type DrawerExtendedProps }
