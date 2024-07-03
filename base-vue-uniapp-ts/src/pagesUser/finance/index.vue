<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#DAECFE" statusBackground="#DAECFE" headerTitle="融资记录")
    template(#main)
      view.layoutMain
        .mainContainer
          scroll-view.scrollView(
            scroll-y
            @scrolltolower="scrolltolower"
            @refresherrefresh='refresherrefresh'
            :refresher-enabled='true'
            :refresher-triggered='refresherTriggered')
            view.scrollItem(v-for="(listItem, itemIndex) in listData" :key="itemIndex")
              view.topTitle
                .colItem
                  view.label {{'融资机构：'}}
                  view {{ listItem.chosenBankName }}
              view.bottomText
                .iconfont.icon-fangkuanzonge
                up-grid(col="2" :border='false')
                  up-grid-item
                    .colItem
                      view.label {{'融资金额：'}}
                      view {{ fmtFinancingNeedsAmount(listItem.financingNeedsAmount) }}
                  up-grid-item
                    .colItem
                      view.label {{'状态：'}}
                      view {{ listItem.status_text }}
                up-grid(col="1" :border='false')
                  up-grid-item
                    .colItem
                      view.label {{'申请时间：'}}
                      view {{ moment(listItem.submitDateTime).format('YYYY年MM月DD日') }}
            up-loadmore(:status="loadMoreStatus" @loadmore="getMore")
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import { reactive, ref, onMounted, computed } from 'vue'
import { financeList } from '@/api/user/index'
import type { PageItem } from '@/api/policyNews/type'
import moment from 'moment'
import { userCommonStoreHook } from '@/store/modules/common'

const listData = ref([])
const loadMoreStatus = ref<string>('loadmore') // LoadMore组件状态：loadmore查看更多 loading加载中 nomore没有更多
const page = reactive<PageItem>({
  currentPage: 1,
  pageSize: 10,
  totalPage: 0
})
// 下拉刷新状态
let refresherTriggered = ref<boolean>(false)
let entInfo = computed(() => {
  return userCommonStoreHook().entInfo
})
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
    inquiryCode: '',
    resource: '',
    state: '',
    chosenBankName: '',
    startTime: '',
    endTime: '',
    electronicSigned: '1', // 申请平台
    page: page.currentPage,
    limit: page.pageSize,
    uniscId: entInfo.value.entUnitCode,
    sidx: 't.SUBMIT_DATE_TIME',
    order: 'desc'
  }
  loadMoreStatus.value = 'loading'
  financeList(params)
    .then(value => {
      let data = value.page
      let list = data.list || []
      // acceptStatus =1 已受理
      // acceptStatus =2  已否决
      // creditEvalStatus = 1 授信审批
      // creditEvalStatus = 2  已否决
      // creditLoanAmount 不为空 并且creditEvalStatus = 1 授信审批   放款成功
      list.forEach(item => {
        if (!item.acceptStatus || item.acceptStatus === '0') {
          item.status_text = '对接中'
        }
        if (item.acceptStatus === '1') {
          item.status_text = '已受理'
        }
        if (item.acceptStatus === '2') {
          item.status_text = '已否决'
        }
        if (item.creditEvalStatus === '1') {
          item.status_text = '授信审批'
        }
        if (item.creditEvalStatus === '2') {
          item.status_text = '已否决'
        }
        if (!item.creditLoanAmount && item.creditEvalStatus === '1') {
          item.status_text = '放款成功'
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
// 融资金额
const fmtFinancingNeedsAmount = (value: string) => {
  return `${value ? parseFloat(value).toFixed(2) : ''}万元`
}
onMounted(() => {
  getListData()
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
