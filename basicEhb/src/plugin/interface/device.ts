/**
 * 鄂汇办设备相关API类型定义
 */

// 系统信息返回结果类型
export interface SystemInfoResult {
  // 系统信息字段，根据实际返回结果补充
  [key: string]: any;
}
// 获取网络类型选项类型
export interface GetNetworkTypeOptions {
  success: (res: {
    // 网络类型
    netWorkState: string
  }) => void
}
// 获取系统信息选项类型
export interface GetSystemInfoOptions {
  // 成功的回调
  success: (res: SystemInfoResult) => void
}
// 拨打电话选项类型
export interface CallOptions {
  // 电话号码
  phone: string
  // 成功的回调
  success: () => void
}
// 扫一扫选项类型
export interface ScanOptions {
  // 是否拦截登录
  scanType: 'needLogin' | 'noLogin'
  // 是否返回扫码内容
  returnResult: 'yes' | 'no'
  // 成功的回调，返回扫描结果
  success: (res: string) => void
}
// 复制到剪贴板选项类型
export interface CopyTextOptions {
  // 复制内容
  text: string
}
// 打开浏览器选项类型
export interface OpenBrowserOptions {
  // 网址
  url: string
}

// 鄂汇办设备接口类型定义
export interface EhbAppDevice {
  // 获取手机网络类型
  getNetworkType: (options: GetNetworkTypeOptions) => void
  // 获取手机系统信息
  getSystemInfo: (options: GetSystemInfoOptions) => void
  // 调用手机打电话功能
  call: (options: CallOptions) => void
  // 调用手机扫一扫功能
  scan: (options: ScanOptions) => void
  // 复制到剪贴板
  copyText: (options: CopyTextOptions) => void
  // 打开浏览器
  openBrowser: (options: OpenBrowserOptions) => void
}
