/*
 * Global 状态相关类型定义
 */

import type { DictItem } from '@/api/interface/common'

// Global 状态接口
export interface GlobalState {
  // 缓存路由
  cachedRoute: Array<string>
  // 字典数据
  dictMap: DictDataItem
}

// 字典寄合数据
interface DictDataItem {
  [key: string]: DictItem[]
}
