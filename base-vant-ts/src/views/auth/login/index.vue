<template lang="pug">
.page-wrap
  .main-box
    .suspend-view
      .micro-dialog__title {{ '千企万户大走访' }}
      .toggle-header
        .enterprise-title(:class="{ 'active-title': loginMode === 'enterprise' }" @click="toggleLoginMode('enterprise')") {{ '企业登录' }}
        .visiting-team-title(:class="{ 'active-title': loginMode === 'team' }" @click="toggleLoginMode('team')") {{ '走访组登录' }}
      .custom-login-wrap
        vanForm.custom-van-form.login-form(ref="loginFormRef" label-width="130px" show-error :show-error-message="false")
          vanCellGroup(inset)
            vanField.custom-block-input(
              v-model="loginForm.phone"
              type="digit"
              name="phone"
              label="手机号"
              placeholder="请输入手机号码"
              :rules="getRules('phone')")
            vanField.custom-block-input(
              v-model="loginForm.captcha"
              name="captcha"
              label="验证码"
              placeholder="请输入验证码"
              clearable
              :rules="getRules('captcha')")
              template(#button)
                vanButton.captcha-btn(:disabled="sendBtnDisabled" size="small" native-type="button" @click="sendPhoneCode") {{ sendBtnText }}
            vanField.custom-block-input(:border="false")
              template(#input)
              template(#button)
                .input-text-button-btn(native-type="button" @click="handleRegister") {{ '注册' }}
            vanField.custom-block-input
              template(#input)
                vanButton.submit-btn(type="primary" native-type="button" @click="handleSubmit") {{ '登 录' }}
</template>

<script lang="ts">
import { microEnterpriseLogin } from '@/api/common'
import type { MicroEnterpriseLoginParamType, MicroEnterpriseLoginResultType } from '@/api/model'
import type { ApiResponse } from '@/common/http/types'
import { useCaptchaCode } from '@/hooks/common'
import { $toast } from '@/plugins/vant'
import { userCommonStoreHook } from '@/stores/modules/common'
import { validateMobile } from '@/utils/validator'
import type { FormInstance } from 'vant'
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

type LoginModeType = 'enterprise' | 'team'
export default defineComponent({
  name: 'Login',
  setup(props) {
    const router = useRouter()
    const commonStore = userCommonStoreHook()
    const loginMode = ref<LoginModeType>('enterprise')
    const loginFormRef = ref<FormInstance>()
    const loginForm = reactive({
      phone: '',
      captcha: ''
    })
    const { sendBtnText, sendBtnDisabled, sendCode } = useCaptchaCode(60)
    const getRules = (type: keyof typeof loginForm) => {
      const rules = {
        phone: [{ required: true, message: '请输入手机号码' }, { validator: validateMobile }],
        captcha: [{ required: true, message: '请输入验证码' }]
      }
      return rules[type]
    }
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
          $toast('请输入正确的手机号码')
          console.log('error', error)
        })
    }
    // 重置表单
    const resetForm = () => {
      loginFormRef.value?.resetValidation()
      loginForm.phone = ''
      loginForm.captcha = ''
    }
    // 注册
    const handleRegister = () => {
      router.push({
        path: '/auth/register'
      })
    }
    // 登录
    const handleSubmit = () => {
      loginFormRef.value
        ?.validate()
        .then(result => {
          const params: MicroEnterpriseLoginParamType = {
            ...loginForm
          }
          microEnterpriseLogin(params)
            .then((result: ApiResponse<MicroEnterpriseLoginResultType>) => {
              const data = result.data
              commonStore.setToken(data.token, data.expire)
              commonStore.setUserId(data.userId)
              router.push({
                path: 'entry'
              })
            })
            .catch(error => {
              console.log('error', error)
            })
        })
        .catch((error: Error) => {
          console.log('error submit', error)
        })
    }
    return {
      loginMode,
      loginFormRef,
      loginForm,
      sendBtnText,
      sendBtnDisabled,
      validateMobile,
      getRules,
      toggleLoginMode,
      sendPhoneCode,
      handleRegister,
      handleSubmit
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
