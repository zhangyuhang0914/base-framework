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
   * 统一认证用户ID
   */
  userId: string
  /**
   * 内部认证用户ID
   */
  tbUserId: string
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
  finEnterprisesInfoId: string
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

/**
 * 人脸识别认证-个人实名
 */
export interface IindividualFace {
  /**
   * 获取个人刷脸实名认证短链接
   */
  authUrl: string
  /**
   * 链接失效时间,毫秒值
   */
  expire: string
  /**
   * 微信小程序刷脸使用
   */
  faceToken: string
  /**
   * 实名认证流程Id
   */
  flowId: string
  /**
   * 获取个人刷脸实名认证长链接
   */
  originalUrl: string
}

/**
 * 人脸识别认证-识别结果
 */
export interface IfaceCheck {
  /**
   * 刷脸结果，具体状态：
   * ING：刷脸进行中
   * SUCCESS：认证成功
   * SCAN：已扫描
   * FAIL：认证失败
   */
  status: string
  /**
   * 刷脸结果信息
   */
  message: string
}

/**
 * 授权协议
 */
export interface ContractDataType {
  // 合同ID
  contractId: string
  // 合同文件ID
  documentId: string
  // 签署令牌
  token: string
  // 下载合同文件ID
  contractFileId: string
  // 合同文件名称
  contractFileName: string
}

/**
 * 发起电子签章
 */
export interface ContractDraftParamType {
  // 公司名称
  entName: string
  // 用户手机号
  mobile: string
  // 模板文件文件ID
  fileId: string
}

/**
 * 发起电子签章
 */
export interface ContractDraftResultType {
  // 合同ID
  contractId: string
  // 文件ID
  documentId: string
}

/**
 * 获取合同签署令牌
 */
export interface ContractTicketParamType {
  // 合同ID
  contractId: string
  // 用户手机号
  mobile: string
}

/**
 * 下载合同
 */
export interface ContractDownloadType {
  // 文件ID
  documentId: string
}

/**
 * 下载合同
 */
export interface contractDownloadResultType {
  // 文件ID
  fileId: string
  // 文件名称
  fileName: string
}

/**
 * 产品申请短信模板发送
 */

export interface SmsProductTemplateParamsType {
  // 企业名称
  entName: string
  // 产品名称
  productName: string
  // 操作人
  name: string
  // 手机号
  phone: string
}
