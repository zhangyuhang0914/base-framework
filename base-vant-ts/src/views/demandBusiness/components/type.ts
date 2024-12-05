// 菜单类型
export type TabsItemType = 'base_info' | 'business_place' | 'loan_demand'
export interface TabsItem {
  index: number
  text: string
  type: TabsItemType
}
