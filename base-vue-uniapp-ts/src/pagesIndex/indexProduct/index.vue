<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#DAECFE" statusBackground="#DAECFE" :headerTitle="getHeaderTitle")
    template(#main)
      .layoutMain
        .mainContainer
          scroll-view.scrollView(
            scroll-y
            @scrolltolower="scrolltolower"
            @refresherrefresh='refresherrefresh'
            :refresher-enabled='true'
            :refresher-triggered='refresherTriggered'
          )
            .scroll-box(v-if="listData.length")
              .scroll-item(v-for="(item, index) in listData" :key="index")
                .product-box(@click='handleDetail(item)')
                  .product-tips
                    i.iconfont.icon-shigong
                    .title {{ `本产品由${item.institutionsName}提供` }}
                  .product-header
                    img(:src="item.logoUrl" alt="")
                    .title {{ item.name }}
                  .product-content
                    .product-data
                      .loan-limit-box.c-column
                        .value {{ item.loanLimit }}
                        .label {{ '贷款额度' }}
                      .rate-range-box.c-column
                        .value {{ item.rateRange }}
                        .label {{ '参考利率(年化)' }}
                      .loan-period-box.c-column
                        .value {{ item.loanPeriod }}
                        .label {{ '贷款期限' }}
                    .product-info
                      .guarantee-mode-box.c-row
                        .label {{ '担保方式：' }}
                        .value(v-if="item.guaranteeMode + ''") {{ formatMode(item.guaranteeMode, guaranteeModeList, item.guaranteeModeExtra) }}
                      //- .product-source-box.c-row
                      //-   .label {{ item.productSource }}
                  .product-footer
                    .product-tag
                      .tag-box(v-for="(tagItem, index) in getTabName(item)" :key="index" :class="tagItem.class")
                        .tag-name {{ tagItem.tag }}
                    .product-operation
                      .operation-box(@click.stop="collectionClick(item)")
                        i.iconfont(:class="item.isCollect ? 'icon-shouzanghou' : 'icon-shouzang'")
                      .operation-box(@click.stop="applyClick(item)")
                        i.iconfont.icon-shenqing
                      .operation-box(@click.stop='handleCompare(item)')
                        i.iconfont.icon-duibi
              u-loadmore(:status="loadMoreStatus" @loadmore="getMore")
            .no-data-view(v-else)
              CNoData
          CProductContrast(ref="CProductContrastRef")
          LoginValidateModal(ref='loginValidateRef' :type='loginValidateType')
</template>

<script setup lang="ts">
import { ref, reactive, type Ref, onMounted, computed } from 'vue'
import Layout from '@/components/layout/index.vue'
import CNoData from '@/components/c-no-data/index.vue'
import CProductContrast from '@/components/c-product-contrast/index.vue'
import LoginValidateModal from '@/pages/user/loginValidateModal/index.vue'
import type { PageItem } from '@/api/user/type'
import { userCommonStoreHook } from '@/store/modules/common'
import { formatMode } from '@/util/utils'
import type { DictListItem } from '@/api/index/types'
import type { ProductListItem } from '@/api/financeProduct/types'
import type { ApiResponse } from '@/common/http/types'
import { onLoad } from '@dcloudio/uni-app'
import { handleJudgeCollection, productApplyHandle, setProductContrast } from '@/hooks/common'
import { linkJump } from '@/common/common'
import { carouselProductList, fileDownload } from '@/api/index'
const commonStoreHook = userCommonStoreHook()
const type = ref<string>('')
const listData = ref<ProductListItem[]>([])
// LoadMore组件状态：loadmore查看更多 loading加载中 nomore没有更多
const loadMoreStatus = ref<string>('loadmore')
// 下拉刷新状态
const refresherTriggered = ref<boolean>(false)
const page = reactive<PageItem>({
  currentPage: 1,
  pageSize: 10,
  totalPage: 0
})
// 产品申请
const { loginValidateRef, loginValidateType, jumpLoginFn, linkProductApply } = productApplyHandle()
const guaranteeModeList: Ref<DictListItem[]> = ref([]) // 担保方式
// 获取担保方式
const getGuaranteeMode = async () => {
  const result: DictListItem[] = await commonStoreHook.getDict('guarantee_type')
  guaranteeModeList.value = result
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
// 获取收藏列表数据
const getListData = (reset = false) => {
  // 重置页码
  if (reset) {
    page.currentPage = 1
    listData.value = []
  }
  /**
   * 热门产品-hot: 1
   * 政策产品-productMainType: 01
   * 快贷产品-productMainType: 02
   */
  let params: { isApplets?: string; page: number; limit: number; hot?: string; productMainType?: string } = {
    isApplets: '1', // 代表是否是小程序轮播图，固定传 "1"，代表是
    productMainType: type.value, // 热门：08  快贷产品
    page: 1,
    limit: 15
  }
  loadMoreStatus.value = 'loading'
  carouselProductList(params)
    .then((result: ApiResponse<ProductListItem[]>) => {
      let data = result.page
      data.list.map((item: ProductListItem) => {
        item['logoUrl'] = item.logoFileId && fileDownload(item.logoFileId)
        item['companySource'] = '本产品由' + item.institutionsName + '提供'
        item['loanPeriod'] = item.loanPeriodBegin === 0 ? item.loanPeriodEnd + '个月及以下' : item.loanPeriodBegin + '-' + item.loanPeriodEnd + '个月'
        item['rateRange'] = item.rateRangeBegin + '%-' + item.rateRangeEnd + '%'
        item['loanLimit'] = item.loanLimitBegin + '~' + item.loanLimitEnd + '万元'
        item['productSource'] = '产品来源：' + item.institutionsName
        item['isCollect'] = item.whetherCollection + '' === '0' ? true : false
      })
      listData.value = listData.value.concat(data.list || [])
      page.totalPage = data.totalPage
    })
    .finally(() => {
      if (page.currentPage === page.totalPage || page.totalPage === 0) {
        // 若为最后一页 则 return,没有更多
        loadMoreStatus.value = 'nomore'
      } else {
        loadMoreStatus.value = 'loadmore'
      }
      refresherTriggered.value = false
    })
}
// 产品特点
const getTabName = (item: ProductListItem) => {
  if (!item.characteristics) return false
  return item.characteristics.split(',').map((childItem: string, itemIndex: number) => {
    return { tag: childItem, class: `tag${itemIndex + 1}` }
  })
}
// 收藏
const collectionClick = (item: ProductListItem) => {
  if (!item.id) return
  if (!jumpLoginFn()) return
  // 收藏
  handleJudgeCollection('1', item, (isCollect: boolean) => {
    item.isCollect = isCollect
  })
}
// 产品申请
const applyClick = async (item: ProductListItem) => {
  if (!item.id) return
  linkProductApply(item)
}
// 产品对比
const CProductContrastRef = ref()
const handleCompare = (item: ProductListItem) => {
  setProductContrast(item, 'push')
  CProductContrastRef.value && CProductContrastRef.value.init()
}
// 产品详情
const handleDetail = (item: ProductListItem) => {
  linkJump(`/pagesFinanceProduct/productDetail/index?id=${item.id}`)
}
const getHeaderTitle = computed(() => {
  return type.value === '08' ? '热门推荐' : '快贷产品'
})
onMounted(() => {
  // 获取担保方式
  getGuaranteeMode()
  // 获取产品列表
  getListData(true)
})
onLoad((options: any) => {
  type.value = options.type
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
