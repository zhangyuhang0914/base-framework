<template lang="pug">
.cancel-form-wrap(v-if="showCancelModal")
  up-modal(ref="upModalRef" :show="showCancelModal" :title="title" @confirm="verifySMSCodeConfirm" @cancel="cancelModalCancel" @close="closeModalCancel" asyncClose showCancelButton confirmColor="#4C5F99")
    .slot-content
      up-form(ref='cancelApplyRef' labelPosition="left" labelWidth='70' :model="cancelApplyForm")
        up-form-item(label="联系人" prop='linkManName')
          up-input(v-model.trim="cancelApplyForm.linkManName" border='none' disabled)
        up-form-item.require(label="联系电话" prop='linkManNamePhone')
          up-input(v-model.trim="cancelApplyForm.linkManNamePhone" border='none' disabled)
        up-form-item.require(label="验证码" prop="smsCode")
          up-input(v-model.trim="cancelApplyForm.smsCode" border='none' placeholder="请输入验证码")
          template(#right)
            u-button.send-code-btn(type="primary" :disabled="sendBtnDisabled" @click="sendPhoneCode") {{ sendBtnText }}
</template>

<script lang="ts">
import { CommonInquiryVerifySMSCode } from '@/api/common'
import { useCaptchaCode } from '@/hooks/common'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CancelForm',
  props: {
    showCancelModal: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    cancelApplyForm: {
      type: Object,
      default: () => {
        return {
          id: '',
          linkManName: '',
          linkManNamePhone: '',
          smsCode: ''
        }
      }
    },
    // 是否需要单独校验验证码
    isVerifySMSCode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['confirm', 'cancel'],
  setup(props, context) {
    const upModalRef: AnyObject = ref(null)
    const cancelApplyRef = ref(null)
    // 手机验证登录
    const { sendBtnText, sendBtnDisabled, sendCode } = useCaptchaCode(90)
    // 发送验证码
    const sendPhoneCode = () => {
      if (!props.cancelApplyForm.linkManNamePhone) {
        uni.$u.toast('请输入联系电话')
        return
      }
      sendCode(props.cancelApplyForm.linkManNamePhone, 'CommonSendSMS')
    }
    // 短信校验
    const verifySMSCodeConfirm = () => {
      if (props.isVerifySMSCode) {
        let params = {
          id: props.cancelApplyForm.finCreditInquiryId,
          verifyCode: props.cancelApplyForm.smsCode
        }
        CommonInquiryVerifySMSCode(params)
          .then(() => {
            context.emit('confirm')
          })
          .catch((error: Error) => {
            console.log('error', error)
          })
          .finally(() => {
            if (upModalRef.value) {
              upModalRef.value.loading = false
            }
          })
      } else {
        context.emit('confirm')
      }
    }
    const cancelModalCancel = () => {
      context.emit('cancel')
    }
    const closeModalCancel = () => {
      context.emit('cancel')
    }
    return {
      upModalRef,
      cancelApplyRef,
      sendBtnText,
      sendBtnDisabled,
      sendPhoneCode,
      verifySMSCodeConfirm,
      cancelModalCancel,
      closeModalCancel
    }
  }
})
</script>

<style lang="stylus" scoped></style>
