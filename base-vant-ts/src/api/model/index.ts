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
  phone: string
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
