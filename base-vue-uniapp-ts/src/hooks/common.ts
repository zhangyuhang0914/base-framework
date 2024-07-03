import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type { ApiResponse } from '@/common/http/types'
import { UiasSendSMSLogin, UiasSendSMSForRegActive, UiasSendSMSForPwd, CommonSendSMS } from '@/api/common/index'
import { toast } from '@/common/uni-utils'
import { userCommonStoreHook } from '@/store/modules/common'
import { linkJump } from '@/common/common'
import type { CollectionParamsType, ProductListItem } from '@/api/financeProduct/types'
import { collectionSave, collectionWhetherCollection } from '@/api/financeProduct'
import type { EntInfoType } from '@/api/common/types'

/**
 * 获取短信验证码
 * @param {*} downNum 倒计时时间
 */
export const useCaptchaCode = (downNum: number): { sendBtnText: Ref<string>; sendBtnDisabled: Ref<boolean>; sendCode: (mobilePhone: string, type: string) => void } => {
  const sendBtnText = ref('发送验证码')
  const countDownNum = ref(downNum)
  const sendBtnDisabled = ref(false)
  /**
   * @param mobilePhone 手机号
   * @param type UiasSendSMSLogin: 手机验证登录
   *             UiasSendSMSForRegActive: 注册短信验证码
   *             UiasSendSMSForPwd: 忘记密码短信验证码
   *             CommonSendSMS: 系统内部-短信验证码
   */
  const sendCode = async (mobilePhone: string, sendType: string) => {
    let types: AnyObject = {
      CommonSendSMS: {
        api: CommonSendSMS
      },
      UiasSendSMSLogin: {
        api: UiasSendSMSLogin
      },
      /**
       * 1: 注册验证码
       * 2: 自然人忘记
       * 5: 法人注册
       * 6: 自然人注销
       * 17: 法人忘记密码
       */
      UiasSendSMSForRegActive: {
        type: '1',
        api: UiasSendSMSForRegActive,
        paramKey: 'mobilePhone'
      },
      UiasSendSMSForPwd: {
        type: '2',
        api: UiasSendSMSForPwd,
        paramKey: 'loginName'
      }
    }
    let params: AnyObject = {}
    // 发送验证码
    try {
      if (sendType === 'CommonSendSMS') {
        const result: ApiResponse<AnyObject> = await types[sendType].api(mobilePhone)
      } else {
        if (sendType === 'UiasSendSMSLogin') {
          params['mobilePhone'] = mobilePhone
        } else {
          params[types[sendType].paramKey] = mobilePhone
          params['type'] = types[sendType].type
        }
        const result: ApiResponse<AnyObject> = await types[sendType].api(params)
      }
      toast.show('验证码已发送', 'success')
      handleSendBtnState()
    } catch (error) {
      console.error('发送验证码失败：', error)
    }
  }
  const handleSendBtnState = () => {
    sendBtnDisabled.value = true
    sendBtnText.value = countDownNum.value + 's 后重新发送'
    const timer = setInterval(() => {
      countDownNum.value--
      sendBtnText.value = countDownNum.value + 's 后重新发送'
      if (countDownNum.value === 0) {
        clearInterval(timer)
        sendBtnText.value = '重新获取'
        countDownNum.value = downNum
        sendBtnDisabled.value = false
      }
    }, 1000)
  }
  return { sendBtnText, sendBtnDisabled, sendCode }
}

/**
 * 产品申请
 */
export const productApplyHandle = (): {
  loginValidateRef: Ref<HTMLElement>
  loginValidateType: Ref<string>
  jumpLoginFn: () => boolean
  linkProductApply: (item: ProductListItem) => void
} => {
  const commonHook = userCommonStoreHook()
  const token = computed(() => {
    return commonHook.token
  })
  const loginValidateRef = ref()
  const loginValidateType = ref('login')
  const entInfo = computed((): EntInfoType => {
    return commonHook.entInfo
  })
  // 判断登录和企业信息
  const jumpLoginFn = (): boolean => {
    if (!token.value) {
      loginValidateRef.value && loginValidateRef.value.init()
      loginValidateType.value = 'login'
      return false
    }
    if (!entInfo.value.userId) {
      loginValidateRef.value && loginValidateRef.value.init()
      loginValidateType.value = 'authentication'
      return false
    }
    return true
  }
  // 跳转产品申请
  const linkProductApply = (item: ProductListItem) => {
    if (!jumpLoginFn()) return
    let type = '3'
    if (item.skipUrl) {
      let typeIndex = item.skipUrl.indexOf('type')
      let length = 'type'.length
      if (typeIndex > -1) {
        type = item.skipUrl.slice(typeIndex + length + 1, typeIndex + length + 2)
      }
    }
    linkJump('/pagesFinanceProduct/productApply/index?id=' + item.id + '&type=' + type)
  }
  return { loginValidateRef, loginValidateType, jumpLoginFn, linkProductApply }
}

/**
 * 添加产品对比数据
 * @param {*} data 产品对象
 * @param {*} type 操作类型
 * @param {*} replaceProductId 被替换产品id
 */
export const setProductContrast = (data: ProductListItem, type: string, replaceProductId?: string) => {
  const commonHook = userCommonStoreHook()
  const _productContrastList = computed((): ProductListItem[] => {
    return commonHook.productContrastList
  })
  const isDuplicate = _productContrastList.value.some((item: ProductListItem) => item.id === data.id)
  const isMax = commonHook.productContrastList.length >= 2
  if (isDuplicate) {
    uni.$u.toast('对比产品不可重复')
    return
  }
  if (type === 'replace') {
    commonHook.setProductContrastList(data, type, replaceProductId)
    return
  }
  if (isMax) {
    uni.$u.toast('最多可对比2个产品')
    return
  }
  commonHook.setProductContrastList(data, type)
}

/**
 * 产品收藏
 * @param {*} type 收藏类型
 * @param {*} item 产品信息
 */
export const handleJudgeCollection = (type: string, item: ProductListItem, callBack?: Function) => {
  let isCollectStatus = item.isCollect ? '取消收藏' : '收藏'
  uni.showModal({
    content: `您确定${isCollectStatus}${item.name}吗?`,
    success: (result: UniApp.ShowModalRes) => {
      if (result.confirm) {
        let params: AnyObject = {
          collectionType: type
        }
        let types: AnyObject = {
          1: 'finProductInfoId',
          2: 'informationId',
          3: 'regulationsId'
        }
        params[types[type]] = item.id
        collectionSave(params).then(<T>(result: ApiResponse<T>) => {
          let param: AnyObject = {}
          param[types[type]] = item.id
          collectionWhetherCollection(param).then(<T>(res: ApiResponse<T>) => {
            uni.$u.toast(res.data ? '收藏成功' : '取消收藏成功')
            callBack && callBack(res.data)
          })
        })
      }
    }
  })
}

/**
 * 被下架产品取消产品收藏
 * @param {*} item 产品信息
 * @param {*} callBack 回调函数
 */
export const cancelCollection = (item: ProductListItem, callBack?: Function) => {
  uni.showModal({
    content: `产品已失效，是否移出收藏列表？`,
    success: (result: UniApp.ShowModalRes) => {
      if (result.confirm) {
        let params: AnyObject = {
          collectionType: 1,
          finProductInfoId: item.id
        }
        collectionSave(params).then(<T>(result: ApiResponse<T>) => {
          uni.$u.toast('移除成功')
          callBack && callBack(true)
        })
      } else {
        callBack && callBack(false)
      }
    }
  })
}
