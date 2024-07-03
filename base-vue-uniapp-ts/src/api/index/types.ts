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
  name: string | null
  pId: string | null
  value: string | null
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
