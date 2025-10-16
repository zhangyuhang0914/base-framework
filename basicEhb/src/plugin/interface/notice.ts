/**
 * 鄂汇办通知组件类型定义
 */

import type { ActionSheetOptions, ActionSheetMultiColumnsOptions, DatePickerOptions, LinkagePickerOptions } from './selector'

// Alert弹窗选项类型
export interface AlertOptions {
  // 弹窗标题
  title: string
  // 弹窗内容
  message: string
  // 弹窗按钮
  buttonName: string
  // 成功的回调，无返回值
  success: () => void
}
// Confirm弹窗选项类型
export interface ConfirmOptions {
  // 弹窗标题
  title: string
  // 弹窗内容
  message: string
  // 确认按钮名称
  confirmButtonName: string
  // 取消按钮名称
  cancelButtonName: string
  // 成功的回调
  success: () => void
  // 失败的回调
  fail: () => void
}
// prompt输入框选项类型
export interface PromptOptions {
  // 弹窗标题
  title: string
  // 弹窗内容
  message: string
  // 输入框占位内容
  placeholder: string
  // 弹窗按钮，按钮数量为2
  buttonLabels: string[]
  // 成功的回调
  success: (res: { buttonIndex: string; value: string }) => void
}
// 加载弹窗选项类型
export interface PreloaderOptions {
  // 加载提示文本
  text?: string
}
// 内容弹框选项类型
export interface ContentPopupOptions {
  // 弹框标题
  title: string
  // 弹框内容
  text?: string
  // 弹框图片
  img?: string
  // 图片宽度(无单位)
  width?: string
  // 图片高度(无单位)
  height?: string
  // 弹框按钮
  buttonName: string
  // 成功的回调
  success: (res: { msg: string; code: string }) => void
}
// 网页半屏弹框选项类型
export interface WebPagePopupOptions {
  // 弹框标题
  title: string
  // 弹框链接
  url: string
  // 成功的回调
  success: (res: { msg: string; code: string }) => void
}
// 示列弹框选项类型
export interface ExamplePopupOptions {
  // 弹框标题
  title?: string
  // 弹框第一张图片
  picUrl: string
  // 弹框第二张图片
  picUrlSecond?: string
  // 弹框链接
  linkUrl?: string
  // 弹框按钮
  buttonName?: string
}
// 推荐给朋友选项类型
export interface SharePopupOptions {
  // 简介
  describe: object
}

// 鄂汇办通知接口类型定义
export interface EhbAppNotice {
  // 单项选择器（单列）
  actionSheet: (options: ActionSheetOptions) => void
  // 单项选择器（多列单行/单列单行/单列多行）
  actionSheetMultiColumns: (options: ActionSheetMultiColumnsOptions) => void
  // 日期/时间选择器
  datePicker: (options: DatePickerOptions) => void
  // 三级联动选择器
  linkagePicker: (options: LinkagePickerOptions) => void

  // alert弹框
  alert: (options: AlertOptions) => void
  // confirm确认框
  confirm: (options: ConfirmOptions) => void
  // prompt输入框
  prompt: (options: PromptOptions) => void
  // 显示加载弹窗
  showPreloader: (options?: PreloaderOptions) => void
  // 隐藏加载弹窗
  hidePreloader: () => void
  // 弱提示
  toast: (text: string) => void
  // 内容弹框
  contentPopup: (options: ContentPopupOptions) => void
  // 检查新版本
  checkVersion: () => void
  // 网页半屏弹框
  webPagePopup: (options: WebPagePopupOptions) => void
  // 示列弹框
  examplePopup: (options: ExamplePopupOptions) => void
  // 推荐给朋友
  sharePopup: (options: SharePopupOptions) => void
}
