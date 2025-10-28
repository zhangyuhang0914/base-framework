// 天地图初始化参数选项
export interface TMapOptions {
  lng?: number // 初始经度
  lat?: number // 初始纬度
  showSearch?: boolean // 是否显示搜索控件
}

// 搜索返回结果
export interface SearchResult {
  pois: PoiItem[]
  allPois: PoiItem[]
  totalCount: number
  currentPage: number
  pageSize: number
  totalPage: number
  hasMore?: boolean
}

// 地图实例核心方法类型
export type TMapInstance = {
  centerAndZoom: (lngLat: any, zoom: number) => void // 定位中心点并设置缩放
  addOverLay: (overlay: any) => void // 添加覆盖物（标记、线等）
  removeOverLay: (overlay: any) => void // 移除覆盖物
  getBounds: () => any // 获取当前地图视野范围（用于视野内搜索）
  addEventListener: (event: string, callback: Function) => void // 绑定事件
  removeEventListener: (event: string, callback: Function) => void // 解绑事件
}

// 搜索类接口（覆盖所有天地图支持的搜索类型）
export interface IMapSearch {
  // 关键词搜索（支持多种搜索类型）
  searchByKeyword: (keyword: string, type?: SearchType) => void
  // 周边搜索（中心点+半径）
  searchNearby: (keyword: string, center: { lng: number; lat: number }, radius?: number) => void
  // 获取当前页搜索结果 - 修改返回类型
  getResults: (page?: number) => SearchResult
  // 清除搜索结果
  clear: () => void
}

// 天地图支持的搜索类型（对应 searchByKeyword 的 type 参数）
export enum SearchType {
  NORMAL = 1, // 普通搜索（POI+公交站）
  VIEWPORT = 2, // 视野内搜索（当前地图可视范围）
  AREA = 3, // 行政区搜索
  SUGGEST = 4, // 普通建议词搜索
  BUS_SUGGEST = 5, // 公交规划建议词搜索
  PURE_PLACE = 7, // 纯地名搜索（不含公交线）
  BOUND = 10 // 拉框搜索（范围搜索）
}

// 搜索结果类型（对应 result.resultType 和 getResultType 返回值）
export enum SearchResultType {
  NORMAL_POI = 1, // 普通POI结果（对应 SearchType.NORMAL/PURE_PLACE）
  VIEWPORT_STATISTICS = 2, // 视野内搜索统计结果（对应 SearchType.VIEWPORT）
  AREA_INFO = 3, // 行政区信息结果（对应 SearchType.AREA）
  SUGGEST_WORDS = 4, // 建议词结果（对应 SearchType.SUGGEST）
  BUS_LINE = 5 // 公交线结果（对应 SearchType.BUS_SUGGEST）
}

// POI点信息（SearchResultType.NORMAL_POI 时返回）
export interface PoiItem {
  name: string // POI名称
  phone?: string // 电话
  address?: string // 地址
  lonlat: string // 坐标（格式："lng lat"）
  poiType: '101' | '102' // 101:普通POI 102:公交站点
  ename?: string // 英文名称
  eaddress?: string // 英文地址
  hotPointID: string // POI热点ID
  province?: string // 所属省份
  provinceCode?: string // 省份编码
  city?: string // 所属城市
  cityCode?: string // 城市编码
  county?: string // 所属区县
  countyCode?: string // 区县编码
  source: string // 数据来源
  typeCode?: string // 分类编码
  typeName?: string // 分类名称
  stationInfo?: StationItem[] // 公交站点信息（poiType=102时有效）
  distance?: string // 与中心点的距离（周边搜索时返回）
}

// 公交站点包含的线路信息
export interface StationItem {
  lineName: string // 线路名称
  uuid: string // 线路ID
  stationUuid: string // 公交站ID
}

// 视野内搜索的统计信息（SearchResultType.VIEWPORT_STATISTICS 时返回）
export interface SearchStatistics {
  priorityCitys: PriorityCity[] // 推荐城市
  keyword: string // 搜索关键词
  countryCount: number // 涉及国家数量
  citysCount: number // 涉及城市数量
  allAdmins: ProvinceAdmin[] // 省份及下属城市统计
  provinceCount: number // 涉及省份数量
}

// 推荐城市信息（统计结果中的优先显示城市）
export interface PriorityCity {
  count: string // 该城市的POI数量
  name: string // 城市名称
  adminCode: number // 城市国标码
}

// 省份统计信息（统计结果中的省份数据）
export interface ProvinceAdmin {
  count: string // 该省份的POI数量
  name: string // 省份名称
  adminCode: number // 省份国标码
  childAdmins: CityAdmin[] // 下属城市统计
}

// 城市统计信息（省份下属城市数据）
export interface CityAdmin {
  count: string // 该城市的POI数量
  name: string // 城市名称
  adminCode: string // 城市国标码
}

// 行政区信息（SearchResultType.AREA_INFO 时返回）
export interface AreaInfo {
  level: string // 行政区级别
  lonlat: string // 行政区中心点坐标（格式："lng,lat"）
  name: string // 行政区名称
  points: RegionPoint[] // 行政区边界坐标
  type: '1' | '2' // 1:正常区域 2:特殊区域
}

// 行政区边界坐标点
export interface RegionPoint {
  region: string // 边界坐标串（格式："lng lat,lng lat,..."）
}

// 建议词信息（SearchResultType.SUGGEST_WORDS 时返回）
export interface SuggestItem {
  address: string // 地址
  name: string // 建议词名称
  gbCode: string // 国标码
  type?: string // 类型（如"city"、"poi"）
}

// 搜索提示信息（各类搜索可能返回的辅助提示）
export interface PromptItem {
  keyword?: string // 关联关键词（Type=1/2时存在）
  admins: PromptAdmin[] // 关联行政区
  type: 1 | 2 | 3 | 4 // 提示类型（1:搜索建议 2:无结果提示 3:多区域提示 4:其他）
}

// 提示信息中的行政区
export interface PromptAdmin {
  name: string // 行政区名称
  adminCode: number // 行政区国标码
}

// 公交线信息（SearchResultType.BUS_LINE 时返回）
export interface LineDataItem {
  poiType: '103' // 固定为103（公交线）
  stationNum: string // 站点数量
  name: string // 线路名称（含起终点）
  uuid: string // 线路ID
  company?: string // 运营公司
  distance?: string // 线路长度
}

// 搜索状态信息（result 中的 status 字段）
export interface SearchStatus {
  cndesc: string // 提示信息（如"成功"、"无结果"）
  infocode: number // 状态码（0:成功 其他:失败）
}

// LocalSearch 检索结果完整类型（对齐实际返回结构）
export interface LocalSearchResult {
  // 实例属性（实际返回的原始字段）
  area: AreaInfo | false // 行政区信息（无结果时为false）
  count: string // 检索总条数（字符串格式）
  keyWord: string // 检索关键词
  lineData: LineDataItem[] | undefined | false // 公交线数据（无结果时为false/undefined）
  obj: any // 内部代理对象（无需关注）
  pois: PoiItem[] | false // POI列表（无结果时为false）
  prompt: PromptItem[] | false // 提示信息（无结果时为false）
  result: any // 核心结果（动态结构，与resultType匹配）
  resultType: SearchResultType // 结果类型（与 SearchResultType 对应）
  statistics: SearchStatistics | false // 统计信息（无结果时为false）
  suggests: SuggestItem[] | false // 建议词列表（无结果时为false）

  // 实例方法（天地图提供的辅助方法）
  getResultType: () => SearchResultType // 返回 resultType
  getCount: () => number // 返回 count 转成的数字
  getKeyword: () => string // 返回 keyWord
  getPois: () => PoiItem[] // 返回 pois（无结果时返回空数组）
  getStatistics: () => SearchStatistics // 返回 statistics（无结果时返回空对象）
  getArea: () => AreaInfo // 返回 area（无结果时返回空对象）
  getSuggests: () => SuggestItem[] // 返回 suggests（无结果时返回空数组）
  getPrompt: () => PromptItem[] // 返回 prompt（无结果时返回空数组）
  getLineData: () => LineDataItem[] // 返回 lineData（无结果时返回空数组）
  getPageIndex: () => number // 返回当前页码
  getCountPage: () => number // 返回总页数
  getStatus: () => number // 返回 result.status.infocode（状态码）
}
