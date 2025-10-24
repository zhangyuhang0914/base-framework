/**
 * 鄂汇办网络相关API类型定义
 */

// 网络请求参数选项类型
export interface NetworkRequestOptions {
  // 请求地址
  url: string
  // 请求方法
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
  // 请求数据
  data: any
  // 请求头
  headers: Record<string, string>
  // 是否需要token
  needToken: 'yes' | 'no'
  // 成功的回调
  success: (res: {
    code: number
    msg: string
    data: any
    // 是否需要解密，true:需要解密，flase:不解密
    rsa?: boolean
  }) => void
  // 失败的回调
  fail: (err: {
    code: number
    msg: string
    data: any[]
    // 是否需要解密，true:需要解密，flase:不解密
    rsa?: boolean
  }) => void
}
// 网络下载参数选项类型
export interface NetworkDownloadOptions {
  // 下载文件地址
  url: string
  // 下载文件夹名
  folderName: string
  // 下载文件名
  fileName: string
}

// 鄂汇办网络接口类型定义
export interface EhbAppNetwork {
  // 网络请求
  request: (options: NetworkRequestOptions) => void
  // 下载文件
  downloadFile: (options: NetworkDownloadOptions) => void
}
