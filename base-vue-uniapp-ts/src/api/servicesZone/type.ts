/**
 * 政策文件列表
 */
export interface ITechnologyFinanceItem {
  channel?: string
  channelid?: string
  dochtmlcon?: string
  docid?: string
  docrelappendix?: null
  docrelpic?: null
  docrelvideo?: null
  doctitle?: string
  efectdate?: null
  effectivestate?: string
  filenum?: string
  filetype?: string
  pubdate?: string
  publisher?: string
  revisionnotes?: null
  subjectclass?: string
  url?: string
}

/**
 * 服务专区列表
 */
export interface SpecialZoneItem {
  // 应用 ID
  appId?: string
  // 应用链接
  appLinkUrl?: string
  // 轮播图文件 ID (PC 端)
  carouselFileId: string
  // 栏目 ID
  channelId?: string
  // 创建时间
  createdTime: string
  // 创建用户 ID
  createdUserId: string
  // 创建用户名
  createdUserName?: string
  // 数据状态
  dataStatus: number
  // 二维码文件 ID
  ewmFileId?: string
  // 主键 ID
  id: string
  // 是否显示二维码
  isEwm: '0' | '1' // 0: 显示，1: 不显示
  // 是否显示在 App 端
  isShowApp: '0' | '1' // 0: 显示，1: 不显示
  // 是否显示在 PC 端
  isShowPc: '0' | '1' // 0: 显示，1: 不显示
  // 链接地址
  linkUrl: string
  // 移动端轮播图文件 ID
  mobileCarouselFileId: string
  // 备注
  remark?: string
  // 专区名称
  specialZoneName: string
  // 专区类型
  specialZoneType?: '0' | '1' | '2' | '3' // 0: 通用，1: 股权市场，2: 二维码，3: 小程序跳转
  // 更新时间
  updatedTime?: string
  // 更新用户 ID
  updatedUserId?: string
  // 产品主要类型
  productMainType?: string
}
