<template lang="pug">
up-form(labelPosition="left" labelWidth='100' :model="basicForm" ref='basicFormRef')
  .tips
    view.title {{'企业信息'}}
  up-form-item.require(label="企业名称" prop="entName")
    up-input(v-model.trim="basicForm.entName" border='none' placeholder="请输入企业名称" @blur="entNameBlur")
  up-form-item.require(label="统一社会信用代码" prop="userName" labelWidth='140')
    up-input(v-model.trim="basicForm.userName" border='none' placeholder="请输入统一社会信用代码")
  up-form-item.require(label="密码" prop="password" labelWidth='50')
    up-input(v-model.trim="basicForm.password" border='none' type="password" placeholder="请输入统一认证平台登录密码")
  up-form-item.require(label="联系人手机号" prop="mobilePhone" labelWidth='140')
    up-input(v-model.trim="basicForm.mobilePhone" type="number" border='none' placeholder="请输入联系人手机号")
  u-form-item.require(prop="verifyCode" label="验证码")
    u-input(v-model.trim="basicForm.verifyCode" type="number" border="none" placeholder="请输入验证码")
      template(#suffix)
        u-button.send-code-btn(type="primary" :disabled="sendBtnDisabled" @click="sendPhoneCode") {{ sendBtnText }}
view.bottomBtn.u-big-btn
  up-button.u-primary(
    type="primary"
    text="绑定"
    @click="handleSubmit")
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { userCommonStoreHook } from '@/store/modules/common'
import { loginEntUsingActive, queryByEntName } from '@/api/user'
import myEncrypt from '@/util/encrypt'
import { goBack } from '@/common/common'
import { toast } from '@/common/uni-utils'
import type { EntInfoType, UiasUserInfoType } from '@/api/common/types'
import { useCaptchaCode } from '@/hooks/common'
// 用户信息
let uiasUserInfo = userCommonStoreHook().uiasUserInfo as UiasUserInfoType
let confirmData = computed(() => {
  return {
    entName: basicForm.value.entName,
    uniscId: basicForm.value.userName,
    legalName: basicForm.value.legalName
  }
})
let basicForm = ref({
  entName: '',
  userName: '',
  password: '',
  mobilePhone: '',
  verifyCode: '',
  legalName: ''
})
const basicFormRules = reactive({
  entName: [{ required: true, message: '企业名称不能为空', trigger: 'blur' }],
  userName: [{ required: true, message: '统一社会信用代码不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '统一认证平台登录密码不能为空', trigger: 'blur' }],
  mobilePhone: [{ required: true, message: '联系人手机号不能为空', trigger: 'blur' }],
  verifyCode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
})
// 手机验证码
const { sendBtnText, sendBtnDisabled, sendCode } = useCaptchaCode(90)
let basicFormRef = ref()
// 根据企业名称获取统一社会信用代码
const entNameBlur = () => {
  let params = {
    entName: basicForm.value.entName
  }
  queryByEntName(params)
    .then(value => {
      if (value && value.entUnitCode) {
        basicForm.value.userName = value.entUnitCode || ''
        basicForm.value.legalName = value.legalName || ''
        basicFormRef.value.validateField(['userName'], async (valid: AnyObject) => {
          if (valid.length) return
        })
      }
    })
    .catch(reason => {
      basicForm.value.userName = ''
    })
}
// 发送验证码
const sendPhoneCode = () => {
  if (!basicForm.value.mobilePhone) {
    uni.$u.toast('请输入联系人手机号')
    return
  }
  basicFormRef.value?.validateField(['mobilePhone'], async (valid: AnyObject) => {
    if (valid.length) return
    sendCode(basicForm.value.mobilePhone, 'CommonSendSMS')
  })
}
// 绑定
const handleSubmit = async () => {
  if (await basicFormRef.value.validate()) {
    let params = Object.assign({}, basicForm.value, {
      type: 1,
      password: myEncrypt(basicForm.value.password),
      entUnitCode: basicForm.value.userName,
      userid: uiasUserInfo.userId,
      mobilePhone: basicForm.value.mobilePhone,
      verifyCode: basicForm.value.verifyCode,
      authorizedOrgsCode: '', // 被授权方统一社会信用代码
      authorizedOrgsName: '' // 被授权方企业名称
    })
    loginEntUsingActive(params).then(value => {
      uni.showModal({
        title: '提示',
        content: value.msg,
        showCancel: false,
        success() {
          goBack()
        }
      })
      userCommonStoreHook().setEntInfo(value.data as EntInfoType)
    })
  }
}
onMounted(() => {
  basicFormRef.value?.setRules(basicFormRules)
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
