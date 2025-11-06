import type {
  AlertButtonParams,
  ConfirmButtonParams,
  PromptButtonParams,
  PromptOptionsParams
} from '@/plugin/interface/notice'
import type {
  SelectorItem,
  ActionSheetMultiColumnsOptions,
  DatePickerOptions,
  LinkagePickerOptions,
  ActionSheetOptionsParams
} from '@/plugin/interface/selector'
import { ErrorHandler } from '@/utils/common/errorHandler'
import { Utils } from '@/utils/common/utils'

export const CONSTANTS = {
  DEFAULT_TITLE: '请选择',
  DEFAULT_CANCEL_TEXT: '取消',
  DEFAULT_HAS_ALL: '0',
  DEFAULT_TYPE: '1',
  DEFAULT_MIN_DATE: '1900-01-01',
  DEFAULT_MAX_DATE: '2100-12-31',
  DEFAULT_BUTTON_TEXT: '确定',
  DEFAULT_ALERT_TITLE: '提示',
  DEFAULT_PROMPT_PLACEHOLDER: '请输入',
  DEFAULT_LOADING_TITLE: '加载中...'
} as const

export const useEhbApi = () => {
  /**
   * 单项选择器（单列）
   * @param {SelectorItem[]} data - 选择项列表
   * @param {ActionSheetOptionsParams} options - 配置选项
   * @param {string} [options.title] - 选择器标题
   * @param {string} [options.cancelButton] - 取消按钮文本
   * @param {Function} options.success - 成功回调函数，返回选中的选项或null
   */
  const actionSheet = (data: SelectorItem[], options: ActionSheetOptionsParams): void => {
    if (!Array.isArray(data)) {
      ErrorHandler.throwInvalidParam('data', '数组')
    }
    if (typeof options.success !== 'function') {
      ErrorHandler.throwInvalidParam('success', '函数')
    }

    const buttonLabels = data.map(item => item.label)

    ehbAppJssdk.notice.actionSheet({
      title: options.title || CONSTANTS.DEFAULT_TITLE,
      cancelButton: options.cancelButton || CONSTANTS.DEFAULT_CANCEL_TEXT,
      otherButtons: buttonLabels,
      success: (res: string) => {
        const result = JSON.parse(res)
        const selectedOption = data.find(item => item.label === result.buttonName)
        options.success(selectedOption as SelectorItem)
      }
    })
  }

  /**
   * 单项选择器(单列单行/单列多行)
   * @param {ActionSheetMultiColumnsOptions} options - 配置选项
   * @param {any[]} options.listData - 选择项列表数据
   * @param {string} [options.title] - 选择器标题
   * @param {string} [options.firstLine] - 第一行渲染字段
   * @param {string} [options.secondLine] - 第二行渲染字段
   * @param {string} [options.hasAll] - 是否包含'全部'选项
   * @param {string} [options.type] - 类型
   * @param {string} [options.titleLocation] - 标题位置
   * @param {string} [options.singleColumns] - 单列种类
   * @param {Function} options.success - 成功回调函数，返回选择结果
   */
  const actionSheetMultiColumns = (options: ActionSheetMultiColumnsOptions): void => {
    if (!Array.isArray(options.listData)) {
      ErrorHandler.throwInvalidParam('listData', '数组')
    }
    if (typeof options.success !== 'function') {
      ErrorHandler.throwInvalidParam('success', '函数')
    }

    ehbAppJssdk.notice.actionSheetMultiColumns({
      title: options.title || CONSTANTS.DEFAULT_TITLE,
      firstLine: options.firstLine || 'name',
      secondLine: options.secondLine || 'id',
      listData: options.listData,
      hasAll: options.hasAll || CONSTANTS.DEFAULT_HAS_ALL,
      type: options.type || CONSTANTS.DEFAULT_TYPE,
      titleLocation: options.titleLocation || 'center',
      singleColumns: options.singleColumns || '1',
      success: options.success
    })
  }

  /**
   * 日期选择器
   * @param {DatePickerOptions} options - 配置选项
   * @param {string} [options.title] - 选择器标题
   * @param {string} [options.columnsType] - 日期类型，'1':年，'2':年月，'3':年月日,'4':年月日时分,'5':时分
   * @param {string} [options.minDate] - 最小日期范围
   * @param {string} [options.maxDate] - 最大日期范围
   * @param {Function} options.success - 成功回调函数，返回格式化后的日期字符串
   */
  const datePicker = (options: DatePickerOptions): void => {
    if (typeof options.success !== 'function') {
      ErrorHandler.throwInvalidParam('success', '函数')
    }

    ehbAppJssdk.notice.datePicker({
      title: options.title || CONSTANTS.DEFAULT_TITLE,
      columnsType: options.columnsType || '3',
      minDate: options.minDate || CONSTANTS.DEFAULT_MIN_DATE,
      maxDate: options.maxDate || CONSTANTS.DEFAULT_MAX_DATE,
      success: (res: string) => {
        const result = JSON.parse(res)
        const dateStr = Utils.parseDateResult(result)
        options.success(dateStr)
      }
    })
  }

  /**
   * 多项选择器（三级联动）
   * @param {LinkagePickerOptions} options - 配置选项
   * @param {string} [options.title] - 选择器标题
   * @param {LinkagePickerItem[]} options.data - 选择器数据
   * @param {string} [options.type] - 选择器类型，'clickSelect':点选,'all':全选
   * @param {string} [options.length] - 返回数据层级，'1':一级，'2':二级，以此类推
   * @param {string} [options.dataOrigin] - 数据来源，'1':底层（data参数传空），'2':传参
   * @param {Function} options.success - 成功回调函数，返回选择结果
   */
  const linkagePicker = (options: LinkagePickerOptions): void => {
    if (!options || typeof options !== 'object') {
      ErrorHandler.throwInvalidParam('options', '对象')
    }
    if (typeof options.success !== 'function') {
      ErrorHandler.throwInvalidParam('success', '函数')
    }

    ehbAppJssdk.notice.linkagePicker({
      title: options.title || CONSTANTS.DEFAULT_TITLE,
      data: options.data || [],
      type: options.type || 'clickSelect',
      length: options.length || '1',
      dataOrigin: options.dataOrigin,
      success: options.success
    })
  }

  /**
   * 提示框
   * @param {string} content - 提示内容
   */
  const toast = (content: string): void => {
    if (typeof content !== 'string') {
      ErrorHandler.throwInvalidParam('content', '字符串')
    }

    ehbAppJssdk.notice.toast({
      text: content
    })
  }

  /**
   * 提示框
   * @param {string} content - 提示内容
   * @param {string} [title] - 提示标题
   * @param {AlertButtonParams} [button] - 按钮配置
   * @param {string} button.text - 按钮文本
   * @param {Function} button.callback - 按钮点击回调
   */
  const alert = (content: string, title?: string, button?: AlertButtonParams): void => {
    if (typeof content !== 'string') {
      ErrorHandler.throwInvalidParam('content', '字符串')
    }

    const btn = button || {
      text: CONSTANTS.DEFAULT_BUTTON_TEXT,
      callback: Utils.noop
    }

    ehbAppJssdk.notice.alert({
      title: title || CONSTANTS.DEFAULT_ALERT_TITLE,
      message: content,
      buttonName: btn.text,
      success: btn.callback
    })
  }

  /**
   * 确认框
   * @param {string} content - 提示内容
   * @param {string} [title] - 提示标题
   * @param {ConfirmButtonParams[]} [buttons] - 按钮列表
   * @param {string} buttons[].text - 按钮文本
   * @param {Function} buttons[].callback - 按钮点击回调
   */
  const confirm = (content: string, title?: string, buttons?: ConfirmButtonParams[]): void => {
    if (typeof content !== 'string') {
      ErrorHandler.throwInvalidParam('content', '字符串')
    }

    const defaultButtons: ConfirmButtonParams[] = [
      {
        text: '取消',
        callback: Utils.noop
      },
      {
        text: '确定',
        callback: Utils.noop
      }
    ]

    const finalButtons = buttons || defaultButtons

    ehbAppJssdk.notice.confirm({
      title: title || CONSTANTS.DEFAULT_ALERT_TITLE,
      message: content,
      buttonLabels: finalButtons.map(item => item.text),
      success: (res: string) => {
        const result = JSON.parse(res)
        const index = parseInt(result.buttonIndex)
        const btn = finalButtons[index]
        btn.callback && btn.callback()
      }
    })
  }

  /**
   * 输入框提示
   * @param {string} [title] - 提示标题
   * @param {PromptButtonParams[]} [buttons] - 按钮列表
   * @param {string} buttons[].text - 按钮文本
   * @param {Function} buttons[].callback - 按钮点击回调，接收输入值作为参数
   * @param {PromptOptionsParams} [options] - 配置选项
   * @param {string} [options.message] - 提示内容
   * @param {string} [options.placeholder] - 输入框占位符
   */
  const prompt = (
    title?: string,
    buttons?: PromptButtonParams[],
    options?: PromptOptionsParams
  ): void => {
    const defaultButtons: PromptButtonParams[] = [
      {
        text: '取消',
        callback: Utils.noop
      },
      {
        text: '确定',
        callback: Utils.noop
      }
    ]

    const finalButtons = buttons || defaultButtons

    // 验证按钮数量必须为2个
    if (finalButtons.length !== 2) {
      ErrorHandler.throwInvalidParam('buttons', '包含2个元素的数组')
      return
    }

    ehbAppJssdk.notice.prompt({
      title: title || CONSTANTS.DEFAULT_ALERT_TITLE,
      message: options?.message || '',
      placeholder: options?.placeholder || CONSTANTS.DEFAULT_PROMPT_PLACEHOLDER,
      buttonLabels: finalButtons.map(item => item.text),
      success: (res: string) => {
        const result = JSON.parse(res)
        const index = parseInt(result.buttonIndex)
        const btn = finalButtons[index]
        // 传递输入值给回调函数
        btn.callback && btn.callback(result.value)
      }
    })
  }

  /**
   * 显示加载指示器
   * @param {string} [title] - 加载提示文本
   * @returns {Object} 包含关闭方法的对象
   */
  const loading = (title?: string) => {
    ehbAppJssdk.notice.showPreloader({
      text: title || CONSTANTS.DEFAULT_LOADING_TITLE
    })

    const close = () => {
      ehbAppJssdk.notice.hidePreloader()
    }

    return {
      close
    }
  }

  return {
    // 方法
    actionSheet,
    actionSheetMultiColumns,
    datePicker,
    linkagePicker,
    toast,
    alert,
    confirm,
    prompt,
    loading
  }
}

export type UseEhbApiReturn = ReturnType<typeof useEhbApi>
