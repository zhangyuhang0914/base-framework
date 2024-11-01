<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#132B5B" statusBackground="#132B5B" headerColor="#FFFFFF" headerTitle="供应链金融需求管理")
    template(#main)
      .supply-chain-record-wrap
        .supply-chain-header
          .search-input
            up-search(v-model="queryForm.searchValue" placeholder="请输入金融机构名称" @search="searchHandle" :show-action="false" shape="square" :animation="true" :clearabled="false")
            .search-btn(@click="searchHandle") {{ '搜索' }}
          u-button.filter-btn(type="primary" :class="isSupplyChainRecordFilter ? 'u-active-filter-btn' : 'u-default-filter-btn'" @click="isSupplyChainRecordFilter = !isSupplyChainRecordFilter") {{ '我的' }}
        view.layoutMain
          .filter-container
            picker(:value="platformPIndex" :range="platformSourceRange" @change="platformConfirm" @cancel="cancel('demandSource')")
              .filter-select(:class="{ 'active-select': queryForm.demandSource }" @click="filterHandle('demandSource')")
                .text {{ '申请平台' }}
                u-icon.icon(:name="filterIconStatus.demandSource ? 'arrow-up' : 'arrow-down'" size="14" color="#88929E")
            .filter-select(:class="{ 'active-select': queryForm.applyDateFormatStart }" @click="filterHandle('applyDateStart')")
              .text {{ '申请时间起' }}
              u-icon.icon(:name="filterIconStatus.applyDateStart ? 'arrow-up' : 'arrow-down'" size="14" color="#88929E")
            .filter-select(:class="{ 'active-select': queryForm.applyDateFormatEnd }" @click="filterHandle('applyDateEnd')")
              .text {{ '申请时间止' }}
              u-icon.icon(:name="filterIconStatus.applyDateEnd ? 'arrow-up' : 'arrow-down'" size="14" color="#88929E")
            picker(:value="dockingStatusPIndex" :range="dockingStatusRage" @change="dockingStatusConfirm" @cancel="cancel('dockingStatus')")
              .filter-select(:class="{ 'active-select': queryForm.dockingStatus }" @click="filterHandle('dockingStatus')")
                .text {{ '需求状态' }}
                u-icon.icon(:name="filterIconStatus.dockingStatus ? 'arrow-up' : 'arrow-down'" size="14" color="#88929E")
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
                    .status {{ listItem.status_text }}
                  view.topTitle
                    .colItem
                      .title-box
                        span.label {{ '融资' }}
                        span.label {{ '机构' }}
                      view.bank-name {{ listItem.institutionsInfoName }}
                  view.bottomText
                    .iconfont.icon-fangkuanzonge
                    up-grid(col="1" :border='false')
                      up-grid-item
                        .colItem
                          view.label {{'产品名称：'}}
                          view {{ (listItem.productName) }}
                    up-grid(col="1" :border='false')
                      up-grid-item
                        .colItem
                          view.label {{'申请时间：'}}
                          view {{ moment(listItem.createdTime).format('YYYY年MM月DD日') }}
                    up-grid(col="1" :border='false')
                      up-grid-item
                        .colItem
                          view.label {{'联系人：'}}
                          view {{ listItem.contacts }}
                    up-grid(col="1" :border='false')
                      up-grid-item
                        .colItem.flex-center
                          u-button.u-pinia-btn(type="primary" @click="financeRecordClick(listItem)") {{ '查看详情' }}
                          u-button.u-primary-btn(
                            type="primary"
                            v-if="(isAgentPerson || listItem.tbUserId === uiasUserInfo.tbUserId) && !(listItem.state !== '0')"
                            @click="cancelFinanceRecordClick(listItem)"
                          ) {{ '取消对接' }}
                up-loadmore(:status="loadMoreStatus" @loadmore="getMore")
          u-datetime-picker(
            :show="filterIconStatus.applyDateStart"
            v-model="queryForm.applyDateStart"
            mode="date"
            :maxDate="Number(new Date(queryForm.applyDateFormatEnd)) || Date.now()"
            :minDate="Number(new Date('2000-01-01'))"
            cancelText="重置"
            closeOnClickOverlay
            @cancel="resetPicker('applyDateStart')"
            @close="filterIconStatus.applyDateStart = false"
            @confirm="applyDateStartChange")
          u-datetime-picker(
            :show="filterIconStatus.applyDateEnd"
            v-model="queryForm.applyDateEnd"
            mode="date"
            :maxDate="Date.now()"
            :minDate="Number(new Date(queryForm.applyDateFormatStart)) || Number(new Date('2000-01-01'))"
            cancelText="重置"
            closeOnClickOverlay
            @cancel="resetPicker('applyDateEnd')"
            @close="filterIconStatus.applyDateEnd = false"
            @confirm="applyDateEndChange")
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
import Layout from '@/components/layout/index.vue'
import CancelForm from '@/pagesUser/financeRecord/cancelForm/index.vue'
import { reactive, ref, onMounted, computed, type Ref, watch, defineComponent } from 'vue'
import { supplyChainDockingList } from '@/api/user/index'
import type { PageItem } from '@/api/index/types'
import moment from 'moment'
import { userCommonStoreHook } from '@/store/modules/common'
import type { DictListItem } from '@/api/index/types'
import { linkJump, useCancelSupplyChainFinanceRecord } from '@/common/common'
import type { ApiResponse } from '@/common/http/types'
import { SupplyChainListItem } from '@/api/user/type'
import Bus, { SUPPLY_CHAIN_FINANCE_RECORD_STATUS_REFRESH } from '@/common/bus'
import { getDicValue } from '@/util/utils'

type FilterType = 'demandSource' | 'applyDateStart' | 'applyDateEnd' | 'dockingStatus'
export default defineComponent({
  name: 'SupplyChainFinanceNeed',
  components: { Layout, CancelForm },
  setup() {
    const listData: Ref<SupplyChainListItem[]> = ref([])
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
      applyDateStart: false,
      applyDateEnd: false,
      dockingStatus: false
    })
    // 申请平台
    const platformSourceList: Ref<DictListItem[]> = ref([])
    const platformSourceRange = computed(() => {
      return platformSourceList.value.map((item: any) => {
        if (item && item['name']) {
          return item['name']
        }
      })
    })
    const platformPIndex = ref()
    // 申请时间
    const queryForm = reactive({
      searchValue: '',
      demandSource: '',
      applyDateStart: Date.now(),
      applyDateFormatStart: '',
      applyDateEnd: Date.now(),
      applyDateFormatEnd: '',
      dockingStatus: ''
    })
    // 需求状态
    const dockingStatusPIndex = ref()
    const dockingStatusList = ref<DictListItem[]>([])
    const dockingStatusRage = computed(() => {
      return dockingStatusList.value.map((item: any) => {
        if (item && item['name']) {
          return item['name']
        }
      })
    })
    // 是否过滤当前用户的融资记录
    const isSupplyChainRecordFilter = ref(false)
    // 取消对接
    const { isAgentPerson, cancelFormRef, showCancelModal, cancelApplyForm, init, cancelApplyClick, cancelSupplyChainDockingUpdateCancel, clearCancelApplyForm } = useCancelSupplyChainFinanceRecord()
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
        userId: isSupplyChainRecordFilter.value ? uiasUserInfo.value.tbUserId : '',
        demandSource: queryForm.demandSource,
        state: queryForm.dockingStatus,
        institutionsInfoName: queryForm.searchValue,
        startTime: queryForm.applyDateFormatStart,
        endTime: queryForm.applyDateFormatEnd,
        page: page.currentPage,
        limit: page.pageSize,
        sidx: '',
        order: 'desc'
      }
      loadMoreStatus.value = 'loading'
      supplyChainDockingList(params)
        .then((value: ApiResponse<SupplyChainListItem[]>) => {
          let data = value.page
          let list = data.list || []
          list.forEach(item => {
            item.status_text = getDicValue(item.state, dockingStatusList.value)
          })
          listData.value = listData.value.concat(list)
          page.totalPage = data.totalPage || 0
          console.log('listData', listData.value)
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
    const dateFormatter = (timestamp: number | string) => {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    const filterHandle = (type: FilterType) => {
      filterIconStatus.value[type] = !filterIconStatus.value[type]
    }
    // 获取申请平台
    const getPlatformSource = async () => {
      platformSourceList.value = []
      const result: DictListItem[] = await userCommonStoreHook().getDict('demandSource')
      platformSourceList.value = JSON.parse(JSON.stringify(result))
      platformSourceList.value.unshift({
        id: 'all',
        isParent: false,
        name: '全部',
        pId: 'all',
        value: 'all'
      })
    }
    // 获取需求状态
    const getDockingStatus = async () => {
      dockingStatusList.value = []
      const result: DictListItem[] = await userCommonStoreHook().getDict('dockingStatus')
      dockingStatusList.value = JSON.parse(JSON.stringify(result))
      dockingStatusList.value.unshift({
        id: 'all',
        isParent: false,
        name: '全部',
        pId: 'all',
        value: 'all'
      })
      getListData()
    }
    const searchHandle = () => {
      getListData(true)
    }
    // 申请平台筛选
    const platformConfirm = (e: AnyObject) => {
      platformPIndex.value = e.detail.value
      queryForm.demandSource = platformPIndex.value === '0' ? '' : platformSourceList.value[platformPIndex.value].value
      filterIconStatus.value.demandSource = false
      getListData(true)
    }
    // 重置申请时间
    const resetPicker = (type: 'applyDateStart' | 'applyDateEnd') => {
      if (type === 'applyDateStart') {
        queryForm.applyDateStart = Date.now()
        queryForm.applyDateFormatStart = ''
        cancel('applyDateStart')
      } else if (type === 'applyDateEnd') {
        queryForm.applyDateEnd = Date.now()
        queryForm.applyDateFormatEnd = ''
        cancel('applyDateEnd')
      }
      getListData(true)
      console.log('queryForm', queryForm)
    }
    // 申请时间起
    const applyDateStartChange = (e: AnyObject) => {
      queryForm.applyDateFormatStart = dateFormatter(e.value)
      getListData(true)
      cancel('applyDateStart')
    }
    // 申请时间止
    const applyDateEndChange = (e: AnyObject) => {
      queryForm.applyDateFormatEnd = dateFormatter(e.value)
      getListData(true)
      cancel('applyDateEnd')
    }
    // 需求状态筛选
    const dockingStatusConfirm = (e: AnyObject) => {
      dockingStatusPIndex.value = e.detail.value
      queryForm.dockingStatus = dockingStatusPIndex.value === '0' ? '' : dockingStatusList.value[dockingStatusPIndex.value].value
      filterIconStatus.value.dockingStatus = false
      getListData(true)
    }
    // 关闭筛选框
    const cancel = (type: string) => {
      switch (type) {
        case 'demandSource':
          filterIconStatus.value.demandSource = false
          break
        case 'applyDateStart':
          filterIconStatus.value.applyDateStart = false
        case 'applyDateEnd':
          filterIconStatus.value.applyDateEnd = false
        case 'dockingStatus':
          filterIconStatus.value.dockingStatus = false
        default:
          break
      }
    }
    // 查看详情
    const financeRecordClick = (item: SupplyChainListItem) => {
      linkJump(`/pagesUser/supplyChainFinanceRecord/supplyChainFinanceRecordDetail/index?id=${item.id}`)
    }
    // 取消对接
    const cancelFinanceRecordClick = (item: SupplyChainListItem) => {
      console.log('取消对接', item)
      cancelApplyClick(item)
    }
    // 确认取消融资事件
    const cancelFormConfirm = () => {
      cancelSupplyChainDockingUpdateCancel(false)
    }
    // 关闭取消融资申请回调
    const cancelModalCancel = () => {
      showCancelModal.value = false
      clearCancelApplyForm()
    }
    // 监听筛选当前用户融资记录状态
    watch(
      () => isSupplyChainRecordFilter.value,
      value => {
        getListData(true)
      }
    )
    const uiasUserInfo = computed(() => {
      return userCommonStoreHook().uiasUserInfo
    })
    onMounted(() => {
      getPlatformSource()
      getDockingStatus()
      init()
      Bus.$on(SUPPLY_CHAIN_FINANCE_RECORD_STATUS_REFRESH, () => {
        getListData(true)
      })
    })
    return {
      moment,
      uiasUserInfo,
      platformPIndex,
      platformSourceRange,
      platformConfirm,
      resetPicker,
      dockingStatusPIndex,
      dockingStatusRage,
      dockingStatusConfirm,
      cancel,
      cancelApplyForm,
      filterHandle,
      filterIconStatus,
      queryForm,
      refresherTriggered,
      loadMoreStatus,
      listData,
      isSupplyChainRecordFilter,
      cancelFormRef,
      isAgentPerson,
      showCancelModal,
      searchHandle,
      scrolltolower,
      refresherrefresh,
      getMore,
      applyDateStartChange,
      applyDateEndChange,
      financeRecordClick,
      cancelFinanceRecordClick,
      cancelFormConfirm,
      cancelModalCancel
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
