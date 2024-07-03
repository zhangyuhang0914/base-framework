<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#DAECFE" statusBackground="#DAECFE" headerTitle="产品收藏")
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
            .scroll-item(v-for="(item, index) in listData" :key="index")
              .product-box(@click='handleDetail(item.finProductInfo)')
                .product-tips
                  i.iconfont.icon-shigong
                  .title {{ `本产品由${item.finProductInfo.institutionsName}提供` }}
                .product-header
                  img(:src="item.finProductInfo.logoUrl" alt="")
                  .title {{ item.finProductInfo.name }}
                .product-content
                  .product-data
                    .loan-limit-box.c-column
                      .value {{ `${item.finProductInfo.loanLimitBegin}-${item.finProductInfo.loanLimitEnd}万元` }}
                      .label {{ '贷款额度' }}
                    .rate-range-box.c-column
                      .value {{ `${item.finProductInfo.rateRangeBegin}%-${item.finProductInfo.rateRangeEnd}%` }}
                      .label {{ '参考利率(年化)' }}
                    .loan-period-box.c-column
                      .value(v-if="item.finProductInfo.loanPeriodBegin === 0") {{ `${item.finProductInfo.loanPeriodEnd}个月及以下` }}
                      .value(v-else) {{ `${item.finProductInfo.loanPeriodBegin}-${item.finProductInfo.loanPeriodEnd}个月` }}
                      .label {{ '贷款期限' }}
                  .product-info
                    .guarantee-mode-box.c-row
                      .label {{ '担保方式：' }}
                      .value(v-if="item.guaranteeMode + ''") {{ item.finProductInfo && formatMode(item.finProductInfo.guaranteeMode, guaranteeModeList, item.finProductInfo.guaranteeModeExtra) }}
                    .product-source-box.c-row
                      .label {{ `产品来源：${item.finProductInfo.institutionsName}` }}
                .product-footer
                  .product-tag
                    .tag-box(v-for="(tagItem, index) in getTabName(item)" :key="index" :class="tagItem.class")
                      .tag-name {{ tagItem.tag }}
                  .product-operation
                    .operation-box(@click.stop="collectionClick(item.finProductInfo)")
                      i.iconfont(class="icon-shouzanghou")
                    .operation-box(@click.stop="applyClick(item.finProductInfo)")
                      i.iconfont.icon-shenqing
                    .operation-box(@click.stop='handleCompare(item.finProductInfo)')
                      i.iconfont.icon-duibi
            u-loadmore(:status="loadMoreStatus" @loadmore="getMore")
          CProductContrast(ref="CProductContrastRef")
</template>

<script setup lang="ts">
import { ref, reactive, type Ref, onMounted } from 'vue'
import Layout from '@/components/layout/index.vue'
import type { PageItem } from '@/api/user/type'
import { collectionSave } from '@/api/financeProduct/index'
import { userCommonStoreHook } from '@/store/modules/common'
import { formatMode } from '@/util/utils'
import type { DictListItem } from '@/api/index/types'
import type { CollectionParamsType, ProductListItem } from '@/api/financeProduct/types'
import type { ApiResponse } from '@/common/http/types'
import { collectionList } from '@/api/user'
import { preview } from '@/api/common'
import { onShow } from '@dcloudio/uni-app'
import { toast } from '@/common/uni-utils'
import { cancelCollection, productApplyHandle, setProductContrast } from '@/hooks/common'
import { linkJump } from '@/common/common'
import CProductContrast from '@/components/c-product-contrast/index.vue'
const commonStoreHook = userCommonStoreHook()
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
const guaranteeModeList: Ref<DictListItem[]> = ref([]) // 担保方式
// 产品申请
const { linkProductApply } = productApplyHandle()
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
  let params = {
    page: page.currentPage,
    limit: page.pageSize,
    isApplets: '1' // 代表是否是小程序轮播图，固定传 "1"，代表是
  }
  loadMoreStatus.value = 'loading'
  collectionList(params)
    .then(result => {
      let data = result.page
      data.list.map((item: ProductListItem) => {
        if (!item.finProductInfo) item.finProductInfo = {}
        if (item.finProductInfo.logoFileId) {
          item.finProductInfo['logoUrl'] = preview(item.finProductInfo.logoFileId)
        }
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
// 取消收藏
const collectionClick = (item: ProductListItem) => {
  if (!item.id) return
  uni.showModal({
    content: `您确定取消收藏${item.name}吗?`,
    success: (result: UniApp.ShowModalRes) => {
      if (result.confirm) {
        let params: CollectionParamsType = {
          collectionType: 1,
          finProductInfoId: item.id
        }
        collectionSave(params).then(<T,>(result: ApiResponse<T>) => {
          toast.show('取消成功', 'none', 1500)
          getListData(true)
        })
      }
    }
  })
}
// 产品申请
const applyClick = async (item: ProductListItem) => {
  if (!item.id) return
  if (item.dataStatus === 1) {
    cancelCollection(item, (result: boolean) => {
      result && getListData(true)
    })
    return
  }
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
  if (!item.id) return
  if (item.dataStatus === 1) {
    cancelCollection(item, (result: boolean) => {
      result && getListData(true)
    })
    return
  }
  linkJump(`/pagesFinanceProduct/productDetail/index?id=${item.id}`)
}
onMounted(() => {
  // 获取担保方式
  getGuaranteeMode()
})
onShow(() => {
  // 获取产品列表
  getListData(true)
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
