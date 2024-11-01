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
              .register-wrap
                u--form(ref="basicFormRef" v-if="step === 0" :model="basicForm")
                  u-form-item(prop="username")
                    span.item-label {{ '姓名' }}
                    u--input(v-model="basicForm.username" border="none" placeholder="请输入姓名")
                  u-form-item(prop="idCard")
                    span.item-label {{ '身份证号码' }}
                    u--input(v-model="basicForm.idCard" border="none" placeholder="请输入身份证号码")
                  u-form-item(prop="certEffDate")
                    span.item-label {{ '证件有效起始时间' }}
                    u-input(v-model="basicForm.certEffDate" readonly border="none" placeholder="请选择")
                      template(#suffix)
                        span.suffix-right(@click="selectDateClick") {{ '选择' }}
                    .mask-click(@click="selectDateClick")
                  u-form-item(prop="idValidityPeriod")
                    span.item-label {{ '证件有效期' }}
                    CUniappPicker(ref="idValidityPeriodRef" :defaultName="basicForm.idValidityPeriodName" :columns="selectData" keyName="text" placeholder="请选择" @confirm="onChangeSelect")
                  u-form-item(prop="phone")
                    span.item-label {{ '手机号码' }}
                    u--input(v-model="basicForm.phone" type="number" border="none" placeholder="请输入手机号码")
                  u-form-item(prop="vericode")
                    span.item-label {{ '验证码' }}
                    u-input.captcha-input(v-model="basicForm.vericode" type="number" border="none" placeholder="请输入短信验证码")
                      template(#suffix)
                        u-button.send-code-btn(type="primary" :disabled="sendBtnDisabled" @click="sendPhoneCode") {{ sendBtnText }}
                u--form(ref="passwordFormRef" v-else :model="passwordForm")
                  u-form-item(prop="password")
                    span.item-label {{ '密码设置' }}
                    u--input(v-model="passwordForm.password" password border="none" placeholder="包含8-18位大小写字母和数字的密码")
                  u-form-item(prop="confirmPassword")
                    span.item-label {{ '确认密码' }}
                    u--input(v-model="passwordForm.confirmPassword" password border="none" placeholder="请再次输入密码")
                .footer-opeartion
                  u-button.larger-btn.u-primary(type="primary" v-if="step === 0" @click="nextStepHandle") {{ '下一步' }}
                  u-button.larger-btn.u-info-btn(type="primary" v-if="step === 1" @click="prevStepHandle") {{ '上一步' }}
                  u-button.larger-btn.u-primary(type="primary" v-if="step === 1" @click="registerFn") {{ '注 册' }}
              .c-footer
                .header-tips
                  p.txt {{ '温馨提示：' }}
                  p.txt {{ '注册成功后将与湖北省统一身份认证平台实现账号数据互通。' }}
                .footer-tips
                  p.txt {{ '本服务由湖北省统一身份认证平台提供' }}
          u-datetime-picker(
            :show="datePickerShow"
            v-model="datePicker"
            mode="date"
            :maxDate="Date.now()"
            :minDate="Number(new Date('1900-01-01'))"
            closeOnClickOverlay
            @cancel="datePickerShow = false"
            @confirm="onDatePickerConfirm")
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, nextTick, onMounted, reactive, ref, type Ref } from 'vue'
import Layout from '@/components/layout/index.vue'
import CUniappPicker from '@/components/c-uniapp-picker/index.vue'
import { previewImg } from '@/util/utils'
import { useCaptchaCode } from '@/hooks/common'
import { checkIdCard, validateMobile, validatePassword } from '@/util/validator'
import { uiasRegisterUserInfoStep } from '@/api/common/index'
import type { UiasRegisterParam } from '@/api/common/types'
import type { ApiResponse } from '@/common/http/types'
import myEncrypt from '@/util/encrypt'
import { linkJump } from '@/common/common'

interface SelectPeriodItem {
  value: string
  text: string
}
export default defineComponent({
  name: 'RegisterPage',
  components: { Layout, CUniappPicker },
  setup(props) {
    const instance = getCurrentInstance()
    const step: Ref<number> = ref(0)
    const { sendBtnText, sendBtnDisabled, sendCode } = useCaptchaCode(90)
    const basicFormRef: AnyObject = ref(null)
    const basicForm = reactive({
      username: '',
      idCard: '',
      certEffDate: '',
      idValidityPeriod: '',
      idValidityPeriodName: '',
      phone: '',
      vericode: ''
    })
    const basicFormRules = reactive({
      username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
      idCard: [
        { required: true, message: '身份证号码不能为空', trigger: 'blur' },
        { required: true, min: 18, message: '不能小于18位数', trigger: 'blur' },
        { required: true, max: 18, message: '不能大于18位数', trigger: 'blur' },
        { validator: checkIdCard, trigger: 'blur' }
      ],
      certEffDate: [{ required: true, message: '证件有效起始时间不能为空', trigger: 'blur' }],
      idValidityPeriod: [{ required: true, message: '证件有效期不能为空', trigger: 'blur' }],
      phone: [
        { required: true, message: '手机号码不能为空', trigger: 'blur' },
        { required: true, min: 11, message: '不能小于11位数', trigger: 'blur' },
        { required: true, max: 11, message: '不能大于11位数', trigger: 'blur' },
        { validator: validateMobile, trigger: 'blur' }
      ],
      vericode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
    })
    const passwordFormRef: AnyObject = ref(null)
    const passwordForm = reactive({
      password: '',
      confirmPassword: ''
    })
    // 确认密码校验
    const forgotValidatePassSure = (rule: AnyObject, value: string, callback: Function) => {
      if (value !== passwordForm.password) {
        callback(new Error('两次输入密码不一致！'))
      } else {
        callback()
      }
    }
    const passwordFormRules = reactive({
      password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { validator: validatePassword, trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '确认密码不能为空', trigger: 'blur' },
        { validator: forgotValidatePassSure, trigger: 'blur' }
      ]
    })
    const datePickerShow = ref(false)
    const datePicker = ref(Date.now())
    const selectData: SelectPeriodItem[] = reactive([
      {
        value: '5',
        text: '5年'
      },
      {
        value: '10',
        text: '10年'
      },
      {
        value: '20',
        text: '20年'
      },
      {
        value: '99',
        text: '长期有效'
      }
    ])
    const selectDateClick = () => {
      datePickerShow.value = true
    }
    const onDatePickerConfirm = (date: AnyObject) => {
      if (!date.value) return
      basicForm.certEffDate = formatterDate(date.value)
      basicFormRef.value?.validateField('certEffDate')
      datePickerShow.value = false
    }
    const formatterDate = (timestamp: number) => {
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    const onChangeSelect = (events: AnyObject) => {
      basicForm.idValidityPeriod = events.value
      basicForm.idValidityPeriodName = events.text
      basicFormRef.value && basicFormRef.value?.validateField('idValidityPeriod')
    }
    const nextStepHandle = async () => {
      basicFormRef.value
        .validate()
        .then((res: AnyObject) => {
          step.value = 1
          nextTick(() => {
            // @ts-ignore
            instance?.proxy?.$refs.passwordFormRef?.setRules(passwordFormRules)
          })
        })
        .catch((error: Error) => {
          console.log('submit error!!!', error)
        })
    }
    const prevStepHandle = () => {
      step.value = 0
      nextTick(() => {
        // @ts-ignore
        instance?.proxy?.$refs.basicFormRef?.setRules(basicFormRules)
      })
    }
    // 发送短信验证码
    const sendPhoneCode = async () => {
      if (!basicForm.phone) {
        uni.$u.toast('请输入手机号码')
        return
      }
      basicFormRef.value?.validateField(['phone'], async (valid: AnyObject) => {
        if (valid.length) return
        sendCode(basicForm.phone, 'UiasSendSMSForRegActive')
      })
    }
    const registerFn = () => {
      passwordFormRef.value
        .validate()
        .then((res: AnyObject) => {
          let encryptPwd = JSON.parse(JSON.stringify(passwordForm.password))
          let params: UiasRegisterParam = {
            mobilePhone: basicForm.phone,
            password: myEncrypt(encryptPwd),
            name: basicForm.username,
            idCard: basicForm.idCard,
            vericode: basicForm.vericode,
            certEffDate: basicForm.certEffDate,
            idValidityPeriod: basicForm.idValidityPeriod === '99' ? '' : basicForm.idValidityPeriod
          }
          uiasRegisterUserInfoStep(params).then((result: ApiResponse<AnyObject>) => {
            linkJump('/pagesCommon/login/index', () => {
              uni.$u.toast(result.msg || '注册成功')
            })
          })
        })
        .catch((error: Error) => {
          console.log('submit error!!!', error)
        })
    }
    onMounted(() => {
      basicFormRef.value?.setRules(basicFormRules)
    })
    return {
      previewImg,
      step,
      sendBtnText,
      sendBtnDisabled,
      basicFormRef,
      basicForm,
      passwordFormRef,
      passwordForm,
      datePickerShow,
      datePicker,
      selectData,
      selectDateClick,
      onDatePickerConfirm,
      onChangeSelect,
      nextStepHandle,
      prevStepHandle,
      registerFn,
      sendPhoneCode
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
