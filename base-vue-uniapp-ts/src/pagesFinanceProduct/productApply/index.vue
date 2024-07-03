<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#DAECFE" statusBackground="#DAECFE" headerTitle="金融产品")
    template(#main)
      .layout-main
        .main-container
          .product-apply-main
            scroll-view.scroll-view(scroll-y)
              .apply-main
                .header-apply(:style="{ backgroundImage: `url(${preview(imgConstant['wx_financeProduct_header-bg'])})`, backgroundSize: '100%', backgroundRpeat: 'no-repeat' }")
                  img.logo-img(:src="detailInfo.logoUrl" alt="")
                  .header-title-box
                    .title {{ detailInfo.name }}
                    .institutions-name {{ detailInfo.institutionsName }}
                .content-main
                  .loan-data
                    .loan-limit-box.c-column
                      .value {{ detailInfo.loanLimit }}
                      .label {{ '贷款额度' }}
                    .rate-range-box.c-column
                      .value {{ detailInfo.rateRange }}
                      .label {{ '参考利率(年化)' }}
                    .loan-period-box.c-column
                      .value {{ detailInfo.loanPeriod }}
                      .label {{ '贷款期限' }}
                    .guarantee-mode-box.c-column
                      .value {{ formatMode(detailInfo.guaranteeMode, guaranteeModeList, detailInfo.guaranteeModeExtra) }}
                      .label {{ '担保方式' }}
                  .product-info
                    CustomTitle(title="填写申请信息")
                    .product-apply-form
                      u--form.row-form(ref="productFormRef" :model="productForm" )
                        u-form-item.require(prop="entName" label="企业名称" labelWidth="75")
                          u--input(v-model.trim="productForm.entName" border="none" disabled placeholder="请输入企业名称")
                        u-form-item.require(prop="creditEvalAmount" label="需求金额" labelWidth="75")
                          u-input(v-model.trim="productForm.creditEvalAmount" border="none" placeholder="请输入需求金额")
                            template(#suffix)
                              .unit {{ '万元' }}
                        u-form-item.require(prop="loanPeriodEnd" label="贷款期限" v-if="type === '1'" labelWidth="75")
                          u--input(v-model.trim="productForm.loanPeriodEnd" type="number" border="none" placeholder="请输入贷款期限")
                        u-form-item.require(prop="remark" label="贷款用途" labelWidth="75")
                          up-textarea(v-model.trim="productForm.remark" placeholder="请输入贷款用途" border="none" maxlength="500" count autoHeight)
                        u-form-item.require(prop="guaranteeMode" label="担保方式" v-if="type === '1'" labelWidth="75")
                          CUniappPicker(ref="guaranteeModeRef" :defaultName="productForm.guaranteeModeName" :columns="guaranteeModeList" placeholder="请选择担保方式" @confirm="confirmHandle('guaranteeMode', $event)")
                        u-form-item.require(prop="loanRate" label="接受最高利率（年化）" v-if="type === '1'" labelWidth="75")
                          u--input(v-model.trim="productForm.loanRate" border="none" placeholder="请输入接受最高利率（年化）")
                        u-form-item.require(prop="repaymentWays" label="还款方式" labelWidth="75")
                          CUniappPicker(ref="repaymentWaysRef" :defaultName="productForm.repaymentWaysName" :columns="repaymentWaysList" placeholder="请选择还款方式" @confirm="confirmHandle('repaymentWays', $event)")
                        u-form-item.require(prop="contactMan" label="联系人" labelWidth="75")
                          u-input(v-model.trim="productForm.contactMan" border="none" placeholder="请输入联系人")
                            //- template(#suffix)
                            //-   .event-info(@click="contactBoxShow") {{ '修改联系人信息' }}
                        u-form-item.require(prop="phone" label="手机号码" labelWidth="75")
                          u--input(v-model.trim="productForm.phone" type="number" border="none" placeholder="请输入手机号码")
                        u-form-item.require(prop="code" label="验证码" labelWidth="75")
                          u-input(v-model.trim="productForm.code" type="number" border="none" placeholder="请输入验证码")
                            template(#suffix)
                              u-button(type="primary" :disabled="sendBtnDisabled" @click="sendPhoneCode") {{ sendBtnText }}
                        u-form-item.require(prop='licenseId' label="授权协议" labelWidth='75')
                          LicenseConfirm(:confirmData='confirmData' :licensedData="licensedData" @onLicenseConfirm='onLicenseConfirm')
                        u-form-item.require(prop='fileId' label="授权协议文件上传" labelWidth='140')
                          .formItemH50
                        UploadImage(@onChooseImage='onChooseImage')
                .footer-operation
                  u-button.larger-btn(type="primary" @click="submitHandle") {{ '提交' }}
            up-popup.contact-popup(:show="showContactDialog" mode="center"  @close="showContactDialog = false")
              .popup-header
                .title {{ '修改联系人信息' }}
                .popup-close(@click="showContactDialog = false")
                  u-icon(name="close")
              u--form.contact-form.row-form(ref="contactFormRef" :model="contactForm")
                u-form-item.require(prop="contacts" label="联系人" labelWidth="85px")
                  u--input(v-model.trim="contactForm.contacts" border="none" placeholder="请输入联系人")
                u-form-item.require(prop="contactsPhone" label="联系人电话" labelWidth="85px")
                  u--input(v-model.trim="contactForm.contactsPhone" border="none" placeholder="请输入联系人电话")
                u-form-item.require(prop="code" label="验证码" labelWidth="85px")
                  u-input(v-model.trim="contactForm.code" type="number" border="none" placeholder="请输入验证码")
                    template(#suffix)
                      u-button(type="primary" :disabled="sendBtnDisabled" @click="sendContactPhoneCode") {{ sendBtnText }}
              .popup-footer
                u-button.larger-btn(type="primary" @click="handleConfirmUpdate") {{ '立即修改' }}
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, type Ref, getCurrentInstance, nextTick } from 'vue'
import Layout from '@/components/layout/index.vue'
import CustomTitle from '@/components/custom-title/index.vue'
import CUniappPicker from '@/components/c-uniapp-picker/index.vue'
import LicenseConfirm from '@/components/licenseConfirm/index.vue'
import UploadImage from '@/components/uploadImage/index.vue'
import { formatMode } from '@/util/utils'
import { onLoad } from '@dcloudio/uni-app'
import { productInfo, productSaveCredit } from '@/api/financeProduct'
import type { ApiResponse } from '@/common/http/types'
import type { ProductListItem } from '@/api/financeProduct/types'
import { fileDownload } from '@/api/index'
import type { DictListItem } from '@/api/index/types'
import { userCommonStoreHook } from '@/store/modules/common'
import { useCaptchaCode } from '@/hooks/common'
import type { EntInfoType } from '@/api/common/types'
import { validateMobile } from '@/util/validator'
import { enterpriseUpdateContact } from '@/api/common'
import { goBack, linkJump } from '@/common/common'
import { preview } from '@/api/common/index'
import imgConstant from '@/common/imgConstant'

export default defineComponent({
  name: 'ProductApply',
  components: { Layout, CustomTitle, CUniappPicker, LicenseConfirm, UploadImage },
  setup(props) {
    const instance = getCurrentInstance()
    const commonStoreHook = userCommonStoreHook()
    const guaranteeModeList: Ref<DictListItem[]> = ref([]) // 担保方式
    const repaymentWaysList: Ref<DictListItem[]> = ref([]) // 还款方式
    const id: Ref<string> = ref('')
    const type: Ref<string> = ref('')
    const detailInfo: Ref<ProductListItem> = ref({} as ProductListItem)
    const guaranteeModeRef = ref()
    const repaymentWaysRef = ref()
    // 手机验证码
    const { sendBtnText, sendBtnDisabled, sendCode } = useCaptchaCode(90)
    const productFormRef = ref()
    const productForm = reactive({
      accredit: 0,
      entName: '',
      creditEvalAmount: '',
      loanPeriodEnd: '',
      remark: '',
      guaranteeMode: '',
      guaranteeModeName: '',
      loanRate: '',
      repaymentWays: '',
      repaymentWaysName: '',
      contactMan: '',
      phone: '',
      code: '',
      licenseId: '',
      fileId: ''
    })
    const productFormRules = reactive({
      entName: [{ required: true, message: '企业名称不能为空', trigger: 'blur' }],
      creditEvalAmount: [
        { required: true, message: '需求金额不能为空', trigger: 'blur' },
        {
          validator: (rule: AnyObject, value: string, callback: Function) => {
            if (value === '') {
              callback()
            }
            if (/^\d{1,7}(\.\d{1,2})?$/.test(value)) {
              callback()
            } else {
              callback(new Error('请输入正确的需求金额，最多保留两位小数点'))
            }
          },
          trigger: 'blur'
        }
      ],
      loanPeriodEnd: [
        { required: true, message: '贷款期限不能为空', trigger: 'blur' },
        {
          validator: (rule: AnyObject, value: string, callback: Function) => {
            if (value === '') {
              callback()
            }
            if (/^[1-9]+[0-9]*$/.test(value)) {
              callback()
            } else {
              callback(new Error('请输入正确的贷款期限'))
            }
          },
          trigger: 'blur'
        }
      ],
      remark: [{ required: true, message: '贷款用途不能为空', trigger: 'blur' }],
      guaranteeMode: [{ required: true, message: '担保方式不能为空', trigger: 'blur' }],
      loanRate: [
        { required: true, message: '最高利率（年化）不能为空', trigger: 'blur' },
        {
          validator: (rule: AnyObject, value: string, callback: Function) => {
            if (value === '') {
              callback()
            }
            if (/^\d+(\.\d{1,2})?$/.test(value)) {
              callback()
            } else {
              callback(new Error('请输入正确的最高利率（年化）'))
            }
          },
          trigger: 'blur'
        }
      ],
      repaymentWays: [{ required: true, message: '还款方式不能为空', trigger: 'blur' }],
      contactMan: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
      phone: [
        { required: true, message: '手机号码不能为空', trigger: 'blur' },
        { required: true, min: 11, message: '不能小于11位数', trigger: 'blur' },
        { required: true, max: 11, message: '不能大于11位数', trigger: 'blur' },
        { validator: validateMobile, trigger: 'blur' }
      ],
      code: [
        { required: true, message: '验证码不能为空', trigger: 'blur' },
        {
          validator: (rule: AnyObject, value: string, callback: Function) => {
            if (value === '') {
              callback()
            }
            if (/^\d+(\.\d{1,2})?$/.test(value)) {
              callback()
            } else {
              callback(new Error('请输入正确验证码'))
            }
          },
          trigger: 'blur'
        }
      ],
      licenseId: [{ required: true, message: '授权协议暂未确认', trigger: 'blur' }],
      fileId: [{ required: true, message: '授权协议文件不能为空', trigger: 'blur' }]
    })
    // 修改联系人
    const showContactDialog = ref(false)
    const contactFormRef = ref()
    const contactForm = reactive({
      contacts: '',
      contactsPhone: '',
      code: ''
    })
    const contactFormRules = reactive({
      contacts: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
      contactsPhone: [
        { required: true, message: '联系人电话不能为空', trigger: 'blur' },
        { required: true, min: 11, message: '不能小于11位数', trigger: 'blur' },
        { required: true, max: 11, message: '不能大于11位数', trigger: 'blur' },
        { validator: validateMobile, trigger: 'blur' }
      ],
      code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
    })
    // 获取产品详情
    const getProductDetail = () => {
      productInfo(id.value).then((result: ApiResponse<ProductListItem>) => {
        let data = result.data
        data['logoUrl'] = data.logoFileId && fileDownload(data.logoFileId)
        data['loanPeriod'] = data.loanPeriodBegin === 0 ? data.loanPeriodEnd + '个月及以下' : data.loanPeriodBegin + '-' + data.loanPeriodEnd + '个月'
        data['rateRange'] = data.rateRangeBegin + '%-' + data.rateRangeEnd + '%'
        data['loanLimit'] = data.loanLimitBegin + '~' + data.loanLimitEnd + '万元'
        data['isCollect'] = data.whetherCollection + '' === '0' ? true : false
        detailInfo.value = data
      })
    }
    // 获取担保方式
    const getGuaranteeMode = async () => {
      let result: DictListItem[] = await commonStoreHook.getDict('guarantee_type')
      guaranteeModeList.value = result
    }
    // 获取还款方式
    const getRepaymentWays = async () => {
      let result: DictListItem[] = await commonStoreHook.getDict('repayments')
      repaymentWaysList.value = result
    }
    // 选择框
    const confirmHandle = (type: string, events: AnyObject) => {
      switch (type) {
        case 'guaranteeMode':
          productForm.guaranteeMode = events.value
          productForm.guaranteeModeName = events.name
          productFormRef.value && productFormRef.value?.validateField('guaranteeMode')
          break
        case 'repaymentWays':
          productForm.repaymentWays = events.value
          productForm.repaymentWaysName = events.name
          productFormRef.value && productFormRef.value?.validateField('repaymentWays')
          break
        default:
          break
      }
    }
    // 发送验证码
    const sendPhoneCode = () => {
      if (!productForm.phone) {
        uni.$u.toast('请输入手机号码')
        return
      }
      productFormRef.value?.validateField(['phone'], async (valid: AnyObject) => {
        if (valid.length) return
        sendCode(productForm.phone, 'CommonSendSMS')
      })
    }
    // 显示修改联系人信息
    const contactBoxShow = () => {
      contactForm.code = ''
      showContactDialog.value = true
      // @ts-ignore
      instance?.proxy?.$refs.contactFormRef?.resetFields()
      nextTick(() => {
        // @ts-ignore
        instance?.proxy?.$refs.contactFormRef?.setRules(contactFormRules)
      })
    }
    // 修改联系人发送验证码
    const sendContactPhoneCode = () => {
      if (!contactForm.contactsPhone) {
        uni.$u.toast('请输入联系人电话')
        return
      }
      sendCode(contactForm.contactsPhone, 'CommonSendSMS')
    }
    // 修改联系人信息
    const handleConfirmUpdate = () => {
      contactFormRef.value
        .validate()
        .then((res: AnyObject) => {
          let params = {
            code: contactForm.code,
            contacts: contactForm.contacts,
            contactsPhone: contactForm.contactsPhone
          }
          enterpriseUpdateContact(params).then((result: ApiResponse<AnyObject>) => {
            let data = result.data
            // commonStoreHook.setToken(data.token)
            // commonStoreHook.setUiasUserInfo(data)
            // 更新联系人信息
            productForm.contactMan = data.contacts
            productForm.phone = data.contactsPhone
            uni.$u.toast('修改成功')
            showContactDialog.value = false
          })
        })
        .catch((error: Error) => {
          console.log('submit error!!!', error)
        })
    }
    // 确认授权对象
    const onLicenseConfirm = (licenseId: string) => {
      productForm.licenseId = licenseId
      productForm.accredit = 1
      productFormRef.value.validateField(['licenseId'], async (valid: AnyObject) => {
        if (valid.length) return
      })
    }
    // 上传盖章协议，仅支持上传图片
    const onChooseImage = (fileId: string) => {
      productForm.fileId = fileId
      productFormRef.value.validateField(['fileId'], async (valid: AnyObject) => {
        if (valid.length) return
      })
    }
    // 提交
    const submitHandle = () => {
      productFormRef.value
        .validate()
        .then((res: AnyObject) => {
          const maxLoanLimit = detailInfo.value.loanLimitEnd
          const requestedAmount = +productForm.creditEvalAmount
          requestedAmount > maxLoanLimit ? confirmSubmission() : submitSave()
        })
        .catch((error: Error) => {
          console.log('submit error!!!', error)
        })
      const confirmSubmission = () => {
        uni.showModal({
          content: `该产品最高可申请${detailInfo.value.loanLimitEnd}万元，您的需求是${productForm.creditEvalAmount}万元，确定提交申请吗？`,
          success: (result: UniApp.ShowModalRes) => {
            if (result.confirm) {
              submitSave()
            }
          }
        })
      }
      const submitSave = () => {
        let params = {
          accredit: productForm.accredit,
          cityCode: '',
          code: productForm.code,
          contactMan: productForm.contactMan || uiasUserInfo.value.name,
          creditEvalAmount: productForm.creditEvalAmount,
          entName: productForm.entName,
          fileId: productForm.fileId,
          fileUploadObj: [],
          finInstitutionsList: [],
          finInstitutionsName: detailInfo.value.institutionsName,
          finInstitutionsUniscID: detailInfo.value.institutionsUniscId,
          finLoanInquiryDataId: '', // 暂存数据id
          finLoanInstitutionsInfoId: '',
          finLoanInstitutionsInfoIds: type.value === '3' ? detailInfo.value.finInstitutionsInfoId : '', // 意向金融机构
          finLoanInstitutionsInfoIdsArr: type.value === '3' ? [detailInfo.value.finInstitutionsInfoId] : [],
          finLoanInstitutionsList: [],
          finProductInfoId: detailInfo.value.id,
          guaranteeMode: productForm.guaranteeMode,
          licenseId: productForm.licenseId,
          loanPeriodEnd: productForm.loanPeriodEnd,
          loanRate: productForm.loanRate,
          phone: productForm.phone,
          remark: productForm.remark,
          repaymentWays: productForm.repaymentWays,
          type: type.value || '1',
          uniscid: entInfo.value.entUnitCode,
          sourceType: 'wx' // 产品来源
        }
        productSaveCredit(params).then((result: ApiResponse<AnyObject>) => {
          uni.showModal({
            title: '提示',
            content: '融资申请已提交，您可前往个人中心的融资记录查看该申请的状态',
            showCancel: true,
            cancelText: '查看',
            confirmText: '确定',
            success: (result: UniApp.ShowModalRes) => {
              if (result.confirm) {
                goBack()
              } else {
                linkJump('/pagesUser/finance/index', () => {}, 'redirectTo')
              }
            }
          })
        })
      }
    }
    const uiasUserInfo = computed(() => {
      return commonStoreHook.uiasUserInfo
    })
    const entInfo = computed((): EntInfoType => {
      return commonStoreHook.entInfo
    })
    // 授权方
    const confirmData = computed(() => {
      return {
        entName: entInfo.value.entName,
        uniscId: entInfo.value.entUnitCode
      }
    })
    // 被授权方
    const licensedData = computed(() => {
      return {
        entName: detailInfo.value.institutionsName,
        uniscId: detailInfo.value.institutionsUniscId
      }
    })
    onMounted(() => {
      productForm.entName = entInfo.value.entName
      productForm.contactMan = uiasUserInfo.value.name
      productForm.phone = uiasUserInfo.value.mobilePhone
      productFormRef.value?.setRules(productFormRules)
      // 担保方式
      getGuaranteeMode()
      // 还款方式
      getRepaymentWays()
      // 产品详情
      getProductDetail()
    })
    onLoad((options: any) => {
      id.value = options.id || '79e463629999473d91c95a1c6e7948b9' || '2b88763c7107492ea2f4eb8e70ad30e1'
      type.value = options.value || '3'
    })
    return {
      preview,
      imgConstant,
      formatMode,
      entInfo,
      guaranteeModeList,
      repaymentWaysList,
      type,
      detailInfo,
      guaranteeModeRef,
      repaymentWaysRef,
      showContactDialog,
      contactFormRef,
      contactForm,
      sendBtnText,
      sendBtnDisabled,
      productFormRef,
      productForm,
      confirmData,
      licensedData,
      confirmHandle,
      sendPhoneCode,
      contactBoxShow,
      sendContactPhoneCode,
      handleConfirmUpdate,
      onLicenseConfirm,
      onChooseImage,
      submitHandle
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
