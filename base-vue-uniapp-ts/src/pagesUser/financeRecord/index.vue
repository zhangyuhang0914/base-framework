<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#132B5B" statusBackground="#132B5B" headerColor="#FFFFFF" headerTitle="融资记录")
    template(#main)
      .finance-record-wrap
        .finance-header
          .search-input
            up-search(v-model="queryForm.searchValue" placeholder="请输入金融机构名称" @search="searchHandle" :show-action="false" shape="square" :animation="true" :clearabled="false")
            .search-btn(@click="searchHandle") {{ '搜索' }}
          u-button.filter-btn(type="primary" :class="isFinanceRecordFilter ? 'u-active-filter-btn' : 'u-default-filter-btn'" @click="isFinanceRecordFilter = !isFinanceRecordFilter") {{ '我的' }}
        view.layoutMain
          .filter-container
            picker.filter-box(:value="demandSourcePIndex" :range="demandSourceRange" @change="demandSourceConfirm" @cancel="cancel('demandSource')")
              .filter-select(:class="{ 'active-select': queryForm.demandSource }" @click="filterHandle('demandSource')")
                .text {{ '申请平台' }}
                u-icon.icon(:name="filterIconStatus.demandSource ? 'arrow-up' : 'arrow-down'" size="14" color="#88929E")
            .filter-box
              uni-datetime-picker(v-model="queryForm.applyDate" type="daterange" :start="dateFormatter(new Date('2000-01-01'))" :end="dateFormatter(Date.now())" @show="applyDateShow" @change="applyDateChange" @maskClick="cancel('applyDate')")
                .filter-select(:class="{ 'active-select': queryForm.applyDate.length }")
                  .text {{ '申请起止时间' }}
                  u-icon.icon(v-if="queryForm.applyDate.length === 0" :name="filterIconStatus.applyDate ? 'arrow-up' : 'arrow-down'" size="14" color="#88929E")
              u-icon.icon.icon-close(v-if="queryForm.applyDate.length" name="close-circle" size="14" color="#88929E" :class="{ 'active-select': queryForm.applyDate.length }" @click="resetPicker")
            picker.filter-box(:value="requirementsPIndex" :range="requirementsStateRage" @change="requirementsConfirm" @cancel="cancel('state')")
              .filter-select(:class="{ 'active-select': queryForm.state }" @click="filterHandle('state')")
                .text {{ '需求状态' }}
                u-icon.icon(:name="filterIconStatus.state ? 'arrow-up' : 'arrow-down'" size="14" color="#88929E")
            picker.filter-box(:value="platformPIndex" :range="platformSourceRange" @change="platformConfirm" @cancel="cancel('resource')")
              .filter-select(:class="{ 'active-select': queryForm.resource }" @click="filterHandle('resource')")
                .text {{ '申请来源' }}
                u-icon.icon(:name="filterIconStatus.resource ? 'arrow-up' : 'arrow-down'" size="14" color="#88929E")
          .mainContainer
            scroll-view.scrollView(
              scroll-y
              @scrolltolower="scrolltolower"
              @refresherrefresh='refresherrefresh'
              :refresher-enabled='true'
              :refresher-triggered='refresherTriggered')
              .scroll-box
                view.scrollItem(v-for="(listItem, itemIndex) in listData" :key="itemIndex")
                  .top-tips
                    .status(:class="getStatusClass(listItem)") {{ listItem.status_text }}
                  view.topTitle
                    .colItem
                      .title-box
                        span.label {{ '融资' }}
                        span.label {{ '机构' }}
                      view.bank-name {{ listItem.chosenBankName }}
                  view.bottomText
                    .iconfont.icon-fangkuanzonge
                    up-grid(col="2" :border='false')
                      up-grid-item
                        .colItem
                          view.label {{'融资金额：'}}
                          view {{ fmtFinancingNeedsAmount(listItem.financingNeedsAmount) }}
                    up-grid(col="1" :border='false')
                      up-grid-item
                        .colItem
                          view.label {{'申请时间：'}}
                          view {{ moment(listItem.submitDateTime).format('YYYY年MM月DD日') }}
                    up-grid(col="1" :border='false')
                      up-grid-item
                        .colItem
                          view.label {{'联系人：'}}
                          view {{ listItem.linkManName }}
                    up-grid(col="1" :border='false')
                      up-grid-item
                        .colItem.flex-center
                          u-button.u-pinia-btn(type="primary" @click="financeRecordClick(listItem)") {{ '查看详情' }}
                          u-button.u-primary-btn(
                            type="primary"
                            v-if="((isAgentPerson || listItem.tbUserId === uiasUserInfo.tbUserId) && !(listItem.state !== '1' || listItem.resource !== '1' || listItem.acceptStatus !== '0')) && listItem.state !== '2'"
                            @click="cancelFinanceRecordClick(listItem)"
                          ) {{ '取消申请' }}
                up-loadmore(:status="loadMoreStatus" @loadmore="getMore")
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

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import CancelForm from './cancelForm/index.vue'
import { reactive, ref, onMounted, computed, type Ref, watch } from 'vue'
import { financeList } from '@/api/user/index'
import type { PageItem } from '@/api/index/types'
import moment from 'moment'
import { userCommonStoreHook } from '@/store/modules/common'
import type { DictListItem } from '@/api/index/types'
import { linkJump, useCancelFinanceRecord } from '@/common/common'
import type { ApiResponse } from '@/common/http/types'
import { FinancingRecordListItem } from '@/api/user/type'
import Bus, { FINANCE_RECORD_STATUS_REFRESH } from '@/common/bus'
import { onLoad, onShow } from '@dcloudio/uni-app'

type FilterType = 'demandSource' | 'applyDate' | 'state' | 'resource'
const listData: Ref<FinancingRecordListItem[]> = ref([])
// 下拉刷新状态
const refresherTriggered = ref<boolean>(false)
const loadMoreStatus = ref<string>('loadmore') // LoadMore组件状态：loadmore查看更多 loading加载中 nomore没有更多
const page = reactive<PageItem>({
  currentPage: 1,
  pageSize: 10,
  totalPage: 0
})
const filterIconStatus = ref<Record<FilterType, boolean>>({
  demandSource: false,
  applyDate: false,
  state: false,
  resource: false
})
// 申请平台
const demandSourcePIndex = ref()
const demandSourceList: Ref<DictListItem[]> = ref([])
const demandSourceRange = computed(() => {
  return demandSourceList.value.map((item: any) => {
    if (item && item['name']) {
      return item['name']
    }
  })
})
const dateFormatter = (timestamp: number | string) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
// 申请时间
const queryForm = reactive({
  searchValue: '',
  resource: '',
  applyDate: [],
  state: '',
  demandSource: ''
})
// 需求状态
const requirementsPIndex = ref()
const requirementsStateList = ref<DictListItem[]>([])
const requirementsStateRage = computed(() => {
  return requirementsStateList.value.map((item: any) => {
    if (item && item['name']) {
      return item['name']
    }
  })
})
// 申请来源
const platformPIndex = ref()
const platformSourceList: Ref<DictListItem[]> = ref([])
const platformSourceRange = computed(() => {
  return platformSourceList.value.map((item: any) => {
    if (item && item['name']) {
      return item['name']
    }
  })
})
// 是否过滤当前用户的融资记录
const isFinanceRecordFilter = ref(false)
// 取消申请
const cancelFormRef = ref(null)
const { isAgentPerson, showCancelModal, cancelApplyForm, init, cancelApplyClick, cancelInquiryinfoDemandCancel, clearCancelApplyForm } = useCancelFinanceRecord()
// 滚动到底部刷新
const scrolltolower = () => {
  if (loadMoreStatus.value === 'loadmore') {
    // 若此时可以加载更多才触发，避免频繁触底发起请求
    getMore()
  }
}
// 下拉刷新
const refresherrefresh = () => {
  refresherTriggered.value = true
  getListData(true)
}
// 点击加载更多或是scroll-view组件触底加载更多
const getMore = () => {
  if (loadMoreStatus.value !== 'loadmore') {
    return
  }
  // 加载下一页
  page.currentPage = page.currentPage + 1
  getListData()
}
// 获取列表数据
const getListData = (reset = false) => {
  // 重置页码
  if (reset) {
    page.currentPage = 1
    listData.value = []
  }
  let params = {
    userId: isFinanceRecordFilter.value ? uiasUserInfo.value.tbUserId : '',
    inquiryCode: '',
    // 申请平台 - 0:企业端  1:机构端  2:鄂汇办  3:小程序
    demandSource: queryForm.demandSource,
    // 申请来源 - 1:鄂融通  2:市州对接  3:银行对接
    resource: queryForm.resource,
    state: queryForm.state,
    chosenBankName: queryForm.searchValue,
    startTime: queryForm.applyDate.length ? queryForm.applyDate[0] : '',
    endTime: queryForm.applyDate.length ? queryForm.applyDate[1] : '',
    electronicSigned: '1', // 申请平台
    page: page.currentPage,
    limit: page.pageSize,
    uniscId: entInfo.value.entUnitCode,
    sidx: 't.SUBMIT_DATE_TIME',
    order: 'desc'
  }
  loadMoreStatus.value = 'loading'
  financeList(params)
    .then((value: ApiResponse<FinancingRecordListItem[]>) => {
      let data = value.page
      let list = data.list || []
      // acceptStatus =1 已受理
      // acceptStatus =2  已否决
      // creditEvalStatus = 1 授信审批
      // creditEvalStatus = 2  已否决
      // creditLoanAmount 不为空 并且creditEvalStatus = 1 授信审批   放款成功
      list.forEach(item => {
        if (item.state === '2') {
          item.status_text = '需求取消'
          return false
        }
        if (!item.acceptStatus || item.acceptStatus === '0') {
          item.status_text = '对接中'
        }
        if (item.acceptStatus === '1') {
          item.status_text = '对接中'
        }
        if (item.acceptStatus === '2') {
          item.status_text = '对接失败'
        }
        if (item.creditEvalStatus === '1') {
          item.status_text = '对接中'
        }
        if (item.creditEvalStatus === '2') {
          item.status_text = '对接失败'
        }
        if (item.state === '1' && item.acceptStatus === '1' && item.creditEvalStatus === '1') {
          item.status_text = '成功放款'
        }
      })
      listData.value = listData.value.concat(list)
      page.totalPage = data.totalPage || 0
    })
    .catch(reason => {
      console.error(reason)
    })
    .finally(() => {
      if (page.currentPage === page.totalPage || page.totalPage === 0) {
        //	若为最后一页 则return,没有更多
        loadMoreStatus.value = 'nomore'
      } else {
        loadMoreStatus.value = 'loadmore'
      }
      refresherTriggered.value = false
    })
}
const filterHandle = (type: FilterType) => {
  filterIconStatus.value[type] = !filterIconStatus.value[type]
}
// 获取申请平台
const getDemandSource = async () => {
  demandSourceList.value = []
  const result: DictListItem[] = await userCommonStoreHook().getDict('platform_demandSource')
  demandSourceList.value = JSON.parse(JSON.stringify(result))
  demandSourceList.value.unshift({
    id: 'all',
    isParent: false,
    name: '全部',
    pId: 'all',
    value: 'all'
  })
}
// 获取需求状态
const getRequirementsState = async () => {
  requirementsStateList.value = []
  const result: DictListItem[] = await userCommonStoreHook().getDict('requirements_state')
  requirementsStateList.value = JSON.parse(JSON.stringify(result))
  requirementsStateList.value.unshift({
    id: 'all',
    isParent: false,
    name: '全部',
    pId: 'all',
    value: 'all'
  })
}
// 获取申请来源
const getPlatformSource = async () => {
  platformSourceList.value = []
  const result: DictListItem[] = await userCommonStoreHook().getDict('platform_source')
  platformSourceList.value = JSON.parse(JSON.stringify(result))
  platformSourceList.value.unshift({
    id: 'all',
    isParent: false,
    name: '全部',
    pId: 'all',
    value: 'all'
  })
}
const searchHandle = () => {
  getListData(true)
}
// 申请平台筛选
const demandSourceConfirm = (e: AnyObject) => {
  demandSourcePIndex.value = e.detail.value
  queryForm.demandSource = demandSourcePIndex.value === '0' ? '' : demandSourceList.value[demandSourcePIndex.value].value
  filterIconStatus.value.demandSource = false
  getListData(true)
}
// 重置申请时间
const resetPicker = () => {
  queryForm.applyDate = []
  getListData(true)
}
const applyDateShow = () => {
  filterIconStatus.value.applyDate = true
  console.log('applyDateShow', filterIconStatus.value)
}
const applyDateChange = () => {
  console.log('applyDateChange', queryForm.applyDate)
  getListData(true)
  filterIconStatus.value.applyDate = false
}
// 需求状态筛选
const requirementsConfirm = (e: AnyObject) => {
  requirementsPIndex.value = e.detail.value
  queryForm.state = requirementsPIndex.value === '0' ? '' : requirementsStateList.value[requirementsPIndex.value].value
  filterIconStatus.value.state = false
  getListData(true)
}
// 申请来源筛选
const platformConfirm = (e: AnyObject) => {
  platformPIndex.value = e.detail.value
  queryForm.resource = platformPIndex.value === '0' ? '' : platformSourceList.value[platformPIndex.value].value
  filterIconStatus.value.resource = false
  getListData(true)
}
// 关闭筛选框
const cancel = (type: string) => {
  switch (type) {
    case 'demandSource':
      filterIconStatus.value.demandSource = false
      break
    case 'applyDate':
      filterIconStatus.value.applyDate = false
      break
    case 'state':
      filterIconStatus.value.state = false
      break
    case 'resource':
      filterIconStatus.value.resource = false
      break
    default:
      break
  }
}
// 获取融资状态
const getStatusClass = (item: FinancingRecordListItem) => {
  let str = ''
  if (item.state === '2') {
    return 'danger'
  }
  if (!item.acceptStatus || item.acceptStatus === '0') {
    str = 'green'
  }
  if (item.acceptStatus === '1') {
    str = 'green'
  }
  if (item.acceptStatus === '2') {
    str = 'danger'
  }
  if (item.creditEvalStatus === '1') {
    str = 'green'
  }
  if (item.creditEvalStatus === '2') {
    str = 'danger'
  }
  if (item.state === '1' && item.acceptStatus === '1' && item.creditEvalStatus === '1') {
    str = 'success'
  }
  return str
}
// 融资金额
const fmtFinancingNeedsAmount = (value: string) => {
  return `${value ? parseFloat(value).toFixed(2) : ''}万元`
}
// 查看详情
const financeRecordClick = (item: FinancingRecordListItem) => {
  linkJump(`/pagesUser/financeRecord/financeRecordDetail/index?id=${item.id}&finCreditInquiryId=${item.finCreditInquiryId}`)
}
// 取消申请
const cancelFinanceRecordClick = (item: FinancingRecordListItem) => {
  console.log('取消申请', item)
  cancelApplyClick(item.id, item.finCreditInquiryId, item)
}
// 确认取消融资事件
const cancelFormConfirm = () => {
  cancelInquiryinfoDemandCancel(false)
}
// 关闭取消融资申请回调
const cancelModalCancel = () => {
  showCancelModal.value = false
  clearCancelApplyForm()
}
// 监听筛选当前用户融资记录状态
watch(
  () => isFinanceRecordFilter.value,
  value => {
    getListData(true)
  }
)
const entInfo = computed(() => {
  return userCommonStoreHook().entInfo
})
const uiasUserInfo = computed(() => {
  return userCommonStoreHook().uiasUserInfo
})
// 隐藏小程序后会自动销毁
onShow(() => {
  Bus.$on(FINANCE_RECORD_STATUS_REFRESH, () => {
    getListData(true)
  })
})
onLoad(() => {
  getListData()
  getDemandSource()
  getRequirementsState()
  getPlatformSource()
  init()
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
