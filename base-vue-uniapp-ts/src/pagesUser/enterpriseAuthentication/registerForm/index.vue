<template lang="pug">
.step1(v-show="currentStep === 1")
  up-form(labelPosition="left" labelWidth='100' :model="step1Form" ref='step1FormRef')
    .tips
      view.title {{'法人信息'}}
      up-tag(text="使用当前登录用户信息" bgColor='#E5F0FF' color='#3798D6' borderColor='transparent' @click='step1UseUserInfo')
    up-form-item.require(label="法人姓名" prop="legalName")
      up-input(v-model.trim="step1Form.legalName" border='none' placeholder="请输入法人姓名")
    up-form-item.require(label="证件类型" prop="cardType")
      CUniappPicker(:columns="cardTypeDic" :defaultName="cardType_text" keyName="describe" placeholder="请选择证件类型" @confirm="onCardTypeSelect")
        template(#right)
          up-icon(name='arrow-right' color='#909399')
    up-form-item.require(label="证件号码" prop="legalCard")
      up-input(v-model.trim="step1Form.legalCard" border='none' placeholder="请输入法人证件号码")
    up-form-item.require(label="设置密码" prop="password")
      up-input(v-model.trim="step1Form.password" border='none' type="password" placeholder="请输入密码")
    up-form-item.require(label="确认密码" prop="confirmPassword")
      up-input(v-model.trim="step1Form.confirmPassword" border='none' type="password" placeholder="请输入确认密码")
.step2(v-show="currentStep === 2")
  up-form(labelPosition="left" labelWidth='100' :model="step2Form" ref='step2FormRef')
    .tips
      view.title {{'企业信息'}}
    up-form-item.require(label="企业名称" prop="entName")
      up-input(v-model.trim="step2Form.entName" border='none' placeholder="请输入企业名称" @blur="entNameBlur")
    up-form-item.require(label="统一社会信用代码" prop="entUnitCode" labelWidth='140')
      up-input(v-model.trim="step2Form.entUnitCode" border='none' placeholder="请输入统一社会信用代码")
    up-form-item.require(label="企业类型" prop="entType")
      CUniappPicker(:columns="entTypeDic" :defaultName="entType_text" keyName="describe" placeholder="请选择企业类型" @confirm="onEntTypeSelect")
        template(#right)
          up-icon(name='arrow-right' color='#909399')
.step3(v-show="currentStep === 3")
  up-form(labelPosition="left" labelWidth='100' :model="step3Form" ref='step3FormRef')
    .tips
      view.title {{'联系人信息'}}
      up-tag(text="使用当前登录用户作为联系人" bgColor='#E5F0FF' color='#3798D6' borderColor='transparent' @click='step3UseUserInfo')
    up-form-item.require(label="联系人姓名" prop="agentName")
      up-input(v-model.trim="step3Form.agentName" border='none' placeholder="请输入联系人姓名")
    up-form-item.require(label="联系人身份证号" prop="agentCard" labelWidth='140')
      up-input(v-model.trim="step3Form.agentCard" border='none' placeholder="请输入企业联系人身份证号")
    up-form-item.require(label="联系人手机号码" prop="agentMobile" labelWidth='140')
      up-input(v-model.trim="step3Form.agentMobile" border='none' type="number" placeholder="请输入企业联系人手机号码")
    up-form-item.require(label="输入验证码" prop="vericode")
      up-input(v-model.trim="step3Form.vericode" border='none' placeholder="请输入验证码" :customStyle="{marginRight: '20rpx'}")
      template(#right)
        u-button(type="primary" :disabled="sendBtnDisabled" @click="sendPhoneCode") {{ sendBtnText }}
    //- up-form-item.require(label="授权协议" prop='licenseId')
    //-   LicenseConfirm(:confirmData='confirmData' @onLicenseConfirm='onLicenseConfirm')
    //- up-form-item.require(label="授权协议文件上传" labelWidth='400' prop='fileId')
    //-   .formItemH50
    //- UploadImage(@onChooseImage='onChooseImage')
view.bottomBtn
  up-button(
    v-show='currentStep > 1'
    type="primary"
    :customStyle="{width: '98%', marginRight: '2%'}"
    text="上一步"
    @click="handlePrev")
  up-button(
    type="primary"
    :customStyle="{width: currentStep === 1 ? '100%' : '98%', marginLeft: currentStep === 1 ? 0 : '2%'}"
    :text="currentStep === 3 ? '注册并绑定' : '下一步'"
    @click="handleNext")
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { userCommonStoreHook } from '@/store/modules/common'
// 授权协议
import LicenseConfirm from '@/components/licenseConfirm/index.vue'
// 授权协议文件上传
import UploadImage from '@/components/uploadImage/index.vue'
import { useCaptchaCode } from '@/hooks/common'
import CUniappPicker from '@/components/c-uniapp-picker/index.vue'
import { getDictParamData } from '@/api/index'
import myEncrypt from '@/util/encrypt'
import { queryByEntName, regEntInfoStep, regEntInfoStepOne, regEntInfoStepTwo } from '@/api/user'
import { goBack } from '@/common/common'
import { toast } from '@/common/uni-utils'
import type { UiasUserInfoType } from '@/api/common/types'
import { checkIdCard, validateMobile, validatePassword } from '@/util/validator'
import type { ApiResponse } from '@/common/http/types'
const { sendBtnText, sendBtnDisabled, sendCode } = useCaptchaCode(90)
let currentStep = ref(1)
// 用户信息
let uiasUserInfo = userCommonStoreHook().uiasUserInfo as UiasUserInfoType
let confirmData = computed(() => {
  return {
    entName: step2Form.value.entName,
    uniscId: step2Form.value.entUnitCode,
    legalName: step1Form.value.legalName,
    agentName: step3Form.value.agentName
  }
})
let step1FormRef = ref()
let step1Form = ref({
  legalName: '',
  cardType: '',
  legalCard: '',
  password: '',
  confirmPassword: ''
})
// 确认密码校验
const forgotValidatePassSure = (rule: AnyObject, value: string, callback: Function) => {
  if (value !== step1Form.value.password) {
    callback(new Error('两次输入密码不一致！'))
  } else {
    callback()
  }
}
const step1FormRules = reactive({
  legalName: [{ required: true, message: '法人姓名不能为空', trigger: 'blur' }],
  cardType: [{ required: true, message: '证件类型不能为空', trigger: 'blur' }],
  legalCard: [{ required: true, message: '证件号码不能为空', trigger: 'blur' }],
  password: [
    { required: true, message: '请设置法人在统一身份认证平台的登录密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认法人在统一身份认证平台的登录密码', trigger: 'blur' },
    { validator: forgotValidatePassSure, trigger: 'blur' }
  ]
})
let step2FormRef = ref()
let step2Form = ref({
  entName: '',
  entUnitCode: '',
  entType: '',
  entTypeCode: ''
})
const step2FormRules = reactive({
  entName: [{ required: true, message: '企业名称不能为空', trigger: 'blur' }],
  entUnitCode: [{ required: true, message: '统一社会信用代码不能为空', trigger: 'blur' }],
  entType: [{ required: true, message: '企业类型不能为空', trigger: 'blur' }]
})
let step3FormRef = ref()
let step3Form = ref({
  agentName: '',
  agentCard: '',
  agentMobile: '',
  vericode: '',
  licenseId: '',
  fileId: ''
})
const step3FormRules = reactive({
  agentName: [{ required: true, message: '联系人姓名不能为空', trigger: 'blur' }],
  agentCard: [
    { required: true, message: '联系人身份证号不能为空', trigger: 'blur' },
    { validator: checkIdCard, trigger: 'blur' }
  ],
  agentMobile: [
    { required: true, message: '联系人手机号码不能为空', trigger: 'blur' },
    { validator: validateMobile, trigger: 'blur' }
  ],
  vericode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
  licenseId: [{ required: true, message: '必须确认授权协议', trigger: 'blur' }],
  fileId: [{ required: true, message: '授权协议文件不能为空', trigger: 'blur' }]
})
let cardTypeDic = ref([])
let cardType_text = ref()
let entTypeDic = ref([])
let entType_text = ref()
// 证件类型选择
const onCardTypeSelect = (data: AnyObject) => {
  cardType_text.value = data.describe
  step1Form.value.cardType = data.value
  step1FormRef.value.validateField(['cardType'], async (valid: AnyObject) => {
    if (valid.length) return
  })
}
// 企业类型选择
const onEntTypeSelect = (data: AnyObject) => {
  entType_text.value = data.describe
  step2Form.value.entType = data.describe
  step2Form.value.entTypeCode = data.value
  step2FormRef.value.validateField(['entType'], async (valid: AnyObject) => {
    if (valid.length) return
  })
}
// 获取字典数据
const getDic = (dicTypeSign: string, optionsKey: any) => {
  getDictParamData(dicTypeSign).then(value => {
    let data = value.data || []
    optionsKey.value = data
  })
}
// 获取字段翻译
const getDicName = (id: string, options: any) => {
  if (!id || !options || !options.length) {
    return
  }
  let resObj = options.find(item => item.value === id)
  return resObj ? resObj.describe : ''
}
// 使用当前用户信息
const step1UseUserInfo = () => {
  step1Form.value.legalName = uiasUserInfo.name
  step1Form.value.cardType = uiasUserInfo.idType
  cardType_text.value = getDicName(uiasUserInfo.idType, cardTypeDic.value)
  step1Form.value.legalCard = uiasUserInfo.idCard
  step1FormRef.value?.validateField(['legalName'])
  step1FormRef.value?.validateField(['cardType'])
  step1FormRef.value?.validateField(['legalCard'])
}
const step3UseUserInfo = () => {
  step3Form.value.agentName = uiasUserInfo.name
  step3Form.value.agentCard = uiasUserInfo.idCard
  step3Form.value.agentMobile = uiasUserInfo.mobilePhone
}
// 根据企业名称获取统一社会信用代码
const entNameBlur = () => {
  let params = {
    entName: step2Form.value.entName
  }
  queryByEntName(params)
    .then(value => {
      if (value && value.entUnitCode) {
        step2Form.value.entUnitCode = value.entUnitCode || ''
        step2FormRef.value.validateField(['entUnitCode'], async (valid: AnyObject) => {
          if (valid.length) return
        })
      }
    })
    .catch(reason => {
      step2Form.value.entUnitCode = ''
    })
}
// 上一步
const handlePrev = () => {
  currentStep.value--
}
// 下一步
const handleNext = async () => {
  if (currentStep.value === 1) {
    if (await step1FormRef.value.validate()) {
      let params = {
        legalName: step1Form.value.legalName,
        legalCard: step1Form.value.legalCard
      }
      regEntInfoStepOne(params).then((result: ApiResponse<AnyObject>) => {
        currentStep.value++
        step2FormRef.value?.setRules(step2FormRules)
      })
    }
    return
  }
  if (currentStep.value === 2) {
    if (await step2FormRef.value.validate()) {
      let params = {
        legalName: step1Form.value.legalName,
        legalCard: step1Form.value.legalCard,
        entUnitCode: step2Form.value.entUnitCode,
        entName: step2Form.value.entName,
        entType: step2Form.value.entTypeCode
      }
      regEntInfoStepTwo(params).then((result: ApiResponse<AnyObject>) => {
        currentStep.value++
        step3FormRef.value?.setRules(step3FormRules)
      })
    }
    return
  }
  // 注册并绑定
  if (currentStep.value === 3) {
    if (await step3FormRef.value.validate()) {
      let params = Object.assign({}, step1Form.value, step2Form.value, step3Form.value, {
        password: myEncrypt(step1Form.value.password),
        userid: uiasUserInfo.userId,
        type: 1,
        authorizedOrgsCode: '91420000MAC45WE57R', // 被授权方统一社会信用代码
        authorizedOrgsName: '湖北省征信有限公司' // 被授权方企业名称
      })
      delete params.licenseId
      delete params.fileId
      regEntInfoStep(params).then(value => {
        uni.showModal({
          title: '提示',
          content: value.msg,
          showCancel: false,
          success() {
            goBack()
          }
        })
        userCommonStoreHook().setEntInfo(value.data)
      })
    }
  }
}
// 确认授权对象
const onLicenseConfirm = (licenseId: string) => {
  step3Form.value.licenseId = licenseId
  step3FormRef.value.validateField(['licenseId'], async (valid: AnyObject) => {
    if (valid.length) return
  })
}
// 上传盖章协议，仅支持上传图片
const onChooseImage = (fileId: string) => {
  step3Form.value.fileId = fileId
  step3FormRef.value.validateField(['fileId'], async (valid: AnyObject) => {
    if (valid.length) return
  })
}
// 发送短信验证码
const sendPhoneCode = async () => {
  if (!step3Form.value.agentMobile) {
    uni.$u.toast('请输入手机号码')
    return
  }
  step3FormRef.value?.validateField(['agentMobile'], async (valid: AnyObject) => {
    if (valid.length) return
    sendCode(step3Form.value.agentMobile, 'UiasSendSMSLogin')
  })
}
onMounted(() => {
  step1FormRef.value?.setRules(step1FormRules)
  getDic('id_type', cardTypeDic)
  getDic('ent_type', entTypeDic)
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
