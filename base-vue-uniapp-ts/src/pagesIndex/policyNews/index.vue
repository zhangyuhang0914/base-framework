<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack statusBackground="#132B5B" headerBackground="#132B5B" headerColor="#FFFFFF" headerTitle="政策新闻")
    template(#main)
      view.layoutMain
        .search-input
          up-search(v-model="searchValue" :placeholder="getPlaceholder" @search="searchHandle" @clear="searchHandle" :show-action="false" shape="square" :animation="true" clearabled)
          .search-btn(@click="searchHandle") {{ '搜索' }}
        view(class="topTab")
          up-tabs(
            :current="currentTab"
            lineColor="#F4DB8C"
            :list="tabList"
            :lineWidth="30"
            :scrollable="false"
            :inactiveStyle="{color: '#FFFFFF', fontSize: '32rpx', fontWeight: 'bold'}"
            :activeStyle="{color: '#F4DB8C', fontSize: '32rpx', fontWeight: 'bold'}"
            :itemStyle="{width: '33.3%', height: '100rpx', padding: '5rpx'}"
            @click="handleTabType")
        view(class="mainContainer")
          view(class="policyType" v-show="tabType === 'policyGuide'" )
            up-row.rowBox(gutter="30")
              up-col(:span="6" v-for="(item, index) in policyTypes" :key="index")
                up-button(
                  :type="policyType === item.value ? 'primary' : 'text'"
                  :text="item.name"
                  shape="circle"
                  plain
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
                  view
                    view.topTitle.text-line2-overflow {{ listItem.title }}
                    view.bottomText
                      text.publisher.text-line2-overflow(v-if='listItem.source') {{ listItem.source }}
                      text.time(v-if="tabType!=='platformConsultation'") {{ moment(listItem.publishTime).format('YYYY-MM-DD') }}
                      text.time(v-if="tabType==='platformConsultation'") {{ moment(listItem.updatedTimeStr).format('YYYY-MM-DD') }}
                  image.rightImg(v-if="listItem.minFileId" mode="widthFix" :lazy-load="true" :src="preview(listItem.minFileId)")
                up-loadmore(:status="loadMoreStatus" @loadmore="getMore")
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import { reactive, ref, onMounted, type Ref, computed } from 'vue'
import { queryPublishListByType, platformConsultationUrl } from '@/api/index/index'
import type { PageItem, TypeItem, CountryListItem } from '@/api/index/types'
import moment from 'moment'
import { linkJump } from '@/common/common'
import Bus, { POLICYTYPE } from '@/common/bus'
import { preview } from '@/api/common'
import { onLoad, onShow } from '@dcloudio/uni-app'

const searchValue: Ref<string> = ref('')
const searchHandle = () => {
  getListData(true)
}
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
const basicPlatformList = ref<CountryListItem[]>([])
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
    basicPlatformList.value = []
    listData.value = []
  }
  let params: any = {
    title: searchValue.value,
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
      rqsMsgBdy: `{'keyword':'${searchValue.value}','startTime':'','endTime':'${moment(new Date()).format('YYYY-MM-DD')}','operType':'queryPageLb' ,'unitId': 'ERT00001', 'page': '${page.currentPage}', size: '10000'}`
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
        basicPlatformList.value = basicPlatformList.value.concat(list || [])
        basicPlatformList.value = basicPlatformList.value.filter(item => item.title.indexOf(searchValue.value) > -1)
        // let total = value.Enqr_PsRlt_Ret_CD ? parseInt(value.Enqr_PsRlt_Ret_CD) : 0
        // page.totalPage = Math.ceil(total / page.pageSize)

        // 手动分页
        const pageSize = 10 // 每页显示条数
        const currentPage = page.currentPage || 1 // 当前页，默认第一页
        // 计算分页数据
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        listData.value = listData.value.concat(basicPlatformList.value.slice(start, end) || [])
        page.totalPage = basicPlatformList.value.length
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
      if (tabType.value === 'platformConsultation') {
        loadMoreStatus.value = listData.value.length === basicPlatformList.value.length ? 'nomore' : 'loadmore'
      } else {
        loadMoreStatus.value = page.currentPage === page.totalPage || page.totalPage === 0 ? 'nomore' : 'loadmore'
      }
      refresherTriggered.value = false
    })
}
const handleItem = (item: CountryListItem) => {
  linkJump(`/pagesIndex/policyNews/newsDetail/index?id=${tabType.value === 'platformConsultation' ? item.crawlId : item.id}&type=${tabType.value}&title=${tabList[currentTab.value].name}`)
}
const getPlaceholder = computed(() => {
  const typeName = tabList.find((item: TypeItem) => item.value === tabType.value)?.name
  return `请输入${typeName}名称`
})
// 隐藏小程序后会自动销毁
onShow(() => {
  // 定位tab
  Bus.$on(POLICYTYPE, (type: string) => {
    tabType.value = type
    currentTab.value = 0
    policyType.value = 'country'
    getListData(true)
  })
})
onLoad((option: AnyObject | undefined) => {
  console.log('options', option)
  currentTab.value = tabList.findIndex(item => item.value === (option?.searchType || 'policyGuide'))
  tabType.value = option?.searchType || 'policyGuide'
  searchValue.value = option?.keyword || ''
  searchHandle()
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
