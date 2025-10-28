// hooks/mapModules/MapSearch.ts
import {
  type TMapInstance,
  type IMapSearch,
  type LocalSearchResult,
  SearchResultType,
  type PoiItem
} from '@/hooks/interface/useTMap'

export class MapSearch implements IMapSearch {
  private map: TMapInstance
  // LocalSearch实例
  private searchInstance: any
  private isLoading = false
  // 搜索结果
  private results = {
    pois: [] as PoiItem[],
    // 存储全部50条数据
    allPois: [] as PoiItem[],
    // 总数
    totalCount: 0,
    // 当前页码
    currentPage: 1,
    // 每页显示条数
    pageSize: 10,
    // 计算的总页数
    totalPage: 0
  }
  constructor(map: TMapInstance) {
    if (!window.T || !window.T.LocalSearch) {
      throw new Error('天地图LocalSearch模块未加载')
    }
    if (!map) {
      throw new Error('必须传入地图实例')
    }
    this.map = map
    // 初始化LocalSearch实例（与传入的地图实例绑定）
    this.searchInstance = new window.T.LocalSearch(map, {
      pageCapacity: 50,
      onSearchComplete: (result: any) => this.handleResult(result)
    })
  }
  // 显示加载状态
  private showLoading() {
    if (!this.isLoading) {
      this.isLoading = true
      ehbAppJssdk.notice.showPreloader({
        text: '使劲加载中..'
      })
    }
  }
  // 隐藏加载状态
  private hideLoading() {
    if (this.isLoading) {
      this.isLoading = false
      ehbAppJssdk.notice.hidePreloader()
    }
  }
  // 处理搜索结果
  private handleResult(result: LocalSearchResult) {
    try {
      const resultData = result.result
      const { infocode } = resultData.status
      // 状态码处理
      if (infocode !== 1000) {
        this.handleError(`搜索失败（状态码：${infocode}）`)
        return
      }
      const resultType = resultData.resultType as SearchResultType
      const totalCount = Number(resultData.count) || 0
      if (totalCount === 0) {
        ehbAppJssdk.notice.toast({ text: '未找到相关网点' })
        this.setEmptyResults()
        return
      }
      // 只处理POI相关的搜索结果
      if (resultType === SearchResultType.NORMAL_POI) {
        this.handlePoiResult(result)
      } else {
        console.warn(`暂不支持的结果类型：${resultType}`)
        this.handleError('暂不支持该类型的搜索')
      }
    } catch (error) {
      console.error('处理搜索结果异常：', error)
      this.handleError('搜索结果处理失败，请重试')
    } finally {
      this.hideLoading()
    }
  }
  // 处理POI搜索结果
  private handlePoiResult(result: LocalSearchResult) {
    const allPois = (result.getPois() as PoiItem[]) || []
    if (allPois.length === 0) {
      this.handleError('未获取到有效网点信息')
      return
    }
    // 限制最多50条数据
    const limitedPois = allPois.slice(0, 50)
    // 计算分页
    const totalCount = limitedPois.length
    const totalPage = Math.ceil(totalCount / this.results.pageSize)
    // 获取第一页数据
    const firstPagePois = this.getPoisByPage(limitedPois, 1)
    // 更新结果
    this.results = {
      pois: firstPagePois,
      allPois: limitedPois,
      totalCount,
      currentPage: 1,
      pageSize: this.results.pageSize,
      totalPage
    }
    console.log('搜索结果：', {
      总条数: totalCount,
      总页数: totalPage,
      当前页条数: this.results.pois.length,
      全部数据: this.results.allPois,
      第一页: this.results.pois
    })
    ehbAppJssdk.notice.toast({
      text: `共找到${totalCount}个网点，已加载50个`
    })
  }
  // 解析坐标字符串 "lng,lat" 为数值
  private parseLonlat(lonlat: string): { lng: number; lat: number } {
    const [lngStr, latStr] = lonlat.split(',')
    return {
      lng: Number(lngStr) || 0,
      lat: Number(latStr) || 0
    }
  }
  // 获取分页数据
  private getPoisByPage(allData: PoiItem[], page: number): PoiItem[] {
    const startIndex = (page - 1) * this.results.pageSize
    const endIndex = Math.min(startIndex + this.results.pageSize, allData.length)
    return allData.slice(startIndex, endIndex)
  }
  // 设置空结果
  private setEmptyResults() {
    this.results = {
      pois: [],
      allPois: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: this.results.pageSize,
      totalPage: 0
    }
  }
  // 错误处理
  private handleError(msg: string) {
    ehbAppJssdk.notice.toast({ text: msg })
    this.setEmptyResults()
    this.hideLoading()
  }
  // 关键词搜索
  searchByKeyword(keyword: string, type: number = 1) {
    if (!keyword.trim()) {
      ehbAppJssdk.notice.toast({ text: '请输入搜索关键词' })
      return
    }
    this.showLoading()
    this.searchInstance.setQueryType(type)
    this.searchInstance.search(keyword, type)
  }
  // 周边搜索
  public searchNearby(
    keyword: string,
    center: { lng: number; lat: number },
    radius: number = 1000
  ) {
    if (!keyword.trim()) {
      ehbAppJssdk.notice.toast({ text: '请输入搜索关键词' })
      return
    }
    this.showLoading()
    this.searchInstance.searchNearby(keyword, new window.T.LngLat(center.lng, center.lat), radius)
  }
  // 获取搜索结果
  public getResults(page?: number) {
    if (page && page >= 1 && page <= this.results.totalPage) {
      const pageData = this.getPoisByPage(this.results.allPois, page)
      return {
        ...this.results,
        pois: pageData,
        currentPage: page
      }
    }
    return this.results
  }
  // 检查是否有搜索结果
  public hasResults(): boolean {
    return this.results.totalCount > 0
  }
  // 切换分页
  public switchPage(page: number) {
    if (page < 1 || page > this.results.totalPage) {
      ehbAppJssdk.notice.toast({ text: '页码无效' })
      return false
    }
    const pageData = this.getPoisByPage(this.results.allPois, page)
    this.results.pois = pageData
    this.results.currentPage = page
    return true
  }
  // 获取坐标信息
  public getCoordinates(poi: PoiItem): { lng: number; lat: number } {
    return this.parseLonlat(poi.lonlat)
  }
  // 设置每页显示条数
  public setPageSize(pageSize: number) {
    if (pageSize < 5 || pageSize > 20) {
      ehbAppJssdk.notice.toast({ text: '每页显示条数需在5-20之间' })
      return
    }
    this.results.pageSize = pageSize
    this.results.totalPage = Math.ceil(this.results.totalCount / pageSize)
    // 重新计算当前页数据
    this.switchPage(1)
  }
  // 清除搜索结果
  public clear() {
    this.searchInstance.clearResults()
    this.setEmptyResults()
    this.hideLoading()
  }
  // 销毁搜索实例
  public destroy() {
    this.clear()
    this.searchInstance = null
  }
}
