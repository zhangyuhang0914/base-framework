<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#132B5B" statusBackground="#132B5B" headerColor="#FFFFFF" headerTitle="融资详情")
    template(#main)
      .layout-main
        .event-content
          scroll-view.scroll-view(
            scroll-y
            :refresher-enabled='true'
            :refresher-triggered='refresherTriggered'
            @refresherrefresh='refresherrefresh'
          )
            .scroll-box(v-if="detailInfo && detailInfo.id")
              //- 申请信息
              .event-item
                .event-title
                  CustomTitle(title="我的申请")
                .event-detail
                  .detail-value
                    .label-long {{ '申请编号' }}
                    .value {{ detailInfo.inquiryCode || '无' }}
                  .detail-value
                    .label-long {{ '金融机构' }}
                    .value {{ detailInfo.chosenBankName || '无' }}
                  .detail-value
                    .label-long {{ '融资需求金额' }}
                    .value {{ fmtFinancingNeedsAmount(detailInfo.financingNeedsAmount) }}
                  .detail-value
                    .label-long {{ '申请人' }}
                    .value {{ detailInfo.createdUserName || '无' }}
                  .detail-value
                    .label-long {{ '申请时间' }}
                    .value {{ detailInfo.submitDateTime || '无' }}
                  .detail-value
                    .label-long {{ '申请平台' }}
                    .value {{ getDicValue(detailInfo.demandSource, platformDemandSourceList) }}
                  .detail-value
                    .label-long {{ '申请来源' }}
                    .value {{ getDicValue(detailInfo.resource, platformSourceList) }}
              //- 办理进度
              .event-item
                .event-title
                  CustomTitle(title="办理进度")
                .event-detail
                  up-steps(v-if="loadData" :current="steps.current" direction="column" activeColor="#4C5F99" inactiveColor="#EAEEFA")
                    up-steps-item(
                      v-for="(item, index) in steps.step"
                      :key="index"
                      :title="item.title"
                      :desc="item.formattedString"
                      :error="item.status === 'error'"
                    )
                      template(#icon)
                        .slot-icon(v-if="steps.current >= index && item.status === 'finish'" class="finish-icon")
                          u-icon(name="checkmark" color="#FFFFFF")
                        .slot-icon(v-else-if="item.status === 'error'" class="error-icon")
                          u-icon(name="close" color="#EF3737")
                        .slot-icon(v-else class="inactive-icon") {{ index + 1 }}
                  .no-data-view(v-else)
                    CNoData
              //- 申请详情
              .event-item
                .event-title
                  CustomTitle(title="申请详情")
                .event-detail
                  .detail-value
                    .label {{ '企业名称' }}
                    .value {{ detailInfo.entName || '无' }}
                  .detail-value
                    .label {{ '融资需求金额' }}
                    .value {{ fmtFinancingNeedsAmount(detailInfo.financingNeedsAmount) }}
                  .detail-value
                    .label {{ '担保方式' }}
                    .value {{ formatMode(detailInfo.guaranteeMode, guaranteeModeList) }}
                  .detail-value
                    .label {{ '贷款利率' }}
                    .value {{ `${detailInfo.rateRangeBegin}%` }}
                  .detail-value
                    .label {{ '贷款期限' }}
                    .value {{ `${detailInfo.loanPeriodBegin || 0}~${detailInfo.loanPeriodEnd || 0}` }}
                  .detail-value
                    .label {{ '放款方式' }}
                    .value {{ REPAYMENT_METHOD_MAP[detailInfo.repaymentWays] || '无' }}
                  .detail-value
                    .label {{ '联系人' }}
                    .value {{ detailInfo.linkManName || '无' }}
                  .detail-value
                    .label {{ '联系电话' }}
                    .value.phone-value(@click="callPhoneClick") {{ phoneStatus ? detailInfo.showPhone || '无' : detailInfo.phone || '无' }}
                    up-icon.icon(
                      v-if="detailInfo.phone"
                      :name="phoneStatus ? 'eye-off' : 'eye'"
                      color="#132B5B"
                      size="26"
                      @click="phoneStatus = !phoneStatus"
                    )
                  .detail-value
                    .label {{ '产品名称' }}
                    .value {{ detailInfo.productName || '无' }}
                  .detail-value
                    .label {{ '贷款用途' }}
                    .value {{ detailInfo.purpose || '无' }}
                .operation-box
                  u-button.u-primary-btn(
                    type="primary"
                    v-if="((isAgentPerson || detailInfo.tbUserId === uiasUserInfo.tbUserId) && !(detailInfo.state !== '1' || detailInfo.resource !== '1' || detailInfo.acceptStatus !== '0')) && detailInfo.state !== '2'"
                    @click="cancelFinanceRecordClick()") {{ '取消申请' }}
            .no-data-view(v-else)
              CNoData
          CancelForm(
            ref="cancelFormRef"
            title="取消融资申请"
            :isVerifySMSCode="true"
            :showCancelModal="showCancelModal"
            :cancelApplyForm="cancelApplyForm"
            @confirm="cancelFormConfirm"
            @cancel="cancelModalCancel"
          )
</template>

<script lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { defineComponent, ref, onMounted, type Ref, computed } from 'vue'
import Layout from '@/components/layout/index.vue'
import CustomTitle from '@/components/custom-title/index.vue'
import CancelForm from '@/pagesUser/financeRecord/cancelForm/index.vue'
import CNoData from '@/components/c-no-data/index.vue'
import { financeRecordDetail } from '@/api/user'
import type { ApiResponse } from '@/common/http/types'
import type { DictListItem } from '@/api/index/types'
import { userCommonStoreHook } from '@/store/modules/common'
import { formatMode, getDicValue } from '@/util/utils'
import { FinancingRecordListItem } from '@/api/user/type'
import Bus, { FINANCE_RECORD_STATUS_REFRESH } from '@/common/bus'
import { useCancelFinanceRecord } from '@/common/common'
import { useCallPhone } from '@/hooks/common'

export default defineComponent({
  name: 'FinanceDetail',
  components: { Layout, CustomTitle, CancelForm, CNoData },
  setup(props) {
    const id = ref<string>('')
    const finCreditInquiryId = ref<string>('')
    const detailInfo: Ref<FinancingRecordListItem | null> = ref<FinancingRecordListItem | null>(null)
    const loadData = ref(false)
    // 下拉刷新状态
    const refresherTriggered = ref<boolean>(false)
    const platformDemandSourceList: Ref<DictListItem[]> = ref([]) // 申请平台
    const platformSourceList: Ref<DictListItem[]> = ref([]) // 申请来源
    const guaranteeModeList: Ref<DictListItem[]> = ref([]) // 担保方式
    const phoneStatus: Ref<boolean> = ref(true)
    const REPAYMENT_METHOD_MAP = {
      0: '不限',
      1: '等额本金',
      2: '等额本息',
      3: '等本等息',
      4: '先息后本',
      5: '一次性还本付息',
      6: '随借随还',
      99: '其他'
    }
    // 办理进度
    const steps = ref({
      current: 0,
      step: [
        {
          title: '申请',
          date: '',
          describe: '已完成',
          formattedString: '',
          status: 'finish'
        },
        {
          title: '受理'
        },
        {
          title: '授信'
        },
        {
          title: '放款'
        }
      ]
    })
    // 当前用户是否是经办人
    const cancelFormRef = ref(null)
    const { isAgentPerson, showCancelModal, cancelApplyForm, init, cancelApplyClick, cancelInquiryinfoDemandCancel, clearCancelApplyForm } = useCancelFinanceRecord()
    // 获取申请平台
    const getDemandSource = async () => {
      const result: DictListItem[] = await userCommonStoreHook().getDict('platform_demandSource')
      platformDemandSourceList.value = result
    }
    // 获取申请来源
    const getPlatformSource = async () => {
      const result: DictListItem[] = await userCommonStoreHook().getDict('platform_source')
      platformSourceList.value = result
    }
    // 获取担保方式
    const getGuaranteeMode = async () => {
      const result: DictListItem[] = await userCommonStoreHook().getDict('guarantee_type')
      guaranteeModeList.value = result
    }
    // 下拉刷新
    const refresherrefresh = () => {
      refresherTriggered.value = true
      console.log('下拉刷新', refresherTriggered.value)
      getFinanceRecordDetail(finCreditInquiryId.value, (data: AnyObject) => {
        doCalculation(data)
      })
    }
    // 获取融资记录详情
    const getFinanceRecordDetail = (id: string, callBack?: Function) => {
      financeRecordDetail(id)
        .then((result: ApiResponse<FinancingRecordListItem>) => {
          let data = result.data
          if (data.linkManNamePhone) {
            data['showPhone'] = data.linkManNamePhone.replace(data.linkManNamePhone.substr(4, 4), '****')
          }
          if (data.financingNeedsAmount) {
            data['financingNeedsAmount'] = parseFloat(data.financingNeedsAmount).toFixed(2)
          }
          detailInfo.value = data
          callBack && callBack(data)
        })
        .finally(() => {
          refresherTriggered.value = false
          console.log('finally', refresherTriggered.value)
        })
    }
    // 处理办理进度
    const doCalculation = (data: AnyObject) => {
      // 深拷贝 steps 避免直接修改原对象
      const stepsCopy = JSON.parse(JSON.stringify(steps.value))
      const setStep = (index: number, date: string, describe?: string, status?: string) => {
        stepsCopy.step[index].date = date || ''
        stepsCopy.step[index].describe = describe || ''
        stepsCopy.step[index].formattedString = `${stepsCopy.step[index].date}\n${stepsCopy.step[index].describe}`
        if (status) stepsCopy.step[index].status = status
      }
      //已申请
      setStep(0, data.applyTime)
      //申请时需求取消
      if (detailInfo.value?.state && detailInfo.value.state === '2') {
        setStep(0, detailInfo.value?.updatedTime, detailInfo.value.updateUserName ? `由${detailInfo.value.updateUserName}取消` : '已取消', 'error')
      }
      //已受理
      if (detailInfo.value?.acceptStatus === '1') {
        setStep(1, data.acceptTime, data.acceptContent, 'finish')
        stepsCopy.current = 1
      } else if (detailInfo.value?.acceptStatus === '2') {
        setStep(1, data.acceptTime, data.acceptContent, 'error')
        stepsCopy.current = 1
      }
      //已授权
      if (detailInfo.value?.creditEvalStatus === '1') {
        setStep(2, data.creditEvalTime, `${data.creditEvalContent || ''}\n授信金额${data.creditEvalAmount || ''}万元`, 'finish')
        setStep(3, data.creditEvalTime, `放款金额${data.creditLoanAmount || ''}万元`, 'finish')
        stepsCopy.current = 4
      } else if (detailInfo.value?.creditEvalStatus === '2') {
        setStep(2, data.creditEvalTime, data.creditEvalContent, 'error')
        stepsCopy.current = 2
      }
      steps.value = stepsCopy
      loadData.value = true
      console.log('steps', steps.value, detailInfo.value, data)
    }
    // 融资金额
    const fmtFinancingNeedsAmount = (value: string) => {
      return `${value ? parseFloat(value).toFixed(2) : '0'}万元`
    }
    // 取消申请
    const cancelFinanceRecordClick = () => {
      detailInfo.value && cancelApplyClick(id.value, finCreditInquiryId.value, detailInfo.value)
    }
    // 确认取消弹框事件
    const cancelFormConfirm = () => {
      cancelInquiryinfoDemandCancel(false)
    }
    // 关闭取消融资申请回调
    const cancelModalCancel = () => {
      showCancelModal.value = false
      clearCancelApplyForm()
    }
    // 拨打手机号
    const callPhoneClick = () => {
      useCallPhone(
        phoneStatus.value ? '' : (detailInfo.value?.linkManNamePhone as string),
        () => {},
        error => {
          console.log('error', error)
        }
      )
    }
    // 用户信息
    const uiasUserInfo = computed(() => {
      return userCommonStoreHook().uiasUserInfo
    })
    onMounted(() => {
      getDemandSource()
      getPlatformSource()
      getGuaranteeMode()
      init()
    })
    // 隐藏小程序后会自动销毁
    onShow(() => {
      Bus.$on(FINANCE_RECORD_STATUS_REFRESH, () => {
        getFinanceRecordDetail(finCreditInquiryId.value, (data: AnyObject) => {
          doCalculation(data)
        })
      })
    })
    onLoad((options: any) => {
      id.value = options.id ?? ''
      finCreditInquiryId.value = options.finCreditInquiryId ?? ''
      getFinanceRecordDetail(finCreditInquiryId.value, (data: FinancingRecordListItem) => {
        doCalculation(data)
      })
    })
    return {
      formatMode,
      uiasUserInfo,
      detailInfo,
      loadData,
      refresherTriggered,
      platformDemandSourceList,
      platformSourceList,
      guaranteeModeList,
      phoneStatus,
      REPAYMENT_METHOD_MAP,
      steps,
      isAgentPerson,
      cancelFormRef,
      showCancelModal,
      cancelApplyForm,
      getDicValue,
      refresherrefresh,
      fmtFinancingNeedsAmount,
      cancelFinanceRecordClick,
      cancelFormConfirm,
      cancelModalCancel,
      callPhoneClick
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
