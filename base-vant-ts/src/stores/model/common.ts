import type { DictListItem, EnterpriseInfoType } from '@/api/model/index'

export interface CommonType {
  // 网络状态
  onlineState: boolean
  // 缓存路由
  cachedRoute: Array<string>
  // token
  token: string
  // 用户id
  userId: string
  // 企业信息
  enterpriseInfo: EnterpriseInfoType
  // 字典数据
  dictData: DictDataItem
}

interface DictDataItem {
  [key: string]: DictListItem[]
}
