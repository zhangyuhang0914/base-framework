<template lang="pug">
.page-view(:style="{ background: `url(${previewImg('wx_login_header')})`, backgroundSize: '100% 20%', backgroundRepeat: 'no-repeat' }")
  Layout(showHeaderBar showBack headerColor="#FFFFFF")
    template(#main)
      .main-wrap
        .logo-box
          img(:src="previewImg('wx_login_logo')")
        .scroll-main
          scroll-view.scroll-view(scroll-y)
            .container
              .login-wrap
                .toggle-header
                  .user-title(:class="{ 'active-login': loginMode === 'user' }" @click="toggleLoginMode('user')") {{ '账号密码登录' }}
                  .phone-title(:class="{ 'active-login': loginMode === 'phone' }" @click="toggleLoginMode('phone')") {{ '手机验证登录' }}
                .user-login-form.login-form(v-if="loginMode === 'user'")
                  u--form(ref="userFormRef" :model="userForm")
                    u-form-item(prop="userName")
                      span.item-label {{ '用户名' }}
                      u--input(v-model="userForm.userName" border="none" placeholder="请输入手机号/身份证号")
                    u-form-item(prop="password")
                      span.item-label {{ '密码' }}
                      u--input(v-model="userForm.password" password border="none" placeholder="请输入密码")
                .phone-login-form.login-form(v-else)
                  u--form(ref="phoneFormRef" :model="phoneForm")
                    u-form-item(prop="mobilePhone")
                      span.item-label {{ '手机号' }}
                      u--input(v-model="phoneForm.mobilePhone" type="number" border="none" placeholder="请输入手机号码")
                    u-form-item(prop="verifyCode")
                      span.item-label {{ '验证码' }}
                      u-input(v-model="phoneForm.verifyCode" type="number" border="none" placeholder="请输入验证码")
                        template(#suffix)
                          u-button.send-code-btn(type="primary" :disabled="sendBtnDisabled" @click="sendPhoneCode") {{ sendBtnText }}
                .footer-opeartion
                  u-button.larger-btn.u-primary(type="primary" @click="loginFn") {{ '登 录' }}
                  .other-btn
                    .register.text-btn(@click="togglePageMode('register')") {{ '注册' }}
                    .forgot-password.text-btn(@click="togglePageMode('forgot')") {{ '忘记密码？' }}
            .c-footer
              .header-tips
                p.txt {{ '温馨提示：' }}
                p.txt {{ '支持使用湖北省统一身份认证平台账号登录' }}
              .footer-tips
                p.txt {{ '本服务由湖北省统一身份认证平台提供' }}
        LoginValidateModal(ref='loginValidateRef' :type='loginValidateType' @onCancel="onCancel" :isRedirectTo='true')
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, nextTick, onMounted, reactive, ref } from 'vue'
import type { ComponentInternalInstance, Ref } from 'vue'
import Layout from '@/components/layout/index.vue'
import LoginValidateModal from '@/pages/user/loginValidateModal/index.vue'
import { previewImg } from '@/util/utils'
import { validateMobile } from '@/util/validator'
import { useCaptchaCode } from '@/hooks/common'
import { goBack, linkJump } from '@/common/common'
import { UiasAccountLoginActive, UiasPhoneLoginActive } from '@/api/common/index'
import type { ApiResponse } from '@/common/http/types'
import type { EntInfoType, UiasAccountLoginParam, UiasPhoneLoginParam, UiasUserInfoType } from '@/api/common/types'
import myEncrypt from '@/util/encrypt'
import { userCommonStoreHook } from '@/store/modules/common'
import Bus, { REFRESH } from '@/common/bus'

const customValidate = (rule: AnyObject, value: string, callback: Function) => {
  let MOBILE_REG = /^([+]?[\d]{1,3}-|[ ])?((13[0-9]{9})|(18[0-9]{9})|(15[0-9]{9})|(16[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(19[0-9]{9}))$/
  let ID_CARD_REG = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/
  if (value === '') {
    callback(new Error('请输入手机号/身份证号'))
  } else {
    if (value.length !== 11 && value.length !== 18) {
      callback(new Error('请输入正确的手机号/身份证号'))
    }
    if (value.length === 11) {
      if (MOBILE_REG.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码'))
      }
    } else if (value.length === 18) {
      if (ID_CARD_REG.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的身份证号码'))
      }
    }
  }
}
export default defineComponent({
  name: 'Login',
  components: { Layout, LoginValidateModal },
  setup(props, context) {
    const instance: ComponentInternalInstance | null = getCurrentInstance()
    const commonHook = userCommonStoreHook()
    const loginMode: Ref<string> = ref('user')
    // 账号密码登录
    const userFormRef: AnyObject = ref(null)
    const userForm: UiasAccountLoginParam = reactive({
      userName: '',
      password: '',
      type: 1
    })
    const userFormRules = reactive({
      userName: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { required: true, min: 11, message: '不能小于11位数', trigger: 'blur' },
        { required: true, max: 18, message: '不能大于18位数', trigger: 'blur' },
        { validator: customValidate, trigger: 'blur' }
      ],
      password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
    })
    // 手机验证登录
    const { sendBtnText, sendBtnDisabled, sendCode } = useCaptchaCode(90)
    const phoneFormRef: AnyObject = ref(null)
    const phoneForm: UiasPhoneLoginParam = reactive({
      mobilePhone: '',
      verifyCode: ''
    })
    const phoneFormRules = reactive({
      mobilePhone: [
        { required: true, message: '手机号码不能为空', trigger: 'blur' },
        { required: true, min: 11, message: '不能小于11位数', trigger: 'blur' },
        { required: true, max: 11, message: '不能大于11位数', trigger: 'blur' },
        { validator: validateMobile, trigger: 'blur' }
      ],
      verifyCode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
    })
    // 弹框
    const loginValidateRef = ref()
    const loginValidateType = ref('login')
    const toggleLoginMode = (type: string) => {
      if (loginMode.value === type) return
      loginMode.value = type
      nextTick(() => {
        if (loginMode.value === 'user') {
          userForm.userName = ''
          userForm.password = ''
          // userFormRef.value.setRules(userFormRules)
          // @ts-ignore
          instance?.proxy?.$refs.userFormRef?.setRules(userFormRules)
        } else {
          phoneForm.mobilePhone = ''
          phoneForm.verifyCode = ''
          // phoneFormRef.value.setRules(phoneFormRules)
          // @ts-ignore
          instance?.proxy?.$refs.phoneFormRef?.setRules(phoneFormRules)
        }
      })
    }
    const togglePageMode = (type: string) => {
      let pages: AnyObject = {
        register: '/pagesCommon/registerPage/index',
        forgot: '/pagesCommon/forgotPage/index'
      }
      linkJump(pages[type])
    }
    const sendPhoneCode = () => {
      if (!phoneForm.mobilePhone) {
        uni.$u.toast('请输入手机号码')
        return
      }
      phoneFormRef.value?.validateField(['mobilePhone'], async (valid: AnyObject) => {
        if (valid.length) return
        sendCode(phoneForm.mobilePhone, 'UiasSendSMSLogin')
      })
    }
    // 登录
    const loginFn = () => {
      if (loginMode.value === 'user') {
        userFormRef.value
          .validate()
          .then((res: AnyObject) => {
            let encryptPwd = JSON.parse(JSON.stringify(userForm.password))
            let params: UiasAccountLoginParam = {
              userName: userForm.userName,
              type: userForm.type,
              password: myEncrypt(encryptPwd)
            }
            UiasAccountLoginActive(params).then((result: ApiResponse<{ userInfo: UiasUserInfoType; entInfo: EntInfoType }>) => {
              setInfoData(result.data.userInfo, result.data.entInfo || {})
              Bus.$emit(REFRESH, true)
            })
          })
          .catch((error: Error) => {
            console.log('submit error!!!', error)
          })
      } else {
        phoneFormRef.value
          .validate()
          .then((res: AnyObject) => {
            let params: UiasPhoneLoginParam = {
              mobilePhone: phoneForm.mobilePhone,
              verifyCode: phoneForm.verifyCode
            }
            UiasPhoneLoginActive(params).then((result: ApiResponse<{ userInfo: UiasUserInfoType; entInfo: EntInfoType }>) => {
              setInfoData(result.data.userInfo, result.data.entInfo || {})
              Bus.$emit(REFRESH, true)
            })
          })
          .catch((error: Error) => {
            console.log('submit error!!!', error)
          })
      }
    }
    // 存储用户信息数据
    const setInfoData = (userInfo: UiasUserInfoType, entInfo: EntInfoType) => {
      commonHook.setToken(userInfo.token)
      commonHook.setUiasUserInfo(userInfo)
      commonHook.setEntInfo(entInfo)
      if (userInfo.loginType === '0') {
        loginValidateRef.value && loginValidateRef.value?.init()
        loginValidateType.value = 'authentication'
      } else {
        goBack()
      }
    }
    // 暂不绑定
    const onCancel = () => {
      goBack()
    }
    onMounted(() => {
      userFormRef.value?.setRules(userFormRules)
    })
    return {
      previewImg,
      loginMode,
      userFormRef,
      userForm,
      sendBtnText,
      sendBtnDisabled,
      phoneFormRef,
      phoneForm,
      loginValidateRef,
      loginValidateType,
      toggleLoginMode,
      togglePageMode,
      sendPhoneCode,
      loginFn,
      onCancel
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
