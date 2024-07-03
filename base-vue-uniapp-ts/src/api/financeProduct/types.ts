/**
 * 参数：收藏接口
 */
export interface CollectionParamsType {
  collectionType?: string | number
  finProductInfoId?: string
  informationId?: string
  regulationsId?: string
}

/**
 * 产品信息列表
 */
export interface ProductListItem {
  /**
   * 机构头像
   */
  logoUrl?: string | null
  /**
   * 贷款额度
   */
  loanLimit?: string
  /**
   * 利率
   */
  rateRange?: string
  /**
   * 贷款期限
   */
  loanPeriod?: string
  /**
   * 收藏
   */
  isCollect?: boolean
  /**
   * 公司来源
   */
  companySource?: string
  /**
   * 产品来源
   */
  productSource?: string
  applyDesc: string
  applyUrl: string
  approvalMode: string
  cases: string
  characteristics: string
  cityCode: string | number
  code: string
  createdTime: string
  createdUserId: string
  customerDesc: string
  dataStatus: number
  dockingFlag: number
  entryCriteria: string
  finInstitutionsInfoId: string
  finPlatformId: string | number
  guaranteeMode: number
  guaranteeModeExtra: string
  id: string
  institutionsName: string
  institutionsUniscId: string | number
  isConfig: string
  isMobile: string | boolean
  loanLimitBegin: string
  loanLimitEnd: number
  loanPeriodBegin: number
  loanPeriodEnd: number
  logoFileId: string
  name: string
  pageView: string
  platformId: string | number
  policyProd: string
  productDesc: string
  productExtendId: string | number
  productMainType: string | number
  productType: string | number
  rateRangeBegin: number
  rateRangeEnd: number
  releasedTime: string
  remark: string
  repayments: string
  serviceCities: string
  shortName: string
  skipUrl: string
  smartDocking: string
  targetEnt: string
  updatedTime: string
  updatedUserId: string
  useDesc: string
  useStatus: string | number
  whetherCollection: string
}

/**
 * 银行机构列表
 */
export interface BankListItem {
  bankFullName: string
  bankName: string
  code: string
  createdTime: string
  createdUserId: null
  dataStatus: number
  id: string
  institutionNum: number
  intro: string
  logoFileId: string
  productNum: number
  remark: string | null
  sortNum: number
  uniscId: string
  updatedTime: string
  updatedUserId: string | null
  logoUrl?: string
}

/**
 * 所在区域列表
 */
export interface AreaInListItem {
  code: string
  id: string
  name: string
  url: string
}
