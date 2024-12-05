<template lang="pug">
.page-wrap
  .main-box
    .suspend-view
      .micro-dialog__title {{ '企业注册' }}
      .micro-dialog__sub-title {{ '（仅限企业法人注册）' }}
      .custom-register-wrap
        vanForm.custom-van-form.register-form(ref="registerFormRef" label-width="130px" show-error :show-error-message="false")
          vanCellGroup(inset)
            vanField.custom-block-input(
              v-model="registerForm.enterpriseName"
              name="enterpriseName"
              label="企业名称"
              placeholder="请输入企业名称"
              :rules="getRules('enterpriseName')")
            vanField.custom-block-input(
              v-model="registerForm.uscc"
              name="uscc"
              label="统一社会信用代码"
              placeholder="请输入统一社会信用代码"
              :rules="getRules('uscc')")
            vanField.custom-block-input(
              v-model="registerForm.contactPerson"
              name="contactPerson"
              label="联系人"
              placeholder="请输入联系人"
              :rules="getRules('contactPerson')")
            vanField.custom-block-input(
              v-model="registerForm.contactPhone"
              type="digit"
              name="contactPhone"
              label="联系电话"
              placeholder="请输入联系电话"
              :rules="getRules('contactPhone')")
            vanField.custom-block-input
              template(#input)
                vanButton.submit-btn(type="primary" native-type="button" @click="handleRegisterAndSubmit") {{ '注册并登录' }}
</template>

<script lang="ts">
import { microEnterpriseRegister } from '@/api/common'
import type { MicroEnterpriseRegisterParamType } from '@/api/model'
import type { ApiResponse } from '@/common/http/types'
import { $toast } from '@/plugins/vant'
import { validateMobile } from '@/utils/validator'
import type { FormInstance } from 'vant'
import { defineComponent, reactive, ref } from 'vue'

export default defineComponent({
  name: 'Register',
  setup(props) {
    const registerFormRef = ref<FormInstance>()
    const registerForm = reactive({
      enterpriseName: '',
      uscc: '',
      contactPerson: '',
      contactPhone: ''
    })
    const getRules = (type: keyof typeof registerForm) => {
      const rules = {
        enterpriseName: [{ required: true, message: '请输入企业名称' }],
        uscc: [{ required: true, message: '请输入统一社会信用代码' }],
        contactPerson: [{ required: true, message: '请输入联系人' }],
        contactPhone: [{ required: true, message: '请输入联系电话' }, { validator: validateMobile }]
      }
      return rules[type]
    }
    // 重置表单
    const resetForm = () => {
      registerFormRef.value?.resetValidation()
      registerForm.enterpriseName = ''
      registerForm.uscc = ''
      registerForm.contactPerson = ''
      registerForm.contactPhone = ''
    }
    // 注册并登录
    const handleRegisterAndSubmit = () => {
      registerFormRef.value
        ?.validate()
        .then(result => {
          const params: MicroEnterpriseRegisterParamType = {
            ...registerForm
          }
          microEnterpriseRegister(params)
            .then((result: ApiResponse<null>) => {
              $toast('注册成功')
              resetForm()
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
      registerFormRef,
      registerForm,
      validateMobile,
      getRules,
      handleRegisterAndSubmit
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
