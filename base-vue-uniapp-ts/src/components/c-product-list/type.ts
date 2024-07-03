export interface PageItem {
  currentPage: number
  pageSize: number
  totalPage: number
}

export interface ProductQueryParams {
  /**
   * 贷款金额
   */
  dkje: Array<string>
  /**
   * 贷款期限
   */
  dkqx: Array<string>
  /**
   * 担保方式
   */
  guaranteeMode: Array<string>
  /**
   * 金融机构
   */
  bankId: Array<string>
  /**
   * 所在区域
   */
  cityCode: Array<string>
  /**
   * 产品类型
   */
  productMainType: Array<string>
}
