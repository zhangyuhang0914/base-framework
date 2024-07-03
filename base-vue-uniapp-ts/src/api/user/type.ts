// cell单元格
export interface CellItem {
  title: string
  name: string
  icon: string
  value?: string
  pageUrl: string
  needLogin: boolean
  needAuthentication: boolean
  isLink: boolean
}

export interface PageItem {
  currentPage: number
  pageSize: number
  totalPage: number
}

/**
 * 确认授权对象
 */
export interface ConfirmData {
  /**
   * 企业名称
   */
  entName: string
  /**
   * 统一社会信用代码
   */
  uniscId: string
  /**
   * 企业法人
   */
  legalName?: string
  /**
   * 注册并绑定企业信息-联系人姓名
   */
  agentName?: string
}
