/**
 * 字典信息
 */
export interface DictListItem {
  id: string
  isParent: boolean | null
  name: string
  pId: string | null
  value: string
}
