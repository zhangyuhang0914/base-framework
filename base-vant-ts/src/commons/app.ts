/*
 * @Desc         : 原生交互相关逻辑
 * @Autor        : ZhangYuHang
 * @Date         : 2023-08-17 17:37:41
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2023-08-23 15:28:56
 */

export const isApp = !!(
  window.JavascriptInterface ||
  (window.webkit && window.webkit.messageHandlers)
)
class App {
  isIOS: Boolean
  isApp: Boolean
  // 单例
  private static instance = new App()
  constructor() {
    this.isIOS =
      !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) &&
      window.webkit &&
      window.webkit.messageHandlers
    this.isApp = isApp
  }

  // 获取单例
  public static getInstance(): App {
    return App.instance
  }

  // 下载文件
  downFile(url: string, name?: string) {
    const link = document.createElement('a')
    link.setAttribute('download', name || '')
    link.setAttribute('target', '_blank')
    link.href = url
    link.click()
  }
}

export const $App = App.getInstance()
