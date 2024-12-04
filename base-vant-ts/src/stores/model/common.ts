import type { DictListItem } from '@/api/model/index'

export interface CommonType {
  onlineState: boolean // 网络状态
  cachedRoute: Array<string>
  dictData: DictDataItem
}

interface DictDataItem {
  [key: string]: DictListItem[]
}
