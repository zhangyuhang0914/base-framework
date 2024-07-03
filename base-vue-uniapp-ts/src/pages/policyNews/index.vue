<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar headerBackground="#DAECFE" statusBackground="#DAECFE" headerTitle="政策新闻")
    template(#main)
      view.layoutMain
        view(class="topTab")
          up-tabs(
            :current="currentTab"
            lineColor="#0085FF"
            :list="tabList"
            :lineWidth="30"
            :scrollable="false"
            :inactiveStyle="{color: '#222', fontSize: '32rpx', fontWeight: 'bold'}"
            :activeStyle="{color: '#0085FF', fontSize: '32rpx', fontWeight: 'bold'}"
            :itemStyle="{width: '33.3%', height: '80rpx', padding: '5rpx'}"
            @click="handleTabType")
        view(class="mainContainer")
          view(class="policyType" v-show="tabType === 'policyGuide'" )
            up-row.rowBox(gutter="30")
              up-col(span="6" v-for="item in policyTypes")
                up-button(
                  :type="policyType === item.value ? 'primary' : 'text'"
                  :text="item.name"
                  shape="circle"
                  plain="true"
                  @click="handlePolicyType(item)")
          .scrollContent(:class="{policyScrollContent: tabType === 'policyGuide'}")
            scroll-view.scroll-view(
              scroll-y
              @scrolltolower="scrolltolower"
              @refresherrefresh='refresherrefresh'
              :refresher-enabled='true'
              :refresher-triggered='refresherTriggered')
              view.scrollBox
                view.scrollItem(v-for="(listItem, itemIndex) in listData" :key="itemIndex" @click='handleItem(listItem)')
                  view.topTitle.text-line2-overflow {{ listItem.title }}
                  view.bottomText
                    text.publisher(v-if='listItem.source') {{ listItem.source }}
                    text.time(v-if="tabType!=='platformConsultation'") {{ moment(listItem.publishTime).format('YYYY-MM-DD') }}
                    text.time(v-if="tabType==='platformConsultation'") {{ moment(listItem.updatedTimeStr).format('YYYY-MM-DD') }}
                up-loadmore(:status="loadMoreStatus" @loadmore="getMore")
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import { reactive, ref, onMounted } from 'vue'
import { queryPublishListByType, platformConsultationUrl } from '@/api/policyNews/index'
import type { PageItem, TypeItem, CountryListItem } from '@/api/policyNews/type'
import moment from 'moment'
import { linkJump } from '@/common/common'
import Bus, { POLICYTYPE } from '@/common/bus'

const tabList = reactive<TypeItem[]>([
  { name: '政策指南', value: 'policyGuide' },
  { name: '新闻动态', value: 'news' },
  { name: '平台资讯', value: 'platformConsultation' }
])
const tabType = ref('policyGuide')
const policyTypes = reactive<TypeItem[]>([
  { name: '国家政策', value: 'country' },
  { name: '省级政策', value: 'province' }
])
const currentTab = ref(0)
const listData = ref<CountryListItem[]>([])
const loadMoreStatus = ref<string>('loadmore') // LoadMore组件状态：loadmore查看更多 loading加载中 nomore没有更多
const page = reactive<PageItem>({
  currentPage: 1,
  pageSize: 10,
  totalPage: 0
})
const policyType = ref<string>('country')
// 下拉刷新状态
let refresherTriggered = ref<boolean>(false)
// 切换tab
const handlePolicyType = (item: TypeItem) => {
  policyType.value = item.value
  getListData(true)
}
// 切换政策
const handleTabType = (item: AnyObject) => {
  currentTab.value = item.index
  tabType.value = item.value
  getListData(true)
}

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
  let params: any = {
    page: page.currentPage,
    limit: page.pageSize,
    typeCode: 'ZCXW'
  }
  loadMoreStatus.value = 'loading'
  let api
  if (tabType.value === 'policyGuide') {
    api = queryPublishListByType
    if (policyType.value === 'country') {
      params = Object.assign({}, params, { typeCode: 'ZCXW_ZC_GJJ' })
    }
    if (policyType.value === 'province') {
      params = Object.assign({}, params, { typeCode: 'ZCXW_ZC_SJ' })
    }
  }
  if (tabType.value === 'news') {
    params = Object.assign({}, params, { typeCode: 'ZCXW_XW' })
    api = queryPublishListByType
  }
  if (tabType.value === 'platformConsultation') {
    params = {
      rqsMsgBdy: `{'startTime':'','endTime':'${moment(new Date()).format('YYYY-MM-DD')}','operType':'queryPageLb' ,'unitId': 'ERT00001', 'page': '${page.currentPage}', size: '${page.pageSize}'}`
    }
    api = platformConsultationUrl
  }
  if (!api) {
    return
  }
  api(params)
    .then(value => {
      if (tabType.value === 'platformConsultation') {
        let list = JSON.parse(value.rest_MsgBdy_Cntnt || '[]')
        listData.value = listData.value.concat(list || [])
        let total = value.Enqr_PsRlt_Ret_CD ? parseInt(value.Enqr_PsRlt_Ret_CD) : 0
        page.totalPage = Math.ceil(total / page.pageSize)
        return
      }
      let data = value.data
      listData.value = listData.value.concat(data.list || [])
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
const handleItem = (item: CountryListItem) => {
  linkJump(`/pagesPolicyNews/newsDetail/index?id=${tabType.value === 'platformConsultation' ? item.crawlId : item.id}&type=${tabType.value}`)
}
onMounted(() => {
  getListData()
  // 定位tab
  Bus.$on(POLICYTYPE, (type: string) => {
    tabType.value = type
    currentTab.value = 0
    policyType.value = 'country'
    getListData(true)
  })
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
