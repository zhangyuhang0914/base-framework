// 菜单类型
export type TabsItemType = 'base_info' | 'business_place' | 'loan_demand'
export interface TabsItem {
  text: string
  type: TabsItemType
}
