/**
 * 鄂汇办JSSDK类型定义
 */

import type { EhbAppNotice } from '@/plugin/interface/notice'
import type { EhbAppDevice } from '@/plugin/interface/device'
import type { EhbAppNetwork } from '@/plugin/interface/network'
import type { EhbAppStorage } from '@/plugin/interface/storage'
import type { EhbAppMap } from '@/plugin/interface/map'
import type { EhbAppMedia } from '@/plugin/interface/media'
import type { EhbAppShare } from '@/plugin/interface/share'
import type { EhbAppOperateWindow } from '@/plugin/interface/operateWindow'
import type { EhbAppUser } from '@/plugin/interface/user'

// 鄂汇办JSSDK主接口
export interface EhbAppJssdk {
  // 通知相关组件和方法（包含选择器）
  notice: EhbAppNotice
  // 设备相关API
  device: EhbAppDevice
  // 网络相关API
  network: EhbAppNetwork
  // 存储相关API
  storage: EhbAppStorage
  // 位置相关API
  map: EhbAppMap
  // 媒体相关API
  media: EhbAppMedia
  // 分享相关API
  share: EhbAppShare
  // 窗口操作相关API
  operateWindow: EhbAppOperateWindow
  // 用户相关API
  user: EhbAppUser
}
