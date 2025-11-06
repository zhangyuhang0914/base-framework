import {
  type TMapInstance,
  type IMapSearch,
  type LocalSearchResult,
  type PoiItem,
  type SearchResult,
  SearchType
} from '@/hooks/interface/useTMap'
import { CoordinateConverter } from '@/utils/map/coordinateConverter'

export class MapSearch implements IMapSearch {
  private map: TMapInstance
  public searchInstance: any
  // 搜索完成回调
  private searchCallback?: (result: SearchResult) => void
  // 缓存当前搜索结果
  public currentResults?: any
  constructor(map: TMapInstance, searchCallback?: (result: SearchResult) => void) {
    this.map = map
    this.searchCallback = searchCallback
    this.init()
  }
  // 初始化搜索实例
  private init() {
    if (!window.T || !window.T.LocalSearch) {
      console.error('天地图 LocalSearch 模块未加载')
      return
    }
    this.searchInstance = new window.T.LocalSearch(this.map, {
      // 每页容量
      pageCapacity: 10,
      onSearchComplete: (result: LocalSearchResult) => {
        console.log('onSearchComplete', result)
        // 缓存当前搜索结果
        this.currentResults = result
        // 格式化为统一 SearchResult
        const standardizedResult = this.formatSearchResult(result)
        this.searchCallback?.(standardizedResult)
      }
    })
  }
  // 格式化天地图原生结果为统一 SearchResult 类型
  private formatSearchResult(result: LocalSearchResult): SearchResult {
    // 获取总条数
    const totalCount = this.searchInstance.getCountNumber()
    // 当前页码
    const currentPage = this.searchInstance.getPageIndex()
    // 总页数
    const totalPage = this.searchInstance.getCountPage()
    console.log('搜索结果格式化处理：', result)
    // 获取当前页 POI 数据
    let pois: PoiItem[] = []
    if (result.pois && Array.isArray(result.pois)) {
      // 过滤无效数据
      pois = result.pois.filter((poi: any) => poi && poi.name)
    }
    return {
      // 当前页 POI 列表
      pois,
      // 全部数据
      allPois: pois,
      // 总条数
      totalCount: totalCount ?? 0,
      // 当前页码
      currentPage: currentPage,
      // 固定每页 10 条
      pageSize: pois.length || 0,
      // 总页数
      totalPage: totalPage,
      // 是否还有更多页
      hasMore: currentPage < totalPage
    }
  }
  // 关键词搜索
  searchByKeyword(keyword: string, type: SearchType = SearchType.NORMAL): void {
    if (!keyword.trim()) {
      ehbAppJssdk.notice.toast({ text: '请输入搜索关键词' })
      return
    }
    // 清除上一次搜索结果
    this.clear()
    this.searchInstance.setQueryType(type)
    this.searchInstance.search(keyword, type)
  }
  // 根据范围和检索词发起范围检索
  searchByBounds(keyword: string, bounds: any): void {
    if (!keyword.trim()) {
      ehbAppJssdk.notice.toast({ text: '请输入搜索关键词' })
      return
    }
    // 清除上一次搜索结果
    this.clear()
    this.searchInstance.searchInBounds(keyword, bounds)
  }
  // 根据中心点、半径与检索词发起周边检索
  searchNearby(keyword: string, center: { lng: number; lat: number }, radius: number = 1000): void {
    if (!keyword.trim()) {
      ehbAppJssdk.notice.toast({ text: '请输入搜索关键词' })
      return
    }
    // 清除上一次搜索结果
    this.clear()
    this.searchInstance.searchNearby(keyword, new window.T.LngLat(center.lng, center.lat), radius)
  }
  // 获取当前页标准化搜索结果
  getResults(): SearchResult {
    return this.formatSearchResult(this.currentResults)
  }
  // 清除搜索结果（重置状态）
  clear(): void {
    if (this.searchInstance) {
      // 清除天地图原生结果
      this.searchInstance.clearResults()
    }
    this.currentResults = {}
  }
  // 切换分页
  goToPage(page: number) {
    if (!this.currentResults) return
    // 总页树
    const totalPage = this.currentResults.obj.countPage
    console.log('goToPage:切换分页', page, totalPage)
    if (page < 1 || page > totalPage) {
      ehbAppJssdk.notice.toast({ text: '暂无更多数据' })
      return false
    }
    this.searchInstance.gotoPage(page)
  }
  // 坐标转换
  private standardizePoiItem(poi: any): PoiItem {
    // 处理坐标信息
    let lng = 0
    let lat = 0
    if (poi.lng && poi.lat) {
      lng = poi.lng
      lat = poi.lat
    } else if (poi.lon && poi.lat) {
      lng = poi.lon
      lat = poi.lat
    } else if (poi.point && poi.point.lng && poi.point.lat) {
      lng = poi.point.lng
      lat = poi.point.lat
    } else if (poi.lonlat) {
      // 处理 "116.313488 39.979416" 格式的坐标
      const [lngStr, latStr] = poi.lonlat.split(' ')
      lng = parseFloat(lngStr)
      lat = parseFloat(latStr)
    }
    // 坐标转换：将天地图坐标转换为高德地图坐标
    const convertedCoord = CoordinateConverter.cgcs2000ToGcj02(lng, lat)
    lng = convertedCoord.lng
    lat = convertedCoord.lat
    poi['lng'] = lng
    poi['lat'] = lat
    return poi
  }
}
