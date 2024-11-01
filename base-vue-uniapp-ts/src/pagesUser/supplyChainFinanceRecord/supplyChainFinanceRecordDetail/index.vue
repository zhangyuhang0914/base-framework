<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#132B5B" statusBackground="#132B5B" headerColor="#FFFFFF" headerTitle="供应链金融需求详情")
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
              //- 基本信息
              .event-item
                .event-title
                  CustomTitle(title="基本信息")
                .event-detail
                  .detail-value
                    .label-long {{ '金融机构' }}
                    .value {{ detailInfo.institutionsInfoName || '无' }}
                  .detail-value
                    .label-long {{ '产品名称' }}
                    .value {{ detailInfo.productName || '无' }}
                  .detail-value
                    .label-long {{ '联系人' }}
                    .value {{ detailInfo.contacts || '无' }}
                  .detail-value
                    .label-long {{ '联系电话' }}
                    .value.phone-value(@click="callPhoneClick(phoneStatus ? '' : detailInfo.phone)") {{ phoneStatus ? detailInfo.showPhone || '无' : detailInfo.phone || '无' }}
                    up-icon.icon(
                      v-if="detailInfo.phone"
                      :name="phoneStatus ? 'eye-off' : 'eye'"
                      color="#132B5B"
                      size="26"
                      @click="phoneStatus = !phoneStatus"
                    )
                  .detail-value
                    .label-long {{ '申请人' }}
                    .value {{ detailInfo.createdUserName || '无' }}
                  .detail-value
                    .label-long {{ '申请时间' }}
                    .value {{ detailInfo.createdTime || '无' }}
                  .detail-value
                    .label-long {{ '申请平台' }}
                    .value {{ getDicValue(detailInfo.demandSource, demandSourceList) }}
                  .detail-value
                    .label-long {{ '当前进度' }}
                    .value(:class="getStatusClass(detailInfo.state)") {{ getDicValue(detailInfo.state, dockingStatusList) }}
                  .detail-value(v-if="detailInfo.state === '4'")
                    .label-long {{ '由谁取消' }}
                    .value {{ detailInfo.updateUserName || '无' }}
                  .detail-value(v-if="detailInfo.state === '4'")
                    .label-long {{ '取消时间' }}
                    .value {{ detailInfo.updatedTime || '无' }}
                .operation-box(v-if="detailInfo.dockingState !== '0' || detailInfo.dockingState !== '1'")
                  u-button.u-primary-btn(
                    type="primary"
                    v-if="(isAgentPerson || detailInfo.tbUserId === uiasUserInfo.tbUserId) && !(detailInfo.state !== '0')"
                    @click="cancelFinanceRecordClick()") {{ '取消对接' }}  
              //- 需求反馈
              .event-item(v-if="detailInfo.dockingState === '0' || detailInfo.dockingState === '1'")
                .event-title
                  CustomTitle(title="需求反馈")
                .event-detail
                  .detail-value
                    .label {{ '客户经理' }}
                    .value {{ detailInfo.managerName || '无' }}
                  .detail-value
                    .label {{ '联系电话' }}
                    .value.phone-value(@click="callPhoneClick(managerPhoneStatus ? '' : detailInfo.managerPhone)") {{ managerPhoneStatus ? detailInfo.showManagerPhone || '无' : detailInfo.managerPhone || '无' }}
                    up-icon.icon(
                      v-if="detailInfo.managerPhone"
                      :name="managerPhoneStatus ? 'eye-off' : 'eye'"
                      color="#132B5B"
                      size="26"
                      @click="managerPhoneStatus = !managerPhoneStatus"
                    )
                  .detail-value
                    .label {{ '放款金额' }}
                    .value {{ `${detailInfo.loanAmount || 0}万元` }}
                  .detail-value
                    .label {{ '反馈内容' }}
                    .value {{ detailInfo.content || '无' }}
            .no-data-view(v-else)
              CNoData
          CancelForm(
            ref="cancelFormRef"
            title="取消对接申请"
            :showCancelModal="showCancelModal"
            :cancelApplyForm="cancelApplyForm"
            @confirm="cancelFormConfirm"
            @cancel="cancelModalCancel"
          )
</template>

<script lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { defineComponent, ref, onMounted, type Ref, computed } from 'vue'
import Layout from '@/components/layout/index.vue'
import CustomTitle from '@/components/custom-title/index.vue'
import CancelForm from '@/pagesUser/financeRecord/cancelForm/index.vue'
import CNoData from '@/components/c-no-data/index.vue'
import { supplyChainDockingDetail } from '@/api/user'
import type { ApiResponse } from '@/common/http/types'
import type { DictListItem } from '@/api/index/types'
import { userCommonStoreHook } from '@/store/modules/common'
import { getDicValue } from '@/util/utils'
import { SupplyChainListItem } from '@/api/user/type'
import Bus, { SUPPLY_CHAIN_FINANCE_RECORD_STATUS_REFRESH } from '@/common/bus'
import { useCancelSupplyChainFinanceRecord } from '@/common/common'
import { useCallPhone } from '@/hooks/common'

export default defineComponent({
  name: 'SupplyChainFinanceRecordDetail',
  components: { Layout, CustomTitle, CancelForm, CNoData },
  setup(props) {
    const id = ref<string>('')
    const detailInfo: Ref<SupplyChainListItem | null> = ref<SupplyChainListItem | null>(null)
    const phoneStatus: Ref<boolean> = ref(true)
    const managerPhoneStatus: Ref<boolean> = ref(true)
    const loadData = ref(false)
    // 下拉刷新状态
    const refresherTriggered = ref<boolean>(false)
    const demandSourceList: Ref<DictListItem[]> = ref([]) // 申请平台来源
    const dockingStatusList = ref<DictListItem[]>([]) // 需求状态
    const { isAgentPerson, cancelFormRef, showCancelModal, cancelApplyForm, init, cancelApplyClick, cancelSupplyChainDockingUpdateCancel, clearCancelApplyForm } = useCancelSupplyChainFinanceRecord()
    // 获取申请平台
    const getDemandSource = async () => {
      const result: DictListItem[] = await userCommonStoreHook().getDict('demandSource')
      demandSourceList.value = result
    }
    // 获取需求状态
    const getDockingStatus = async () => {
      dockingStatusList.value = []
      const result: DictListItem[] = await userCommonStoreHook().getDict('dockingStatus')
      dockingStatusList.value = result
    }
    // 下拉刷新
    const refresherrefresh = () => {
      refresherTriggered.value = true
      console.log('下拉刷新', refresherTriggered.value)
      getSupplyChainDockingDetail(id.value)
    }
    // 获取融资记录详情
    const getSupplyChainDockingDetail = (id: string) => {
      supplyChainDockingDetail(id)
        .then((result: ApiResponse<SupplyChainListItem>) => {
          let data = result.data
          if (data.phone) {
            data['showPhone'] = data.phone.replace(data.phone.substr(4, 4), '****')
          }
          if (data.managerPhone) {
            data['showManagerPhone'] = data.managerPhone.replace(data.managerPhone.substr(4, 4), '****')
          }
          detailInfo.value = data
        })
        .finally(() => {
          refresherTriggered.value = false
          console.log('finally', refresherTriggered.value)
        })
    }
    /**
     * 状态样式
     * @param state 状态
     * @param 待对接: 0
     * @param 对接中: 1
     * @param 对接失败: 2
     * @param 对接成功: 3
     * @param 对接取消: 4
     */
    const getStatusClass = (state: string) => {
      if (state === '' || state === null || state === undefined) return
      let statusClass: AnyObject = {
        '0': 'primary-value',
        '1': 'warningy-value',
        '2': 'dangery-value',
        '3': 'successy-value',
        '4': 'info-value'
      }
      console.log('getStatusClass', statusClass[state])
      return statusClass[state]
    }
    // 取消申请
    const cancelFinanceRecordClick = () => {
      detailInfo.value && cancelApplyClick(detailInfo.value)
    }
    // 确认取消弹框事件
    const cancelFormConfirm = () => {
      cancelSupplyChainDockingUpdateCancel(false)
    }
    // 关闭取消融资申请回调
    const cancelModalCancel = () => {
      showCancelModal.value = false
      clearCancelApplyForm()
    }
    // 拨打手机号
    const callPhoneClick = (phone: string) => {
      useCallPhone(
        phone,
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
      getDockingStatus()
      getSupplyChainDockingDetail(id.value)
      init()
      Bus.$on(SUPPLY_CHAIN_FINANCE_RECORD_STATUS_REFRESH, () => {
        getSupplyChainDockingDetail(id.value)
      })
    })
    onLoad((options: any) => {
      id.value = options.id ?? ''
    })
    return {
      uiasUserInfo,
      detailInfo,
      phoneStatus,
      managerPhoneStatus,
      loadData,
      refresherTriggered,
      demandSourceList,
      dockingStatusList,
      isAgentPerson,
      cancelFormRef,
      showCancelModal,
      cancelApplyForm,
      getDicValue,
      refresherrefresh,
      getStatusClass,
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
