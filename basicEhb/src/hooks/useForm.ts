import type { ApiResponse } from '@/common/http'
import { ref, type Ref } from 'vue'

/**
 * 获取短信验证码
 * @param {*} downNum 倒计时时间
 */
export const useCaptchaCode = (
  downNum: number
): {
  sendBtnText: Ref<string>
  sendBtnDisabled: Ref<boolean>
  sendCode: (mobilePhone: string, type: string, options?: AnyObject) => void
} => {
  const sendBtnText = ref('发送验证码')
  const countDownNum = ref(downNum)
  const sendBtnDisabled = ref(false)
  /**
   * @param mobilePhone 手机号
   * @param type CommonSendSMS: 系统内部-短信验证码
   *             UiasSendSMSLogin: 手机验证登录
   * @param options 其他参数
   * @param options.captchaId 图形验证码ID
   * @param options.captcha 图形验证码
   * @param options.callback 回调函数
   */
  const sendCode = async (mobilePhone: string, sendType: string, options?: AnyObject) => {
    const types: AnyObject = {
      /**
       * 1: 系统内部-短信验证码
       * 2: 手机验证登录
       */
      CommonSendSMS: {
        type: '1',
        api: 'API',
        paramKey: 'mobilePhone'
      },
      UiasSendSMSLogin: {
        type: '2',
        api: 'API',
        paramKey: 'loginName'
      }
    }
    const params: AnyObject = {}
    // 发送验证码
    try {
      // TO DO
      // if (sendType === 'CommonSendSMS') {
      //   const result: ApiResponse<AnyObject> = await types[sendType].api(mobilePhone)
      // } else {
      //   if (sendType === 'UiasSendSMSLogin') {
      //     params['mobilePhone'] = mobilePhone
      //   } else if (sendType === 'OperationPlatformSMS') {
      //     params[types[sendType].paramKey] = mobilePhone
      //     params['captchaId'] = options?.captchaId
      //     params['captcha'] = options?.captcha
      //   } else {
      //     params[types[sendType].paramKey] = mobilePhone
      //     params['type'] = types[sendType].type
      //   }
      //   const result: ApiResponse<AnyObject> = await types[sendType].api(params)
      //   options && options.callback && options.callback('success')
      // }
      options && options.callback && options.callback('success')
      ehbAppJssdk.notice.toast({ text: '发送成功' })
      handleSendBtnState()
    } catch (error) {
      options && options.callback && options.callback('fail')
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
