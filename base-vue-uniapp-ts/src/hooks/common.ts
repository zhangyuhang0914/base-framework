import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type { ApiResponse } from '@/common/http/types'
import { UiasSendSMSLogin, UiasSendSMSForRegActive, UiasSendSMSForPwd, CommonSendSMS, individualFace, faceCheck, contractDraft, contractTicket, contractDownload } from '@/api/common/index'
import { toast } from '@/common/uni-utils'
import { userCommonStoreHook } from '@/store/modules/common'
import { linkJump } from '@/common/common'
import type { ProductListItem } from '@/api/financeProduct/types'
import { collectionSave, collectionWhetherCollection } from '@/api/financeProduct'
import type { EntInfoType, UiasUserInfoType, contractDownloadResultType } from '@/api/common/types'
import type { CheckIsSupportFacialRecognitionOptionsType, FaceAuthVerifyType } from './types'
import { API as configApi } from '@/conf'

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
    const types: AnyObject = {
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
    const params: AnyObject = {}
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
    sendBtnText.value = countDownNum.value + 's 后重发'
    const timer = setInterval(() => {
      countDownNum.value--
      sendBtnText.value = countDownNum.value + 's 后重发'
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
    return commonHook.entInfo as EntInfoType
  })
  // 判断登录和企业信息
  const jumpLoginFn = (): boolean => {
    if (!token.value) {
      loginValidateRef.value && loginValidateRef.value.init()
      loginValidateType.value = 'login'
      return false
    }
    if (!entInfo.value || !entInfo.value.userId) {
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
      const typeIndex = item.skipUrl.indexOf('type')
      const length = 'type'.length
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
  const isCollectStatus = item.isCollect ? '取消收藏' : '收藏'
  uni.showModal({
    content: `您确定${isCollectStatus}${item.name}吗?`,
    success: (result: UniApp.ShowModalRes) => {
      if (result.confirm) {
        const params: AnyObject = {
          collectionType: type
        }
        const types: AnyObject = {
          1: 'finProductInfoId',
          2: 'informationId',
          3: 'regulationsId'
        }
        params[types[type]] = item.id
        collectionSave(params).then(<T>(result: ApiResponse<T>) => {
          const param: AnyObject = {}
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
        const params: AnyObject = {
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

/**
 * 检测是否支持人脸识别
 */
export const isSupportFacialRecognition = (data: FaceAuthVerifyType) => {
  uni.showLoading()
  // @ts-ignore
  wx.checkIsSupportFacialRecognition({
    /**
     * 活体检测，是否支持人脸识别
     * checkAliveType: 0 读数字（默认）  1 屏幕闪烁  2 先检查是否可以屏幕闪烁，不可以自动为读数字
     * 读数字：android 微信6.5.4及以上版本, iOS 微信6.5.6及以上版本
     * 屏幕闪烁：android 微信6.7.2及以上版本, iOS 微信6.7.2及以上版本
     */
    checkAliveType: 2,
    success: (result: CheckIsSupportFacialRecognitionOptionsType) => {
      console.log('checkIsSupportFacialRecognition:result', result)
      if (result.errCode === 0 || result.errMsg === 'checkIsSupportFacialRecognition:ok') {
        // 调用人脸识别
        startFacialRecognitionVerify(data)
      } else {
        uni.showModal({
          title: '提示',
          content: result.errMsg,
          showCancel: false
        })
      }
    },
    fail: (error: CheckIsSupportFacialRecognitionOptionsType) => {
      console.log('checkIsSupportFacialRecognition:error', error)
      uni.showModal({
        title: '提示',
        content: error.errMsg,
        showCancel: false
      })
    },
    complete: () => {
      uni.hideLoading()
    }
  })
}

/**
 * 开始人脸识别
 */
export const startFacialRecognitionVerify = (data: FaceAuthVerifyType) => {
  console.log('开始人脸识别')
  // @ts-ignore
  wx.startFacialRecognitionVerify({
    name: data.name,
    idCardNumber: data.idCardNumber,
    success: (result: UniApp.StartFacialRecognitionVerifyCallbackResult) => {
      console.log('startFacialRecognitionVerify:result', result)
    },
    fail: (error: UniApp.StartFacialRecognitionVerifyCallbackResult) => {
      console.log('startFacialRecognitionVerify:error', error)
      uni.showModal({
        title: '提示',
        showCancel: false,
        content: '人脸识别失败！' + error.errCode + ',' + error.errMsg,
        success: function (res) {
          console.log('res', res)
        }
      })
    },
    complete: () => {
      console.log('人脸识别调用成功')
    }
  })
}

/**
 * 人脸识别
 */
export const faceRecognition = (callback: any) => {
  const uiasUserInfo = userCommonStoreHook().uiasUserInfo as UiasUserInfoType
  const faceIntervalTime = userCommonStoreHook().faceIntervalTime || {}
  // 同一个用户24小时内只需要做一次人脸识别
  const diffMilliseconds = Date.now() - faceIntervalTime.time || 0
  if (uiasUserInfo.userId === faceIntervalTime.userId && diffMilliseconds < 24 * 60 * 60 * 1000) {
    callback && callback()
    return
  }
  const params = {
    name: uiasUserInfo.name,
    idNo: uiasUserInfo.idCard,
    faceauthMode: 'WE_CHAT_FACE',
    repetition: true
  }
  individualFace(params).then(value => {
    const data = value.data
    userCommonStoreHook().setFlowId(data.flowId)
    // @ts-ignore
    wx.navigateToMiniProgram({
      appId: 'wx1cf2708c2de46337', // 公证签小程序APPID
      path: `/pages/face/index?bizToken=${data.faceToken}` // 刷脸页面地址
    })
  })
}

/**
 * 获取人脸识别结果
 */
export const getFaceCheck = (callback?: any) => {
  if (!userCommonStoreHook().flowId) return
  // @ts-ignore
  const options = wx.getEnterOptionsSync()
  if (options && options.referrerInfo && options.referrerInfo.extraData && options.referrerInfo.extraData.faceResult && options.referrerInfo.extraData.faceResult.ErrorCode === 0) {
    // 刷脸完成，查询刷脸结果
    faceCheck({ flowId: userCommonStoreHook().flowId }).then(value => {
      // @ts-ignore
      const data = value.data
      userCommonStoreHook().setFlowId('')
      if (data.status === 'SUCCESS') {
        userCommonStoreHook().setFaceIntervalTime({
          userId: userCommonStoreHook().uiasUserInfo.userId as string,
          time: Date.now()
        })
        callback && callback()
      } else {
        uni.$u.toast(data.message)
      }
    })
  }
}

/**
 * 契约锁插件调用
 */
export const useContract = () => {
  const contract = ref({
    contractId: '', // 合同ID
    documentId: '', // 合同文件ID
    token: '', // 签署令牌
    contractFileId: '', // 下载合同文件ID
    contractFileName: '' // 合同文件名称
  })
  // 发起电子签章
  const startContractProcess = async (licenseId: string, callBack?: Function) => {
    if (!licenseId) {
      toast.show('请确认授权对象！')
      return
    }
    const commonStoreHook = userCommonStoreHook()
    // 用户信息
    const uiasUserInfo = computed(() => {
      return commonStoreHook.uiasUserInfo
    })
    // 企业信息
    const entInfo = computed((): EntInfoType => {
      return commonStoreHook.entInfo as EntInfoType
    })
    const params = {
      entName: entInfo.value.entName,
      mobile: uiasUserInfo.value.mobilePhone as string,
      fileId: licenseId
    }
    try {
      // 发起电子签章
      const result = await contractDraft(params)
      contract.value.contractId = result.data.contractId
      contract.value.documentId = result.data.documentId
      // 获取合同签署令牌
      const res = await contractTicket({
        contractId: result.data.contractId,
        mobile: uiasUserInfo.value.mobilePhone as string
      })
      contract.value.token = res.data
      const eventChannel: Ref<UniApp.EventChannel | null> = ref(null)
      // 获取根路径环境
      const isProd = import.meta.env.MODE === 'production'
      const BASE_PATH: AnyObject = isProd ? configApi.production : configApi.development
      const env = BASE_PATH['qyssdkPlugin']
      /**
       * 契约锁插件调用
       * @param {String} page 插件页面入口：doc(合同预览入口)，doc(合同签署入口)，enterprise-auth(企业认证入口)，personal-auth(实名认证入口)，signature(个人签名授权-open平台)，signature(个人签名授权-sass平台)，signature(印章自动签授权-sass平台）
       * @param {String} ticket 契约锁插件页面令牌
       * @param {String} env 环境参数：com(生产环境)，cn(测试环境)，默认为生产环境
       */
      // @ts-ignore
      wx.navigateTo({
        url: `plugin://qyssdk-plugin/doc?ticket=${contract.value.token}&env=${env}&hasCb=true`,
        events: {
          signSuccessCb: () => {
            // 签署成功回调
            console.log('signComplete')
            const url = '/pagesFinanceProduct/productApply/index' // 需要跳转的小程序页面地址，必须是绝对路径，可不传
            eventChannel.value?.emit('jumpTo', '') // 触发跳转逻辑，回调存在时必需调用，url不传默认返回
            contractDownload({ documentId: contract.value.documentId }).then((result: ApiResponse<contractDownloadResultType>) => {
              contract.value.contractFileId = result.data.fileId
              contract.value.contractFileName = result.data.fileName
              callBack && callBack()
            })
          },
          authSuccessCb() {
            // 认证成功回调
            console.log('authSuccess')
            eventChannel.value?.emit('jumpTo')
          },
          authFailCb() {
            // 认证失败回调
            console.log('authFail')
            eventChannel.value?.emit('jumpTo')
          }
        },
        success(res: UniApp.NavigateToSuccessOptions) {
          eventChannel.value = res.eventChannel
        }
      })
    } catch (error) {
      console.error('Error in contract process:', error)
    }
  }
  return {
    contract,
    startContractProcess
  }
}

/**
 * 小程序拨打电话
 */
export const useCallPhone = (phone: string, sucessCallback?: (result: AnyObject) => void, failCallback?: (result: AnyObject) => void) => {
  if (!phone) return
  const makePhoneParams: UniApp.MakePhoneCallOptions = {
    phoneNumber: phone,
    success: sucessCallback,
    fail: failCallback
  }
  uni.makePhoneCall(makePhoneParams)
}

/**
 * 小程序自动更新
 */
export const autoUpdateApp = () => {
  // 版本更新
  const updateManager: UniApp.UpdateManager = uni.getUpdateManager()
  if (!updateManager) {
    return
  } else {
    console.log('updateManager', updateManager)
    // 新版本更新
    if (uni.canIUse('getUpdateManager')) {
      // 判断当前微信版本是否支持版本更新
      updateManager.onCheckForUpdate(function (result: UniApp.OnCheckForUpdateResult) {
        console.log('result', result)
        // 请求完新版本信息的回调
        if (result.hasUpdate) {
          //监听小程序有版本更新事件
          updateManager.onUpdateReady(function () {
            uni.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
        }
      })
      // 监听版本更新失败
      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        uni.showModal({
          title: '已经有新版本了哟~',
          content: '新版本已经上线啦~，请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开哦~'
        })
      })
    } else {
      console.log('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。')
      uni.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        showCancel: false
      })
    }
  }
}
