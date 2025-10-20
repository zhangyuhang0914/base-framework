import { getBaseUrlByService } from '@/config/apiConfig'

const BASE_URL = getBaseUrlByService()

const images = {
  home: {
    headerBoolean: `${BASE_URL}static/images/home/headerBanner.png`
  },
  common: {
    defaultAvatar: `${BASE_URL}images/common/defaultAvatar.png`,
    placeholder: `${BASE_URL}images/common/placeholder.png`,
    errorImage: `${BASE_URL}images/common/errorImage.png`
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
      return images.common.placeholder
    }
    result = result[key]
  }
  return typeof result === 'string' ? result : images.common.placeholder
}

// 直接导出图片对象
export { images }

export default images
