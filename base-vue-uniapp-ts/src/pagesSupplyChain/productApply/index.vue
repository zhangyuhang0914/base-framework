<template lang="pug">
.page-view
  Layout(showHeaderBar showBack headerBackground="#132B5B" statusBackground="#132B5B" headerColor="#FFFFFF" :headerTitle="parentProductInfo.name")
    template(#main)
      view.layoutMain
        scroll-view.scrollView(scroll-y)
          .banner-wrap(:style="{ background: `url(${previewImg('wx_supplyChain_productDetailBannerBg')})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }")
            .tips {{ parentProductInfo.tips }}
          .mainContainer
            .centerMain
              view.title {{productDetail.name}}
              view.upFormBox
                up-form(labelPosition="left" labelWidth='80' :model="basicForm" ref='basicFormRef')
                  up-form-item(label="机构名称" prop='institutionsInfoname')
                    up-input(v-model.trim="basicForm.institutionsInfoname" border='none' disabled)
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
                  //- up-button.u-default(
                  //-   type="default"
                  //-   text="清空"
                  //-   :customStyle="{marginBottom: '25rpx'}"
                  //-   @click="handleEmpty")
                  up-button.u-primary(
                    type="primary"
                    text="提交"
                    @click="handleSubmit")
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import { previewImg } from '@/util/utils'
import { ref, computed, onMounted, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { reportSaveData } from '@/api/servicesZone'
import { toast } from '@/common/uni-utils'
import { goBack, linkJump } from '@/common/common'
import { useCaptchaCode } from '@/hooks/common'
import { userCommonStoreHook } from '@/store/modules/common'
const parentProductInfo = ref({})
const productDetail = ref({})
const { sendBtnText, sendBtnDisabled, sendCode } = useCaptchaCode(90)
// 用户信息
let uiasUserInfo = computed(() => {
  return userCommonStoreHook().uiasUserInfo
})
let entInfo = computed(() => {
  return userCommonStoreHook().entInfo
})
let basicForm = ref({
  institutionsInfoId: '', // 机构
  institutionsInfoname: '', // 机构名称
  productId: '', // 产品 ID
  name: '', // 企业名称
  phone: '', // 手机
  contacts: '', // 联系人
  code: '' // 验证码
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

// 清空
const handleEmpty = () => {
  basicForm.value.code = ''
}
// 提交
const handleSubmit = async () => {
  if (await basicFormRef.value.validate()) {
    let params = Object.assign({}, basicForm.value, {
      uniscId: entInfo.value.entUnitCode,
      createdType: '2',
      demandSource: '1',
      // 0鄂融通 1小程序
      source: '1'
    })
    reportSaveData(params).then(res => {
      uni.showModal({
        title: '提示',
        content: '需求已提交，您可前往个人中心的供应链金融需求查看该申请的状态',
        showCancel: true,
        cancelText: '查看',
        confirmText: '确定',
        success: (result: UniApp.ShowModalRes) => {
          if (result.confirm) {
            goBack()
          } else {
            linkJump('/pagesUser/supplyChainFinanceRecord/index', () => {}, 'redirectTo')
          }
        }
      })
    })
  }
}
onLoad((options: AnyObject | undefined) => {
  let { parentProductInfo: parentProductInfoStr, productInfo: productInfoStr } = options ?? {}
  productDetail.value = JSON.parse(decodeURIComponent(productInfoStr) ?? '') ?? {}
  parentProductInfo.value = JSON.parse(decodeURIComponent(parentProductInfoStr) ?? '') ?? {}
  basicForm.value.institutionsInfoId = productDetail.value.finInstitutionsInfoId
  basicForm.value.institutionsInfoname = productDetail.value.institutionsName
  basicForm.value.productId = productDetail.value.id
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
