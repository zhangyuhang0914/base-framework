/**
 * 附件信息
 */
export interface AttachmentInfo {
  createDate: string
  fileInfo: string
  id: string
  json: null
  url: null
}

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
