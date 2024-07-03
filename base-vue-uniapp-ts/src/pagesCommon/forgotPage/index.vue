<template lang="pug">
.page-view(:style="{ background: `url(${preview(imgConstant['wx_login_header'])})`, backgroundSize: '100%', backgroundRepeat: 'no-repeat' }")
  Layout(showHeaderBar showBack)
    template(#main)
      .main-wrap
        .logo-box
          img(:src="preview(imgConstant['wx_login_logo'])")
        .scroll-main
          scroll-view.scroll-view(scroll-y)
            .container
              .forgot-wrap
                u--form(ref="forgotFormRef" :model="forgotForm")
                  u-form-item(prop="phone")
                    span.item-label {{ '手机号' }}
                    u--input(v-model="forgotForm.phone" type="number" border="none" placeholder="请输入手机号码")
                  u-form-item(prop="vericode")
                    span.item-label {{ '验证码' }}
                    u-input(v-model="forgotForm.vericode" type="number" border="none" placeholder="请输入验证码")
                      template(#suffix)
                        u-button(type="primary" :disabled="sendBtnDisabled" @click="sendPhoneCode") {{ sendBtnText }}
                  u-form-item(prop="newPassword")
                    span.item-label {{ '新密码' }}
                    u--input(v-model="forgotForm.newPassword" password border="none" placeholder="包含8-18位大小写字母和数字的密码")
                  u-form-item(prop="confirmPassword")
                    span.item-label {{ '确认密码' }}
                    u--input(v-model="forgotForm.confirmPassword" password border="none" placeholder="请再次确认密码")
                .footer-opeartion
                  u-button.larger-btn(type="primary" @click="updatePasswordClick") {{ '立即修改' }}
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import Layout from '@/components/layout/index.vue'
import { useCaptchaCode } from '@/hooks/common'
import { validateMobile, validatePassword } from '@/util/validator'
import { preview, uiasForgotPsd } from '@/api/common/index'
import imgConstant from '@/common/imgConstant'
import myEncrypt from '@/util/encrypt'
import type { ApiResponse } from '@/common/http/types'
import { linkJump } from '@/common/common'
import { userCommonStoreHook } from '@/store/modules/common'

export default defineComponent({
  name: 'ForgotPage',
  components: { Layout },
  setup(props) {
    const commonHook = userCommonStoreHook()
    const { sendBtnText, sendBtnDisabled, sendCode } = useCaptchaCode(90)
    const forgotFormRef: AnyObject = ref(null)
    const forgotForm = reactive({
      phone: '',
      vericode: '',
      newPassword: '',
      confirmPassword: ''
    })
    // 确认密码校验
    const forgotValidatePassSure = (rule: AnyObject, value: string, callback: Function) => {
      if (value !== forgotForm.newPassword) {
        callback(new Error('两次输入密码不一致！'))
      } else {
        callback()
      }
    }
    const forgotFormRules = reactive({
      phone: [
        { required: true, message: '手机号码不能为空', trigger: 'blur' },
        { required: true, min: 11, message: '不能小于11位数', trigger: 'blur' },
        { required: true, max: 11, message: '不能大于11位数', trigger: 'blur' },
        { validator: validateMobile, trigger: 'blur' }
      ],
      vericode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
      newPassword: [
        { required: true, message: '新密码不能为空', trigger: 'blur' },
        { validator: validatePassword, trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '确认密码不能为空', trigger: 'blur' },
        { validator: forgotValidatePassSure, trigger: 'blur' }
      ]
    })
    // 发送短信验证码
    const sendPhoneCode = () => {
      if (!forgotForm.phone) {
        uni.$u.toast('请输入手机号码')
        return
      }
      forgotFormRef.value?.validateField(['phone'], async (valid: AnyObject) => {
        if (valid.length) return
        sendCode(forgotForm.phone, 'UiasSendSMSForPwd')
      })
    }
    const updatePasswordClick = () => {
      forgotFormRef.value
        .validate()
        .then((res: AnyObject) => {
          let encryptPwd = JSON.parse(JSON.stringify(forgotForm.newPassword))
          let params = {
            loginName: forgotForm.phone,
            vericode: forgotForm.vericode,
            newPassword: myEncrypt(encryptPwd)
          }
          uiasForgotPsd(params).then((result: ApiResponse<AnyObject>) => {
            commonHook.logout(true, '', true)
          })
        })
        .catch((error: Error) => {
          console.log('submit error!!!', error)
        })
    }
    onMounted(() => {
      forgotFormRef.value?.setRules(forgotFormRules)
    })
    return {
      preview,
      imgConstant,
      sendBtnText,
      sendBtnDisabled,
      forgotFormRef,
      forgotForm,
      sendPhoneCode,
      updatePasswordClick
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
