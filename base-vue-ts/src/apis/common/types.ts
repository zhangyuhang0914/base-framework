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

/**
 * 登录信息
 */
export interface LoginInfoType {
  /**
   * 过期时间
   */
  expire: string
  /**
   * token
   */
  token: string
  /**
   * 内部系统用户id
   */
  userId: string
  /**
   * 企业信息
   */
  enterpriseInfo: EnterpriseInfoType
}

/**
 * 企业信息
 */
export interface EnterpriseInfoType {
  /**
   * 企业名称
   */
  enterpriseName: string
  /**
   * 统一社会信用代码
   */
  uniscId: string
  /**
   * 所属行业
   */
  industry: string
  /**
   * 企业所在区县区划代码
   */
  areaCode: string
  /**
   * 企业标签
   */
  enterpriseLabel: string
  /**
   * 负面信息
   */
  negativeInformation: string
  /**
   * 企业法人
   */
  legalPersonName: string
  /**
   * 电话
   */
  phone: string
  /**
   * 联系人
   */
  contacts: string
  /**
   * 联系人电话
   */
  contactsPhone: string
  /**
   * 注册资本
   */
  registeredCapital: string
}
