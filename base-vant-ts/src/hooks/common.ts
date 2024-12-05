import { ref } from 'vue'
import type { Ref } from 'vue'
import type { ApiResponse } from '@/common/http/types'
import { sendCaptcha } from '@/api/common'
import { $toast } from '@/plugins/vant'

/**
 * 获取短信验证码
 * @param {*} downNum 倒计时时间
 */
export const useCaptchaCode = (
  downNum: number
): {
  sendBtnText: Ref<string>
  sendBtnDisabled: Ref<boolean>
  sendCode: (mobilePhone: string) => void
} => {
  const sendBtnText = ref('发送验证码')
  const countDownNum = ref(downNum)
  const sendBtnDisabled = ref(false)
  /**
   * 发送验证码
   * @param mobilePhone 手机号
   */
  const sendCode = async (mobilePhone: string) => {
    const params: AnyObject = {}
    // 发送验证码
    try {
      const result: ApiResponse<AnyObject> = await sendCaptcha(mobilePhone)
      $toast('验证码已发送', 'success')
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
