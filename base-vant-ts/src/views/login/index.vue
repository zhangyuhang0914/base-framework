<template lang="pug">
.page-wrap
  .main-box
    .suspend-view
      .micro-dialog__title {{ '千企万户大走访' }}
      .toggle-header
        .enterprise-title(:class="{ 'active-title': loginMode === 'enterprise' }" @click="toggleLoginMode('enterprise')") {{ '企业登录' }}
        .visiting-team-title(:class="{ 'active-title': loginMode === 'team' }" @click="toggleLoginMode('team')") {{ '走访组登录' }}
      .custom-login-wrap
        vanForm.custom-van-form.login-form(ref="loginFormRef" label-width="128px" :show-error-message="false" @submit="handleSubmit")
          vanCellGroup(inset)
            vanField.custom-block-input(
              v-model="loginForm.phone"
              name="phone"
              label="手机号"
              placeholder="请输入手机号码"
              :rules="[{ required: true, message: '请输入手机号码' }, { validator: validateTelephone }]")
            vanField.custom-block-input(
              v-model="loginForm.captcha"
              name="captcha"
              label="验证码"
              placeholder="请输入验证码"
              :rules="[{ required: true, message: '请输入验证码' }]")
              template(#button)
                vanButton.captcha-btn(:disabled="sendBtnDisabled" size="small" native-type="button" @click="sendPhoneCode") {{ sendBtnText }}
            vanField.custom-block-input.custom-input-submit-button
              template(#input)
                vanButton.submit-btn(type="primary" native-type="submit") {{ '登 录' }}
</template>

<script lang="ts">
import { useCaptchaCode } from '@/hooks/common'
import { $toast } from '@/plugins/vant'
import type { FormInstance } from 'vant'
import { defineComponent, reactive, ref } from 'vue'

type LoginModeType = 'enterprise' | 'team'
export default defineComponent({
  name: 'Login',
  setup(props) {
    const loginMode = ref<LoginModeType>('enterprise')
    const loginFormRef = ref<FormInstance>()
    const loginForm = reactive({
      phone: '',
      captcha: ''
    })
    const { sendBtnText, sendBtnDisabled, sendCode } = useCaptchaCode(60)
    const toggleLoginMode = (type: LoginModeType) => {
      loginMode.value = type
      resetForm()
    }
    // 发送短信验证码
    const sendPhoneCode = () => {
      if (!loginForm.phone) {
        $toast('请输入手机号码')
        return
      }
      loginFormRef.value
        ?.validate(['phone'])
        .then(result => {
          sendCode(loginForm.phone)
        })
        .catch((error: Error) => {
          console.log('error', error)
        })
    }
    // 重置表单
    const resetForm = () => {
      console.log('resetForm', loginFormRef.value?.resetValidation())
      loginFormRef.value?.resetValidation()
    }
    // 登录
    const handleSubmit = () => {
      console.log('handleSubmit')
    }
    return {
      loginMode,
      loginFormRef,
      loginForm,
      sendBtnText,
      sendBtnDisabled,
      toggleLoginMode,
      sendPhoneCode,
      handleSubmit
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
