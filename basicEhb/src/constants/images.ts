import { getBaseUrlByService } from '@/config/apiConfig'

const BASE_URL = getBaseUrlByService()

const images = {
  common: {
    iconMatter: `${BASE_URL}static/images/common/iconMatter.png`,
    iconService: `${BASE_URL}static/images/common/iconService.png`,
    iconFaults: `${BASE_URL}static/images/common/iconFaults.png`,
    noData: `${BASE_URL}static/images/common/noData.png`,
    nSearchData: `${BASE_URL}static/images/common/nSearchData.png`
  },
  home: {
    headerBoolean: `${BASE_URL}static/images/home/headerBanner.png`,
    iconConvenientQuery: `${BASE_URL}static/images/home/iconConvenientQuery.png`,
    iconService: `${BASE_URL}static/images/home/iconService.png`,
    iconQuestion: `${BASE_URL}static/images/home/iconQuestion.png`,
    iconStandardization: `${BASE_URL}static/images/home/iconStandardization.png`,
    iconGovernmentService: `${BASE_URL}static/images/home/iconGovernmentService.png`,
    iconOutlets: `${BASE_URL}static/images/home/iconOutlets.png`,
    iconFaults: `${BASE_URL}static/images/home/iconFaults.png`,
    iconMaintenance: `${BASE_URL}static/images/home/iconMaintenance.png`
  },
  governmentService: {
    matterBanner: `${BASE_URL}static/images/governmentService/matterBanner.png`,
    iconProgramProductionLicenseQuery: `${BASE_URL}static/images/governmentService/iconProgramProductionLicenseQuery.png`,
    iconSatelliteProgramsLicenseQuery: `${BASE_URL}static/images/governmentService/iconSatelliteProgramsLicenseQuery.png`,
    faultsLogo: `${BASE_URL}static/images/governmentService/faultsLogo.png`,
    iconFaultsLine: `${BASE_URL}static/images/governmentService/iconFaultsLine.png`
  },
  commonService: {
    iconOutletsRecommendation: `${BASE_URL}static/images/commonService/iconOutletsRecommendation.png`,
    iconOutletsRoad: `${BASE_URL}static/images/commonService/iconOutletsRoad.png`
  },
  default: {
    placeholder: `${BASE_URL}static/images/common/noData.png`
  }
}

// 生成类型
type DeepKey<T> = T extends object
  ? {
      [K in keyof T]: K extends string ? (T[K] extends string ? K : `${K}.${DeepKey<T[K]>}`) : never
    }[keyof T]
  : never
export type ImageKeys = DeepKey<typeof images>

// 获取图片路径函数
export const getImage = (name: ImageKeys): string => {
  const keys = name.split('.') as string[]
  let result: any = images
  for (const key of keys) {
    if (result[key] === undefined) {
      console.warn(`Image path not found: ${name}`)
      return images.default.placeholder
    }
    result = result[key]
  }
  return typeof result === 'string' ? result : images.default.placeholder
}

// 直接导出图片对象
export { images }

export default images
