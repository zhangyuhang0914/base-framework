import { type IMapLngLat } from '@/hooks/interface/useLngLat'
import type { TMapInstance } from '@/hooks/interface/useTMap'

export class MapLngLat implements IMapLngLat {
  private map: TMapInstance
  constructor(map: TMapInstance) {
    this.map = map
  }
  /**
   * 计算两个经纬度点之间的距离
   * @param point1 起点：当前位置
   * @param point2 途经点1
   * @param point3 终点：目标位置
   * @returns
   */
  getDistanceBetweenTwoPoints(
    point1: { lng: number; lat: number },
    point2: { lng: number; lat: number }
  ): number {
    if (!window.T || !window.T.LngLat) {
      console.error('天地图 LngLat 模块未加载')
      return this.calculateDistanceManually(point1, point2)
    }
    try {
      const lngLat1 = new window.T.LngLat(point1.lng, point1.lat)
      const lngLat2 = new window.T.LngLat(point2.lng, point2.lat)
      return lngLat1.distanceTo(lngLat2)
    } catch (error) {
      console.error('计算距离失败:', error)
      return this.calculateDistanceManually(point1, point2)
    }
  }
  // 计算一系列地理坐标点的距离总和
  getDistance(points: { lng: number; lat: number }[]): number {
    if (!points || points.length < 2) {
      return 0
    }
    let totalDistance = 0
    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += this.getDistanceBetweenTwoPoints(points[i], points[i + 1])
    }
    return totalDistance
  }
  // 手动计算距离（备用方法，使用Haversine公式）
  private calculateDistanceManually(
    point1: { lng: number; lat: number },
    point2: { lng: number; lat: number }
  ): number {
    const R = 6371000 // 地球半径（米）
    const dLat = this.toRad(point2.lat - point1.lat)
    const dLng = this.toRad(point2.lng - point1.lng)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.lat)) *
        Math.cos(this.toRad(point2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }
  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180
  }
  // 格式化距离显示
  formatDistance(distance: number): string {
    if (distance < 1000) {
      return `${Math.round(distance)}m`
    } else {
      // 保留两位小数，处理浮点数精度问题
      const km = distance / 1000
      // 使用 toFixed 并去除多余的0
      const formattedKm = parseFloat(km.toFixed(2)).toString()
      return `${formattedKm}km`
    }
  }
  // 判断两个坐标点是否相等
  isPointsEqual(
    point1: { lng: number; lat: number },
    point2: { lng: number; lat: number }
  ): boolean {
    if (!window.T || !window.T.LngLat) {
      return point1.lng === point2.lng && point1.lat === point2.lat
    }
    try {
      const lngLat1 = new window.T.LngLat(point1.lng, point1.lat)
      const lngLat2 = new window.T.LngLat(point2.lng, point2.lat)
      return lngLat1.equals(lngLat2)
    } catch (error) {
      console.error('判断坐标相等失败:', error)
      return point1.lng === point2.lng && point1.lat === point2.lat
    }
  }

  // 获取坐标点的经度
  getLng(point: { lng: number; lat: number }): number {
    if (!window.T || !window.T.LngLat) {
      return point.lng
    }
    try {
      const lngLat = new window.T.LngLat(point.lng, point.lat)
      return lngLat.getLng()
    } catch (error) {
      console.error('获取经度失败:', error)
      return point.lng
    }
  }
  // 获取坐标点的纬度
  getLat(point: { lng: number; lat: number }): number {
    if (!window.T || !window.T.LngLat) {
      return point.lat
    }
    try {
      const lngLat = new window.T.LngLat(point.lng, point.lat)
      return lngLat.getLat()
    } catch (error) {
      console.error('获取纬度失败:', error)
      return point.lat
    }
  }
}
