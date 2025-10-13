/**
 * 鄂汇办选择器组件类型定义
 */

// 三级联动选择器数据结构
export interface LinkagePickerItem {
  value: string
  text: string
  children?: LinkagePickerItem[]
}
// 选择器项类型
export interface SelectorItem {
  title: string
  subTitle?: string
  onClick?: () => void
}
// 单项选择器（单列）选项类型
export interface ActionSheetOptions {
  // 选择器标题
  title?: string
  // 取消按钮
  cancelButton: string
  // 选择器选项按钮
  otherButtons: string[]
  // 成功的回调
  success: (res: {
    buttonIndex: string
    buttonName: string
  }) => void
}
// 单项选择器（多列单行/单列单行/单列多行）选项类型
export interface ActionSheetMultiColumnsOptions {
  // 选择器标题
  title?: string
  // 第一行渲染字段
  firstLine: string
  // 第二行渲染字段
  secondLine?: string
  // 是否有全部按钮
  hasAll: 'yes' | 'no'
  // 是否单行
  type: 'multRows' | 'singleRows'
  // 标题位置
  titleLocation?: 'left' | 'center' | 'right'
  // 单列种类
  singleColumns?: '1' | '2'
  // 渲染数据
  listData: Array<Record<string, any>>
  // 成功的回调
  success: (res: Record<string, any>) => void
}
// 日期/时间选择器选项类型
export interface DatePickerOptions {
  // 选择器标题
  title: string
  // 日期类型，'1':年，'2':年月，'3':年月日,'4':年月日时分,'5':时分
  columnsType: '1' | '2' | '3' | '4' | '5'
  // 最小范围
  minDate?: string
  // 最大范围
  maxDate: string
  // 成功的回调
  success: (res: {
    year?: string
    month?: string
    day?: string
    hour?: string
    minute?: string
  }) => void
}
// 三级联动选择器选项类型
export interface LinkagePickerOptions {
  // 选择器标题
  title: string
  // 选择器数据
  data: LinkagePickerItem[]
  // 选择器类型，'clickSelect':点选,'all':全选
  type: 'clickSelect' | 'all'
  // 返回数据层级，'1':一级，'2':二级，以此类推
  length: string
  // 数据来源，'1':底层（data参数传空），'2':传参
  dataOrigin?: '1' | '2'
  // 成功的回调
  success: (res: Record<string, {
    id: number
    text: string
    value: string
  }>) => void
}

// 鄂汇办选择器接口类型定义
export interface EhbAppSelector {
  // 单项选择器（单列）
  actionSheet: (options: ActionSheetOptions) => void
  // 单项选择器（多列单行/单列单行/单列多行）
  actionSheetMultiColumns: (options: ActionSheetMultiColumnsOptions) => void
  // 日期/时间选择器
  datePicker: (options: DatePickerOptions) => void
  // 三级联动选择器
  linkagePicker: (options: LinkagePickerOptions) => void
}
