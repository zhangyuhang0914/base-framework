import { inquiryinfoDemandCancel, queryByEntUser, supplyChainDockingUpdateState, uiasSMSLoanTemplate } from '@/api/user'
import { FinancingRecordListItem, SupplyChainListItem } from '@/api/user/type'
import { userCommonStoreHook } from '@/store/modules/common'
import { computed, reactive, ref, Ref } from 'vue'
import Bus, { FINANCE_RECORD_STATUS_REFRESH, SUPPLY_CHAIN_FINANCE_RECORD_STATUS_REFRESH } from './bus'

/**
 * 路由跳转（避免navigateTo使用过多，超过上限10个页面栈，导致小程序卡死）
 * @param {*} url 跳转路由
 * @param {*} callback 成功回调
 */
export const linkJump = (url: string, callback?: Function, customType?: string) => {
  if (!url) return false
  let newUrl = url
  // 过滤首位/
  if (url[0] === '/') {
    newUrl = url.substring(1)
  }

  let pathname
  // 过滤参数
  if (newUrl.indexOf('?') > -1) {
    pathname = newUrl.split('?')[0]
  } else {
    pathname = newUrl
  }

  const tabBarUrl = ['pages/index/index', 'pages/financeProduct/index', 'pages/servicesZone/index', 'pages/user/index']
  const page = getCurrentPages()
  const index = page.findIndex(item => item.route === pathname)
  // 是否跳转Tab栏页面
  if (tabBarUrl.includes(pathname)) {
    uni.switchTab({
      url: url,
      success: () => {
        callback && callback()
      }
    })
    return false
  }
  if (customType === 'redirectTo') {
    uni.redirectTo({
      url: url,
      success: () => {
        callback && callback()
      }
    })
    return false
  }
  // 页面栈中是否已存在
  if (index > -1) {
    // 获取页面栈中存在的路由
    const step = page.length - 1 - index
    // 没有找到则重定向到该路由
    if (step === 0) {
      uni.redirectTo({
        url: url,
        success: () => {
          callback && callback()
        }
      })
    } else {
      // 找到则返回到该路由
      callback && callback()
      uni.navigateBack({
        delta: step,
        success: () => {
          callback && callback()
        }
      })
    }
    return false
  }
  // 如果不是跳转Tab栏页面 也没有找到已存在页面栈 则直接跳转
  uni.navigateTo({
    url: url,
    success: () => {
      callback && callback()
    }
  })
}

/**
 * 路由返回
 * @param {*} data 传递参数
 * @param {*} callback 成功回调
 */
export const goBack = (data?: any, callback?: Function) => {
  uni.navigateBack({
    delta: 1,
    success: () => {
      if (data && JSON.stringify(data) !== '{}') {
        // 获取当前页面栈实例（此时最后一个元素为当前页）
        let pages = getCurrentPages()
        // 上一页面实例
        // 注意是length长度，所以要想得到上一页面的实例需要 -2，上上页面的实例就 -3，以此类推
        let prevPage = pages[pages.length - 2]
        if (pages.length <= 1) {
          prevPage = pages[0]
        }
        // 上一页面实例绑定getOptionValue()方法和参数（注意是$vm）
        prevPage.$vm.getOptionValue(data)
      }
      callback && callback()
    }
  })
}

/**
 * 打开其他小程序
 */
export const openOtherApp = (appId: string, path?: string, successCallback?: Function, failCallback?: Function) => {
  uni.navigateToMiniProgram({
    appId: appId,
    path: path,
    //  develop（开发版），trial（体验版），release（正式版）
    // envVersion: 'release',
    success: () => {
      console.log('打开成功')
      successCallback && successCallback()
    },
    fail: () => {
      console.log('打开失败')
      failCallback && failCallback()
    }
  })
}

/**
 * 外部链接跳转
 * @param {*} callback 成功回调
 */
export const externalLinkJump = (url: string, title?: string, callback?: Function) => {
  linkJump(`/pagesCommon/webView/index?url=${url}&title=${title}`, callback)
}

/**
 * 设置剪贴板的内容
 * @param {*} callback 成功回调
 */
export const setClipboardData = (content: string, callback?: Function) => {
  uni.setClipboardData({
    data: content,
    success: () => {
      uni.$u.toast('链接已复制，请在浏览器打开')
      callback && callback()
    }
  })
}

/**
 * 设置打开调试开关
 * @param {*} isEnableDebug 开启调试开关
 */
export const setEnableDebug = (isEnableDebug: boolean) => {
  uni.setEnableDebug({
    enableDebug: isEnableDebug
  })
}

/**
 * 融资记录取消申请
 */
export const useCancelFinanceRecord = () => {
  const entInfo = computed(() => {
    return userCommonStoreHook().entInfo
  })
  const uiasUserInfo = computed(() => {
    return userCommonStoreHook().uiasUserInfo
  })
  const currentCancelItem: Ref<FinancingRecordListItem | null> = ref<FinancingRecordListItem | null>(null)
  const isAgentPerson = ref(false)
  const showCancelModal = ref(false)
  const cancelApplyForm = reactive({
    id: '',
    finCreditInquiryId: '',
    linkManName: '',
    linkManNamePhone: '',
    smsCode: ''
  })
  // 初始化
  const init = () => {
    getQueryByEntUser()
  }
  // 查询当前用户是否是经办人
  const getQueryByEntUser = () => {
    if (!entInfo.value.userId) return
    const params = {
      // 企业 ID
      entUserId: entInfo.value.userId,
      // 用户手机号
      mobile: uiasUserInfo.value.mobilePhone as string
    }
    queryByEntUser(params).then(result => {
      isAgentPerson.value = result.data
    })
  }
  // 取消申请
  const cancelApplyClick = (id: string, finCreditInquiryId: string, item: FinancingRecordListItem) => {
    currentCancelItem.value = item
    const isAgent = isAgentPerson.value
    // 提示弹框
    const showCancellationModal = () => {
      uni.showModal({
        title: '提示',
        content: `确认取消该融资申请并短信通知${item.linkManName}？${item.linkManName}为当前融资需求的联系人。`,
        showCancel: true,
        confirmText: '确定',
        success: (result: UniApp.ShowModalRes) => {
          if (result.confirm) {
            cancelInquiryinfoDemandCancel(true)
          }
        }
      })
    }
    // 判断当前用户是经办人 且当前融资需求申请人不是经办人
    cancelApplyForm.id = id
    if (isAgent && uiasUserInfo.value.tbUserId !== item.tbUserId) {
      showCancellationModal()
    } else {
      cancelApplyForm.finCreditInquiryId = finCreditInquiryId
      cancelApplyForm.linkManName = item.linkManName
      cancelApplyForm.linkManNamePhone = item.linkManNamePhone
      showCancelModal.value = true
    }
  }
  // 取消融资申请
  const cancelInquiryinfoDemandCancel = (isSendSMSTemplate: boolean) => {
    inquiryinfoDemandCancel(cancelApplyForm.id)
      .then(result => {
        uni.$u.toast('取消融资申请成功')
        if (isSendSMSTemplate) {
          sendCancelSMSTemplate()
        }
        Bus.$emit(FINANCE_RECORD_STATUS_REFRESH, true)
      })
      .finally(() => {
        showCancelModal.value = false
        clearCancelApplyForm()
      })
  }
  // 发送取消融资申请短信模板
  const sendCancelSMSTemplate = () => {
    let params = {
      productName: currentCancelItem.value?.productName,
      name: uiasUserInfo.value.name,
      phone: currentCancelItem.value?.linkManNamePhone
    }
    uiasSMSLoanTemplate(params).then(result => {})
  }
  // 清空取消融资申请表单
  const clearCancelApplyForm = () => {
    cancelApplyForm.id = ''
    cancelApplyForm.linkManName = ''
    cancelApplyForm.linkManNamePhone = ''
    cancelApplyForm.smsCode = ''
  }
  return { isAgentPerson, showCancelModal, cancelApplyForm, init, cancelApplyClick, cancelInquiryinfoDemandCancel, clearCancelApplyForm }
}

/**
 * 供应链金融需求取消申请
 */
export const useCancelSupplyChainFinanceRecord = () => {
  const entInfo = computed(() => {
    return userCommonStoreHook().entInfo
  })
  const uiasUserInfo = computed(() => {
    return userCommonStoreHook().uiasUserInfo
  })
  const currentCancelItem: Ref<SupplyChainListItem | null> = ref<SupplyChainListItem | null>(null)
  const isAgentPerson = ref(false)
  const cancelFormRef: AnyObject = ref(null)
  const showCancelModal = ref(false)
  const cancelApplyForm = reactive({
    id: '',
    linkManName: '',
    linkManNamePhone: '',
    smsCode: ''
  })
  // 初始化
  const init = () => {
    getQueryByEntUser()
  }
  // 查询当前用户是否是经办人
  const getQueryByEntUser = () => {
    if (!entInfo.value.userId) return
    const params = {
      // 企业 ID
      entUserId: entInfo.value.userId,
      // 用户手机号
      mobile: uiasUserInfo.value.mobilePhone as string
    }
    queryByEntUser(params).then(result => {
      isAgentPerson.value = result.data
    })
  }
  // 取消申请
  const cancelApplyClick = (item: SupplyChainListItem) => {
    currentCancelItem.value = item
    const isAgent = isAgentPerson.value
    // 提示弹框
    const showCancellationModal = () => {
      uni.showModal({
        title: '提示',
        content: `确认取消该融资申请并短信通知${item.contacts}？${item.contacts}为当前融资需求的联系人。`,
        showCancel: true,
        confirmText: '确定',
        success: (result: UniApp.ShowModalRes) => {
          if (result.confirm) {
            cancelSupplyChainDockingUpdateCancel(true)
          }
        }
      })
    }
    // 判断当前用户是经办人 且当前融资需求申请人不是经办人
    cancelApplyForm.id = item.id
    if (isAgent && uiasUserInfo.value.tbUserId !== item.tbUserId) {
      showCancellationModal()
    } else {
      cancelApplyForm.linkManName = item.contacts
      cancelApplyForm.linkManNamePhone = item.phone
      showCancelModal.value = true
    }
  }
  // 取消对接申请
  const cancelSupplyChainDockingUpdateCancel = (isSendSMSTemplate: boolean) => {
    const isAgent = isAgentPerson.value
    let params = {
      id: cancelApplyForm.id,
      phone: currentCancelItem.value?.phone,
      state: '4',
      updatedUserId: uiasUserInfo.value.tbUserId,
      verifyCode: isAgent && uiasUserInfo.value.tbUserId !== currentCancelItem.value?.tbUserId ? '135246' : cancelApplyForm.smsCode
    }
    supplyChainDockingUpdateState(params)
      .then(result => {
        if (isSendSMSTemplate) {
          sendCancelSMSTemplate()
        } else {
          showCancelModal.value = false
          clearCancelApplyForm()
          uni.$u.toast('取消对接成功')
        }
        Bus.$emit(SUPPLY_CHAIN_FINANCE_RECORD_STATUS_REFRESH, true)
      })
      .finally(() => {
        if (cancelFormRef.value && cancelFormRef.value.upModalRef) {
          cancelFormRef.value.upModalRef.loading = false
        }
      })
  }
  // 发送取消融资申请短信模板
  const sendCancelSMSTemplate = () => {
    let params = {
      productName: currentCancelItem.value?.productName,
      name: uiasUserInfo.value.name,
      phone: currentCancelItem.value?.phone
    }
    uiasSMSLoanTemplate(params).then(result => {
      showCancelModal.value = false
      clearCancelApplyForm()
      uni.$u.toast('取消对接成功')
    })
  }
  // 清空取消融资申请表单
  const clearCancelApplyForm = () => {
    cancelApplyForm.id = ''
    cancelApplyForm.linkManName = ''
    cancelApplyForm.linkManNamePhone = ''
    cancelApplyForm.smsCode = ''
  }
  return { isAgentPerson, cancelFormRef, showCancelModal, cancelApplyForm, init, cancelApplyClick, cancelSupplyChainDockingUpdateCancel, clearCancelApplyForm }
}
