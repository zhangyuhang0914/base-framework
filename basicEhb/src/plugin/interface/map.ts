/**
 * 鄂汇办位置相关API类型定义
 */

// 获取位置信息选项类型
export interface GetLocationOptions {
  // 成功的回调，返回值string类型
  success: (res: {
    // 定位信息
    address: string
    // 省份
    province: string
    // 市
    city: string
    // 区
    district: string
    // 经度
    longitude: number
    // 纬度
    latitude: number
  }) => void
}
// 地图/导航选项类型
export interface OpenMapOptions {
  // 目的地
  destination: string
  // 经度
  longitude: number
  // 纬度
  latitude: number
}
// 打开地图导航选项类型
export interface OpenMapNavigationOptions {
  // 目的地
  address: string
  // 部门名称
  deptName: string
  // 经度
  longitude: number
  // 纬度
  latitude: number
}
// 坐标转换选项类型
export interface ConvertCoordinateOptions {
  // “1”:百度转高德 “2”:高德转百度
  convertType: '1' | '2'
  // 经度
  longitude: number
  // 纬度
  latitude: number
}

// 鄂汇办位置接口类型定义
export interface EhbAppMap {
  // 获取位置信息
  getLocation: (options: GetLocationOptions) => void
  // 地图/导航
  openMap: (options: OpenMapOptions) => void
  // 打开地图导航
  openMapNavigation: (options: OpenMapNavigationOptions) => void
  // 坐标转换
  coordinateConvert: (options: ConvertCoordinateOptions) => void
}
