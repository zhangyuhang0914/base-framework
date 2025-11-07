// 字典数据
export interface DictItem {
  // 创建时间
  createTime: string
  // 删除标志
  deleteFlag: boolean
  // 字典编码
  dictcode: string
  dictionaryId: string
  dictionaryValues: string
  // 唯一标识 id
  id: string
  ordernum: number
  pid: string
  // 描述
  remarks: string
}

// 查询事项、部门及区划请求参数
export interface Base64AreaCodeParams {
  // 事项base64编码
  transactNameBase64: string
  // 湖北省区划编码
  regionCode: string
  // 1：app
  source: '1'
  // 0不可网办，1可网办 ，不传或传""查办事指南
  isOnline: '' | '0' | '1'
}

// 查询事项、部门及区划返回参数
export interface Base64AreaCodeResponse {
  // 状态码，如 1 表示成功
  code: number
  // 返回的数据内容，包含 areaList、itemList 等
  data: Base64AreaCodeResponseData
  // 提示信息，如 "执行成功"
  msg: string
}

// 查询事项、部门及区划的 API 返回数据中的 data 部分
export interface Base64AreaCodeResponseData {
  // 区划集合
  areaList: AreaItem[]
  // 事项集合
  itemList: MatterItem[]
  // 区划编码
  code: string
  // 区划名称
  name: string
  // 区划编码短码
  shortCode: string
  // 区划等级
  grade: string
  // 区划父类编码
  parentCode: string
  // 是否可办标识：0 本级不可办下级也不可办，1 本级可办，2 本级不可办下级可办
  show: string
}

// 区划集合
export interface AreaItem {
  // 区划编码
  code: string
  // 区划名称
  name: string
  // 区划编码短码
  shortCode: string
  // 区划等级
  grade: string
  // 区划父类编码
  parentCode: string
  // 0本级不可办下级也不可办，1本级可办，2本级不可办下级可办
  show: string
  children: AreaItem[]
}

// 事项集合
export interface MatterItem {
  // 唯一标识 id
  id: string
  // 实施清单编码
  taskCode: string
  // 实施清单名称
  taskName: string
  // 业务办理项编码
  transactCode: string
  // 业务办理项名称
  transactName: string
  // 实施清单名称 - 业务办理项名称（组合显示用）
  taskNameTransactName: string
  // 业务办理项名称的 base64 编码
  transactNameBase64: string
  // 办理序号，如 "01"
  transactOrder: string
  // 排序字段，如 "0" 待确认，"1" 已确认
  sortOrder: string
  // 目录 id
  transactId: string
  // 部门编码
  orgCode: string
  // 部门名称
  orgName: string
  // 部门简称
  shortOrgName: string
  // 区划编码
  regionCode: string
  // 区划名称
  regionName: string
  // 区划等级
  regionGrade: string
  // 是否可网上办理：1 是，0 否
  isOnline: string
  // 是否 app 网上办理：1 是，0 否
  isAppOnline: string
  // 办理次数
  handlingTimes: string
  // 是否支持网上支付：1 是，0 否
  isPayOnline: string
  // 是否支持网上预约办理：1 是，0 否
  isSchedule: string
  // 是否支持自助终端办理：1 是，0 否
  isServiceTerminals: string
  // 是否支持移动端办理：1 是，0 否
  isMobileTerminal: string
  // 是否收费：1 是，0 否
  isFee: string
  // 是否服务个人：1 是，0 否
  serviceGr: string
  // 是否服务法人：1 是，0 否
  serviceFr: string
  // 行使层级，如 "5" 代表区级
  grade: string
  // 个人主题 ID 集合，如 "010"
  subjectIdsGr: string
  // 法人主题 ID 集合，可能为 null
  subjectIdsFr: string | null
  // 事项类型，如 "20"
  taskType: string
  // 实施清单创建时间，如 "2022-08-19 15:19:19.0"
  projectCreateTime: string
  // 承诺时限，如 "1"
  promiseDay: string
  // 业务办理项创建时间，如 "20220819152003"
  transactionCreateTime: string
  // 表单类型，如 "1"
  formType: string
  // 按钮名称，如 "在线办理"
  btnName: string
  // 事项种类：0：一件事，1：便民服务，2：办事指南
  itemClass: string
  // 事项排序序号
  itemOrder: number
  // 业务办理项前 30 天办件数量
  transBuSiCount: number
  // 业务办理项编码的后 14 位
  transactCode14: string
  // 标签，可能为 null
  label: string | null
  // 事项数，可能为 null
  transactNum: string | null
  // 高亮名称，可能为 null
  highlightName: string | null
  // 高亮任务名称，可能为 null
  highlightTaskName: string | null
  // 高亮办理项名称，可能为 null
  highlightTransactName: string | null
  // 同步时间，如 "20220819152003"
  syncTime: string
}
