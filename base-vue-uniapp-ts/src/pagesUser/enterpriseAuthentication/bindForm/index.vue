<template lang="pug">
up-form(labelPosition="left" labelWidth='100' :model="basicForm" ref='basicFormRef')
  up-form-item.require(label="企业名称" prop="entName")
    up-input(v-model.trim="basicForm.entName" border='none' placeholder="请输入企业名称" @blur="entNameBlur")
  up-form-item.require(label="统一社会信用代码" prop="userName" labelWidth='140')
    up-input(v-model.trim="basicForm.userName" border='none' placeholder="请输入统一社会信用代码")
  up-form-item.require(label="密码" prop="password" labelWidth='50')
    up-input(v-model.trim="basicForm.password" border='none' type="password" placeholder="请输入统一认证平台登录密码")
  //- up-form-item.require(label="授权协议" prop='licenseId')
  //-   up-input(v-model.trim="basicForm.licenseId" v-show='false')
  //-   LicenseConfirm(:confirmData='confirmData' @onLicenseConfirm='onLicenseConfirm')
  //- up-form-item.require(label="授权协议文件上传" labelWidth='400' prop='fileId')
  //-   up-input(v-model.trim="basicForm.fileId" v-show='false')
  //-   .formItemH50
  //- UploadImage(@onChooseImage='onChooseImage')
view.bottomBtn
  up-button(
    type="primary"
    text="绑定"
    @click="handleSubmit")
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { userCommonStoreHook } from '@/store/modules/common'
// 授权协议
import LicenseConfirm from '@/components/licenseConfirm/index.vue'
// 授权协议文件上传
import UploadImage from '@/components/uploadImage/index.vue'
import { loginEntUsingActive, queryByEntName } from '@/api/user'
import myEncrypt from '@/util/encrypt'
import { goBack } from '@/common/common'
import { toast } from '@/common/uni-utils'
import type { UiasUserInfoType } from '@/api/common/types'
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
  licenseId: '',
  fileId: '',
  legalName: ''
})
const basicFormRules = reactive({
  entName: [{ required: true, message: '企业名称不能为空', trigger: 'blur' }],
  userName: [{ required: true, message: '统一社会信用代码不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '统一认证平台登录密码不能为空', trigger: 'blur' }],
  licenseId: [{ required: true, message: '必须确认授权协议', trigger: 'blur' }],
  fileId: [{ required: true, message: '授权协议文件不能为空', trigger: 'blur' }]
})
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
// 绑定
const handleSubmit = async () => {
  if (await basicFormRef.value.validate()) {
    let params = Object.assign({}, basicForm.value, {
      type: 1,
      password: myEncrypt(basicForm.value.password),
      entUnitCode: basicForm.value.userName,
      userid: uiasUserInfo.userId,
      authorizedOrgsCode: '91420000MAC45WE57R', // 被授权方统一社会信用代码
      authorizedOrgsName: '湖北省征信有限公司' // 被授权方企业名称
    })
    delete params.licenseId
    delete params.fileId
    loginEntUsingActive(params).then(value => {
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
// 确认授权对象
const onLicenseConfirm = (licenseId: string) => {
  basicForm.value.licenseId = licenseId
  basicFormRef.value.validateField(['licenseId'], async (valid: AnyObject) => {
    if (valid.length) return
  })
}
// 上传盖章协议，仅支持上传图片
const onChooseImage = (fileId: string) => {
  basicForm.value.fileId = fileId
  basicFormRef.value.validateField(['fileId'], async (valid: AnyObject) => {
    if (valid.length) return
  })
}
onMounted(() => {
  basicFormRef.value?.setRules(basicFormRules)
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
