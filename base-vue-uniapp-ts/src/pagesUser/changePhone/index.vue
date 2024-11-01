<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack statusBackground="#132B5B" headerBackground="#132B5B" headerColor="#FFFFFF" headerTitle="修改手机号")
    template(#main)
      view.layoutMain
        .mainContainer
          scroll-view.scrollView(scroll-y)
            view.upFormBox
              up-form(labelPosition="left" labelWidth='80' :model="basicForm" ref='basicFormRef')
                up-form-item(label="原手机号")
                  up-input(v-model.trim="mobilePhone" border='none' disabled)
                up-form-item.require(label="新手机号" prop="mobilePhone")
                  up-input(v-model.trim="basicForm.mobilePhone" border='none' placeholder="请输入新的手机号码")
                up-form-item.require(label="验证码" prop="verifyCode")
                  up-input(v-model.trim="basicForm.verifyCode" border='none' placeholder="请输入验证码")
                  template(#right)
                    u-button.send-code-btn(type="primary" :disabled="sendBtnDisabled" @click="sendPhoneCode") {{ sendBtnText }}
              view.bottomBtn.u-big-btn
                up-button.u-primary(
                  type="primary"
                  text="完成"
                  @click="handleSubmit")
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import { reactive, ref, onMounted, computed } from 'vue'
import { userCommonStoreHook } from '@/store/modules/common'
import { useCaptchaCode } from '@/hooks/common'
import { changePhone } from '@/api/user'
import { toast } from '@/common/uni-utils'
import { validateMobile } from '@/util/validator'
import { maskPhoneNumber } from '@/util/utils'
import { goBack } from '@/common/common'
const { sendBtnText, sendBtnDisabled, sendCode } = useCaptchaCode(90)
// 用户信息
let uiasUserInfo = computed(() => {
  return userCommonStoreHook().uiasUserInfo
})
let mobilePhone = computed(() => {
  return maskPhoneNumber(uiasUserInfo.value.mobilePhone)
})
let basicForm = ref({
  mobilePhone: '',
  verifyCode: ''
})
const basicFormRules = reactive({
  mobilePhone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { validator: validateMobile, trigger: 'blur' }
  ],
  verifyCode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
})
let basicFormRef = ref()
// 发送短信验证码
const sendPhoneCode = async () => {
  if (!basicForm.value.mobilePhone) {
    uni.$u.toast('请输入手机号码')
    return
  }
  basicFormRef.value?.validateField(['mobilePhone'], async (valid: AnyObject) => {
    if (valid.length) return
    sendCode(basicForm.value.mobilePhone, 'UiasSendSMSLogin')
  })
}
// 保存
const handleSubmit = async () => {
  if (await basicFormRef.value.validate()) {
    uni.showModal({
      title: '提示',
      content: '手机号变更后，若您要对使用旧手机号作为联系方式的融资申请或供应链金融需求执行取消操作，需联系企业经办人进行取消。确认变更吗？',
      showCancel: true,
      confirmText: '确定',
      success: (result: UniApp.ShowModalRes) => {
        if (result.confirm) {
          let params = {
            userid: uiasUserInfo.value.userId,
            mobilePhone: basicForm.value.mobilePhone,
            verifyCode: basicForm.value.verifyCode,
            oldMobilePhone: uiasUserInfo.value.mobilePhone
          }
          changePhone(params).then(res => {
            toast.show('手机号修改成功', 'success')
            userCommonStoreHook().setUiasUserInfo(Object.assign({}, uiasUserInfo.value, { mobilePhone: basicForm.value.mobilePhone }))
            goBack()
          })
        }
      }
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
