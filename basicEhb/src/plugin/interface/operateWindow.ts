/**
 * 鄂汇办窗口相关API类型定义
 */

// 打开新页面选项类型
export interface OpenOptions {
  // 标题
  title: string
  // 页面链接（完整url地址）
  url: string
  // 页面类型：homePage:app包本地页面,webPage:网页链接
  urlType: 'homePage' | 'webPage'
  // 要跳转的页面是否刷新，1:刷新,0:不刷新
  backRefresh?: '1' | '0'
  // 是否关闭当前页面，1:关闭,0:不关闭
  closeCurrentPage?: '1' | '0'
  // 登陆后是否刷新，1:刷新,0:不刷新
  reloadForLogin?: '1' | '0'
  // 开启关闭ios弹性滚动，disable: 禁用弹性滚动, scrolling: 开启弹性滚动
  disableScrolling?: 'disable' | 'scrolling'
  // 打开的页面所需的参数
  params?: Record<string, any>
  // 标题栏背景颜色,十六进制（#ffffff）
  navColor?: string
  // 标题栏左边的按钮（默认返回，关闭）
  leftBarButtonItems?: Array<any>
  // 标题栏右边的按钮（默认刷新）
  rightBarButtonItems?: Array<{
    // 按钮名
    buttonName: string
    // 按钮图标
    buttonIcon?: string
    // 文字颜色
    buttonColor?: string
    // 按钮方法
    buttonMethod?: string
    // 是否原生方法，'1':原生方法,'0':js方法
    isNativeMethod?: '1' | '0'
  }>
  // 标题栏中间按钮（可选）
  naviTitleStyle?: {
    // '1':文字标题,'2':搜索框标题，'3':城市选择标题，'4':带数量标题
    naviType?: '1' | '2' | '3' | '4'
    // 中间文字
    titleName?: string
    // 文字颜色
    titleColor?: string
    // 按钮方法
    titleMethod?: string
  }
  // 标题栏状态，'normal': 正常， 'hidden': 隐藏， 'opacity':透明（可选）
  hideNavi?: 'normal' | 'hidden' | 'opacity'
  // 页面类型 '0': 普通页面 '1': 便民服务页面 '2': 旗舰店页面（可选）
  pageType?: '0' | '1' | '2'
  // 页面层级 '1': 一级页面 '2': 二级页面（可选）
  pageLevel?: '1' | '2'
}
// 获取上一个页面传递的参数选项类型
export interface getPrePageParamsOptions {
  // 当前页面文件名
  pageUrl: string
  // 成功回调函数，参数为上一个页面传递的参数
  success: (res: Record<string, any>) => void
}
// 跳转指定根页面选项类型
export interface JumpRootPageOptions {
  // 跳转页面的下标序号，’0’：首页 ‘1’：便民，依此类推
  index: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
}

// 鄂汇办窗口接口类型定义
export interface EhbAppOperateWindow {
  // 打开新页面
  open: (options: OpenOptions) => void
  // 获取上一个页面传递的参数
  getPrePageParams: (options: getPrePageParamsOptions) => void
  // 刷新当前页面
  refresh: () => void
  // 关闭页面
  close: () => void
  // 跳转指定根页面
  jumpRootPage: (options: JumpRootPageOptions) => void
}
