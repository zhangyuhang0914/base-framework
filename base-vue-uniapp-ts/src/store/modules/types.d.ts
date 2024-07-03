import type { DictListItem } from '@/api/index/types'
import type { UiasUserInfoType, EntInfoType } from '@/api/common/types'
import type { ProductListItem } from '@/api/financeProduct/types'

export interface CommonType {
  token: string
  tabBar: TabBarType
  tabBarHeight: number
  dictData: DictDataItem
  uiasUserInfo: UiasUserInfoType
  entInfo: EntInfoType
  productContrastList: ProductListItem[]
}

interface TabBarType {
  selectName: string
  selectIndex: number
  showTabBar: boolean
  list: Array<TabBarListType>
}

interface TabBarListType {
  pagePath: string
  iconPath: string
  selectedIconPath: string
  text: string
}

interface DictDataItem {
  [key: string]: DictListItem[]
}
