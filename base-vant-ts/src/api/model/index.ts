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

// 注册入参
export interface MicroEnterpriseRegisterParamType {
  // 企业名称
  enterpriseName: string
  // 统一社会信用代码
  uscc: string
  // 联系人
  contactPerson: string
  // 联系电话
  contactPhone: string
}

// 登录入参
export interface MicroEnterpriseLoginParamType {
  // 手机号
  phone: string
  // 验证码
  captcha: string
}

// 登录出参
export interface MicroEnterpriseLoginResultType {
  // token
  token: string
  // 有效期
  expire: number
  // 用户id
  userId: string
}

export interface EnterpriseInfoType {
  // 企业地址
  address?: string
  // 批准日期
  approvalDate?: string
  // 所在地区
  area?: string
  // 地区编码
  areaCode?: string
  // 经营范围
  businessScope?: string
  // 城市
  city?: string
  // 城市编码
  cityCode?: string
  // 联系人
  contacts: string
  // 联系人电话
  contactsPhone: string
  // 创建时间
  createdTime: string
  // 创建用户ID
  createdUserId?: string
  // 数据来源
  dataOrigin: string
  // 数据状态
  dataStatus: number
  // 金融平台ID
  finPlatformId?: string
  // 企业ID
  id: string
  // 所属行业
  industry: string
  // 法人名称
  legalPersonName: string
  // 企业名称
  name: string
  // 获取状态
  obtainStatus?: string
  // 营业期限开始日期
  operatingLimitDateBegin?: string
  // 营业期限结束日期
  operatingLimitDateEnd?: string
  // 营业期限类型
  operatingLimitType?: string
  // 电话
  phone: string
  // 省份
  province?: string
  // 省份编码
  provinceCode?: string
  // 注册资本
  registeredCapital?: string
  // 备注
  remark?: string
  // 入驻时间
  settlingTime?: string
  // 统一社会信用代码
  tyshxmdm?: string
  // 统一信用代码
  uniscId: string
  // 更新时间
  updatedTime: string
  // 更新用户ID
  updatedUserId?: string
}
