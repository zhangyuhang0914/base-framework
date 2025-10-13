/**
 * 鄂汇办分享相关API类型定义
 */

// 分享选项类型
export interface ShareOptions {
  // 分享类型，’2’:微信，’3’:朋友圈，’4’:微博
  shareType: '1' | '2' | '3'
  // 分享标题
  shareTitle: string
  // 分享摘要
  shareSummary: string
  // 分享链接
  shareUrl: string
  // 分享图片
  shareImage: string
  // 成功的回调，返回值json字符串
  success: (res: any) => void
}

// 鄂汇办分享接口类型定义
export interface EhbAppShare {
  // 第三方分享功能，分享到微信、分享到信朋友圈、分享到微博
  share: (options: ShareOptions) => void
}
