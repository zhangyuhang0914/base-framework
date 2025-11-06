// 查询事项列表入参
export interface ItemInfosEhbParam {
  page: number
  limit: number
  sidx: string
  order: string
  param?: {
    itemName: string
  }
}

// 查询事项列表项
export interface ItemInfosEhbItem {
  ITEM_CODE: string
  ITEM_NAME: string
  NUM: number
  ROW_ID: number
}
