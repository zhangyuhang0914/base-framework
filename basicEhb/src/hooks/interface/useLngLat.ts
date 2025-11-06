export interface IMapLngLat {
  // 获取地理坐标点的经度
  getLng?: (point: { lng: number; lat: number }) => number
  // 获取地理坐标点的纬度
  getLat?: (point: { lng: number; lat: number }) => number
  // 计算当前地理坐标点与给定坐标点之间的距离
  distanceTo?: (other: LngLat) => number
  // 判断坐标点是否相等，当且仅当两点的经度和纬度均相等时返回true
  equals?: (other: LngLat) => boolean
}

export type LngLat = [number, number]
