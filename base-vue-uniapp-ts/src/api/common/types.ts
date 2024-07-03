/**
 * 自然人账号密码登录
 */
export interface UiasAccountLoginParam {
  /**
   * 用户名
   */
  userName: string
  /**
   * 自然人登录
   */
  type: number
  /**
   * 密码
   */
  password: string
}

/**
 * 自然人手机验证登录
 */
export interface UiasPhoneLoginParam {
  mobilePhone: string
  verifyCode: string
}

/**
 * 自然人注册参数
 */
export interface UiasRegisterParam {
  mobilePhone: string
  password: string
  name: string
  idCard: string
  vericode: string
  certEffDate: string
  idValidityPeriod: string
}

/**
 * 用户信息
 */
export interface UiasUserInfoType {
  /**
   * 证书有效日期
   */
  certEffDate: string
  /**
   * 创建时间
   */
  createdTime: string
  dataStatus: number
  /**
   * 用户上次登录企业ID
   */
  entId: string
  id: string
  /**
   * 证件号
   */
  idCard: string
  /**
   * 证件类型
   */
  idType: string
  /**
   * 身份证有效期
   */
  idValidityPeriod: string
  /**
   * 更新时间
   */
  loginTime: string
  /**
   * 是否第一次登录 第一次：0（需要弹窗） 其他：1
   */
  loginType: string
  /**
   * 手机号
   */
  mobilePhone: string
  /**
   * 姓名
   */
  name: string
  password: string
  regTime: string
  token: string
  updatedTime: string
  /**
   * 用户注册ID
   */
  userId: string
  /**
   * 用户头像id
   */
  userTxId: string
}

/**
 * 企业信息
 */
export interface EntInfoType {
  /**
   * 唯一标识
   */
  id: string
  /**
   * 创建时间
   */
  createdTime: string
  /**
   * 状态  0: 有效  1: 无效
   */
  dataStatus: string | number
  /**
   * 企业类型
   */
  entType: string
  /**
   * 企业名称
   */
  entName: string
  /**
   * 企业统一信用代码
   */
  entUnitCode: string
  /**
   * 法定代表人姓名
   */
  legalName: string
  /**
   * 证件类型
   */
  cardType: string
  /**
   * 法定代表人证件号码
   */
  legalCard: string
  /**
   * 密码
   */
  password: null
  /**
   * 经办人姓名
   */
  agentName: string
  /**
   * 经办人身份证号
   */
  agentCard: string
  /**
   * 经办人联系电话
   */
  agentMobile: string
  /**
   * 统一认证平台企业信息ID
   */
  userId: string
  /**
   * 盖章授权协议文件ID
   */
  fileId: string
  /**
   * 授权协议ID
   */
  licenseId: string
  licenseIdGj: string
  /**
   * 更新时间
   */
  updatedTime: null
  /**
   * 信用授权截止日期
   */
  authorizedEndTime: null
}

/**
 * 附件信息
 */
export interface AttachmentItem {
  /**
   * 附件id
   */
  id: string
  /**
   * 附件名称
   */
  fileOriginalName: string
  /**
   * 附件后缀
   */
  fileExtSuffix: string
}
