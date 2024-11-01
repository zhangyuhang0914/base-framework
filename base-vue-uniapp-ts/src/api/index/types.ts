import type { ProductListItem } from '../financeProduct/types'

/**
 * 轮播图信息
 */
export interface CarouselImgItem {
  carouselFileId: string
  createdTime: string
  createdUserId: string
  createdUserName: string
  dataStatus: number
  id: string
  linkUrl: string | null
  mobileCarouselFileId: string
  remark: string | null
  sortNum: number
  summary: string | null
  title: string | null
  updatedTime: string | null
  updatedUserId: string | null
  appletsCarouselFileId: string
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
  list?: Array<ProductListItem[]>
}

/**
 * 根据机构id查询分支机构参数
 */
export interface InstitutionsByIdListParam {
  page: number
  limit: number
  finInstitutionsBankId: string
  cityCode: string
}

/**
 * 分支机构列表
 */
export interface InstitutionsListItem {
  address: null
  area: null
  areaCode: null
  auditReasons: null
  bankType: number
  briefIntroduction: string
  category: string
  city: string
  cityCode: string
  createdTime: string
  createdUserId: null
  dataStatus: number
  electronicSigned: number
  finInstitutionsBankId: string
  finPlatformId: null
  higherAuthorities: string
  id: string
  logo: string
  name: string
  pid: null
  productCount: number
  province: string
  provinceCode: string
  remark: string
  settlingTime: string
  signApplyTime: null
  signFileId: null
  signTemplateId: null
  telephone: string
  uniscId: string
  updatedTime: null
  updatedUserId: null
  userName: null
  workTimeDesc: string
}

export interface TypeItem {
  name: string
  value: string
}

export interface CountryListItem {
  channel: string
  channelid: string
  dochtmlcon: string
  docid: string
  docrelappendix: null
  docrelpic: null
  docrelvideo: null
  doctitle: string
  efectdate: string
  effectivestate: string
  filenum: string
  filetype: string
  pubdate: string
  publisher: string
  revisionnotes: null
  subjectclass: string
  url: string
  docreltime: string
  updatedTimeStr: string
  title: string
  crawlId: string
  source: string
  id: string
  publishTime: string
  minFileId: string
}

export interface PageItem {
  currentPage: number
  pageSize: number
  totalPage: number
}

export interface CmsInfoResponseType {
  browseCount: number
  cancelTime: null
  categoryIds: string
  categoryNames: string
  content: string
  createTime: string
  createUserId: string
  createUserName: null
  dataStatus: number
  fileId: null
  fileList: null
  hit: number
  id: string
  minFileId: string
  publishTime: string
  source: string
  title: string
  updateTime: string
  updateUserId: string
  weight: number
}

export interface CMSCategoryLevelItemType {
  categoryLevel: number
  categorySort: number
  chName: string
  createBy: string
  createName: string
  createTime: string
  enName: string
  id: string
  // 是否显示  显示: 1  不显示: 0
  isVisual: number
  pid: string
  updateBy: string
  updateTime: string
  CMSInfoList?: CMSInfoDataListItemType[]
}

export interface CMSInfoDataListItemType {
  browseCount: number
  cancelTime: null
  categoryIds: string
  categoryNames: string
  content: string
  createTime: string
  createUserId: string
  createUserName: string
  dataStatus: number
  fileId: null
  fileList: null
  hit: number
  id: string
  minFileId: null
  publishTime: string
  source: string
  title: string
  updateTime: null
  updateUserId: null
  weight: number
}
