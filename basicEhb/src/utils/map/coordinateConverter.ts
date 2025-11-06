export class CoordinateConverter {
  // @ts-ignore
  private static readonly PI = 3.14159265358979324
  private static readonly A = 6378137.0 // CGCS2000椭球长半轴
  private static readonly EE = 0.0066943800229 // CGCS2000第一偏心率平方

  /**
   * CGCS2000转GCJ02（天地图坐标转高德坐标）
   */
  static cgcs2000ToGcj02(lng: number, lat: number): { lng: number; lat: number } {
    if (!this.isInChina(lng, lat)) {
      return { lng, lat }
    }

    let dLat = this.transformLat(lng - 105.0, lat - 35.0)
    let dLng = this.transformLng(lng - 105.0, lat - 35.0)

    const radLat = (lat / 180.0) * this.PI
    let magic = Math.sin(radLat)
    magic = 1 - this.EE * magic * magic
    const sqrtMagic = Math.sqrt(magic)

    dLat = (dLat * 180.0) / (((this.A * (1 - this.EE)) / (magic * sqrtMagic)) * this.PI)
    dLng = (dLng * 180.0) / ((this.A / sqrtMagic) * Math.cos(radLat) * this.PI)

    const mgLat = lat + dLat
    const mgLng = lng + dLng

    return { lng: mgLng, lat: mgLat }
  }

  /**
   * GCJ02转CGCS2000（高德坐标转天地图坐标）
   */
  static gcj02ToCgcs2000(lng: number, lat: number): { lng: number; lat: number } {
    if (!this.isInChina(lng, lat)) {
      return { lng, lat }
    }

    let dLat = this.transformLat(lng - 105.0, lat - 35.0)
    let dLng = this.transformLng(lng - 105.0, lat - 35.0)

    const radLat = (lat / 180.0) * this.PI
    let magic = Math.sin(radLat)
    magic = 1 - this.EE * magic * magic
    const sqrtMagic = Math.sqrt(magic)

    dLat = (dLat * 180.0) / (((this.A * (1 - this.EE)) / (magic * sqrtMagic)) * this.PI)
    dLng = (dLng * 180.0) / ((this.A / sqrtMagic) * Math.cos(radLat) * this.PI)

    const mgLat = lat + dLat
    const mgLng = lng + dLng

    return { lng: lng * 2 - mgLng, lat: lat * 2 - mgLat }
  }

  private static isInChina(lng: number, lat: number): boolean {
    return lng >= 72.004 && lng <= 137.8347 && lat >= 0.8293 && lat <= 55.8271
  }

  private static transformLat(x: number, y: number): number {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
    ret += ((20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0) / 3.0
    ret += ((20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin((y / 3.0) * this.PI)) * 2.0) / 3.0
    ret +=
      ((160.0 * Math.sin((y / 12.0) * this.PI) + 320 * Math.sin((y * this.PI) / 30.0)) * 2.0) / 3.0
    return ret
  }

  private static transformLng(x: number, y: number): number {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
    ret += ((20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0) / 3.0
    ret += ((20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin((x / 3.0) * this.PI)) * 2.0) / 3.0
    ret +=
      ((150.0 * Math.sin((x / 12.0) * this.PI) + 300.0 * Math.sin((x / 30.0) * this.PI)) * 2.0) /
      3.0
    return ret
  }
}
