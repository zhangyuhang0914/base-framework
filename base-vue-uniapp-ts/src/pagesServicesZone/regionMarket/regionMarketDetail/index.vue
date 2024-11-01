<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack statusBackground="#132B5B" headerBackground="#132B5B" headerColor="#FFFFFF" :headerTitle="query.label")
    template(#main)
      view.layoutMain
        .mainContainer
          scroll-view.scrollView(scroll-y)
            view.upFormBox
              up-form(labelPosition="left" labelWidth='80' :model="basicForm" ref='basicFormRef')
                up-form-item.require(label="企业名称" prop='name')
                  up-input(v-model.trim="basicForm.name" border='none' disabled)
                up-form-item.require(label="联系人" prop='contacts')
                  up-input(v-model.trim="basicForm.contacts" border='none' disabled)
                up-form-item.require(label="手机号码" prop='phone')
                  up-input(v-model.trim="basicForm.phone" border='none' disabled)
                up-form-item.require(label="验证码" prop="code")
                  up-input(v-model.trim="basicForm.code" border='none' placeholder="请输入验证码")
                  template(#right)
                    u-button.send-code-btn(type="primary" :disabled="sendBtnDisabled" @click="sendPhoneCode") {{ sendBtnText }}
              view.bottomBtn.u-big-btn
                up-button.u-primary(
                  type="primary"
                  text="提交"
                  @click="handleSubmit")
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import { reactive, ref, onMounted, computed } from 'vue'
import { userCommonStoreHook } from '@/store/modules/common'
import { useCaptchaCode } from '@/hooks/common'
import { toast } from '@/common/uni-utils'
import { goBack } from '@/common/common'
import { onLoad } from '@dcloudio/uni-app'
import { CommonSendSMS } from '@/api/common'
import { reportSaveData } from '@/api/servicesZone'
const { sendBtnText, sendBtnDisabled, sendCode } = useCaptchaCode(90)
// 用户信息
let uiasUserInfo = computed(() => {
  return userCommonStoreHook().uiasUserInfo
})
let entInfo = computed(() => {
  return userCommonStoreHook().entInfo
})
let query = ref({
  label: '',
  createdType: ''
})
let basicForm = ref({
  name: '',
  contacts: '',
  phone: '',
  code: ''
})
const basicFormRules = reactive({
  name: [{ required: true, message: '企业名称不能为空', trigger: 'blur' }],
  contacts: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
  phone: [{ required: true, message: '手机号码不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
})
let basicFormRef = ref()
// 发送短信验证码
const sendPhoneCode = async () => {
  if (!basicForm.value.phone) {
    uni.$u.toast('请输入手机号码')
    return
  }
  basicFormRef.value?.validateField(['phone'], async (valid: AnyObject) => {
    if (valid.length) return
    sendCode(basicForm.value.phone, 'CommonSendSMS')
  })
}
// 保存
const handleSubmit = async () => {
  if (await basicFormRef.value.validate()) {
    let params = Object.assign({}, basicForm.value, {
      uniscId: entInfo.value.entUnitCode,
      createdType: query.value.createdType,
      // 0鄂融通 1小程序
      source: '1'
    })
    reportSaveData(params).then(res => {
      toast.show('提交成功', 'success')
      setTimeout(() => {
        goBack()
      }, 500)
    })
  }
}
onLoad((option: AnyObject | undefined) => {
  query.value.label = option?.label
  query.value.createdType = option?.createdType
})
onMounted(() => {
  basicFormRef.value?.setRules(basicFormRules)
  basicForm.value.name = entInfo.value.entName
  basicForm.value.contacts = uiasUserInfo.value.name
  basicForm.value.phone = uiasUserInfo.value.mobilePhone
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
