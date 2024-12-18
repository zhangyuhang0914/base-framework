// type.ts

export interface httpRequestConfig extends UniApp.RequestOptions {
  /**
   * 接口地址
   */
  url: string
  /**
   * 请求方式
   */
  method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | undefined
  /**
   * 请求头
   */
  header?: any
  /**
   * 接口超时时间
   */
  timeout?: number
  /**
   * 请求上下文
   */
  apiType?: string
  /**
   * 表单上传
   */
  isForm?: boolean
  /**
   * 附件上传
   */
  formUpload?: boolean
  /**
   * 上传文件资源的路径
   */
  filePath?: string
  /**
   * 请求参数
   */
  params?: any
  /**
   * 加载
   */
  loading?: boolean
  /**
   * 不展示异常提示语
   */
  noShowMsg?: boolean
}

// 定义通用响应结构
export interface UniApiResponse {
  /**
   * 服务器状态
   */
  statusCode: number
  /**
   * 返回服务器数据
   */
  data: ApiResponse
}

export interface ApiResponse<T> {
  /**
   * 接口状态
   */
  code: number
  /**
   * 接口数据
   */
  data: T
  /**
   * 接口数据
   */
  page: ApiResponsePage<T>
  /**
   * 接口提示
   */
  msg: string
}

export interface ApiResponsePage<T> {
  /**
   * 当前页数
   */
  currPage: number
  /**
   * 接口数据
   */
  list: T
  /**
   * 每页条数
   */
  pageSize: number
  /**
   * 总条目数
   */
  totalCount: number
  /**
   * 总页数
   */
  totalPage: number
}
