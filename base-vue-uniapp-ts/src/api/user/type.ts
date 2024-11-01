// cell单元格
import type { EntInfoType } from '@/api/common/types'

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

/**
 * 用户信息
 */
export interface IuserInfo {
  /**
   * 绑定企业信息列表
   */
  entList?: EntInfoType[]
  /**
   * 企业名称
   */
  entName?: string
  /**
   * 当前绑定企业userid
   */
  entUserId?: string
  /**
   * 申请融资数量
   */
  financingNeedsNum?: number
  /**
   * 成功融资数量
   */
  loanNum?: number
  /**
   * 登录用户手机号码
   */
  mobilePhone?: string
  /**
   * 登录用户头像图片id
   */
  userTxId?: string
}

/**
 * 融资记录列表
 */
export interface FinancingRecordListItem {
  // 受理状态
  acceptStatus: string
  // 选择银行FOC（具体含义需根据业务理解）
  chosenBankFoc: string
  // 选择银行名称
  chosenBankName: string
  // 代码
  code: string
  // 创建时间
  createdTime: string
  // 创建用户ID
  createdUserId: string
  // 信用代码
  creditCode: string
  // 信用评估状态
  creditEvalStatus: string
  // 信用文件ID
  creditFileId: string
  // 数据状态
  dataStatus: number
  // 需求来源
  demandSource: string
  // 企业名称
  entName: string
  // 融资信贷查询ID
  finCreditInquiryId: string
  // 融资企业信息ID
  finEnterprisesInfoId: string
  // 融资机构统一社会信用代码
  finInstitutionsUniscId: string
  // 融资贷款机构信息ID
  finLoanInstitutionsInfoId: string
  // 融资产品
  finProduct: string
  // 融资产品信息ID
  finProductInfoId: string
  // 融资类型
  financeType: string
  // 融资需求金额
  financingNeedsAmount: string
  // 担保方式
  guaranteeMode: string
  // ID
  id: string
  // 查询代码
  inquiryCode: string
  // 机构
  institution: string
  // 执照ID
  licenseId: string
  // 关联代码
  linkCode: string
  // 联系人姓名
  linkManName: string
  // 联系人电话
  linkManNamePhone: string
  // 贷款额度开始
  loanLimitBegin: number
  // 贷款额度结束
  loanLimitEnd: number
  // 贷款期限开始
  loanPeriodBegin: number
  // 贷款期限结束
  loanPeriodEnd: number
  // 贷款利率
  loanRate: number
  // 贷款状态
  loanStatus: number
  // 平台ID
  platformId: string
  // 产品描述
  productDesc: string
  // 产品名称
  productName: string
  // 利率范围开始
  rateRangeBegin: number
  // 利率范围结束
  rateRangeEnd: number
  // 备注
  remark: string
  // 还款方式
  repaymentWays: string
  // 回复状态
  replyStatus: string
  // 资源
  resource: string
  // 流水号
  serialNo: string
  // 状态
  state: string
  // 提交日期时间
  submitDateTime: string
  // 统一社会信用代码
  uniscId: string
  // 更新时间
  updatedTime: string
  // 更新用户ID
  updatedUserId: string
  // 更新用户名称
  updateUserName?: string
  // 状态显示文字
  status_text?: string
  // 手机号格式化
  showPhone?: string
  // 内部认证用户ID
  tbUserId: string
}

/**
 * 供应链金融需求列表
 */
export interface SupplyChainListItem {
  // 供应链编号
  code: string
  // 联系人
  contacts: string
  // 内容
  content: string
  // 创建时间
  createdTime: string
  // 创建类型
  createdType: string
  // 创建用户ID
  createdUserId: string
  // 数据状态
  dataStatus: string
  // 需求来源
  demandSource: string
  // 对接状态
  dockingState: string
  // ID
  id: string
  // 机构信息ID
  institutionsInfoId: string
  // 机构信息名称
  institutionsInfoName: string
  // 贷款金额
  loanAmount: string
  // 管理员姓名
  managerName: string
  // 管理员电话
  managerPhone: string
  // 名称
  name: string
  // 电话
  phone: string
  // 产品ID
  productId: string
  // 产品名称
  productName: string
  // 备注
  remark: string
  // 状态
  state: string
  // 统一社会信用代码
  uniscId: string
  // 更新时间
  updatedTime: string
  // 更新用户ID
  updatedUserId: string
  // 对接状态显示文字
  status_text: string
  // 手机号格式化
  showPhone?: string
  showManagerPhone?: string
  // 内部认证用户ID
  tbUserId: string
}
